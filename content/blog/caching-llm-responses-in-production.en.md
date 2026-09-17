---
title: "How to Cache LLM Responses and Cut Your AI Costs"
description: "Three caching strategies for AI products — prompt caching, semantic caching, and exact response caching — with practical tradeoffs and code."
date: "2026-07-13"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["caching", "llm", "cost", "latency", "production", "ai-products"]
---

If you've shipped an AI feature into production, you've probably felt the double pinch: responses are slow, and the API bills climb fast. Caching is the fix that most teams underuse — not because it's hard, but because "caching LLM responses" sounds contradictory. The whole point of an LLM is that it generates fresh text. What could you possibly cache?

More than you think. There are three distinct caching strategies for AI products, each solving a different problem. Using the right one for each situation can cut latency by 60–80% and reduce your token spend significantly. Let's walk through them.

## Why Caching LLM Responses Matters

Two things make AI products expensive to run: compute (the cost per token) and round-trip time (how long users wait for a response). These are compounded — you're paying for tokens *and* the user is watching a spinner.

The instinct to cache doesn't come naturally when you're building an AI product, because the whole "magic" feels like real-time generation. But look at your production logs and you'll almost certainly find:

- The same system prompt repeated on every request (sometimes thousands of times per day)
- Identical or near-identical questions hitting your endpoint repeatedly
- Responses that don't need to be fresh — a product description, a help article, a templated onboarding message

Caching doesn't break the magic. It makes the magic fast.

## Strategy 1: Prompt Caching (Built-in, Provider-Level)

The simplest win: most major LLM providers now offer **prompt caching** at the API level. When you mark part of your prompt as cacheable, the provider stores the KV (key-value) computation so they don't recompute it on the next call with the same prefix.

Anthropic's prompt caching reduces input token costs by up to 90% for cached portions and cuts latency on subsequent calls. The catch: the prefix must be identical across calls. So this works best for your **system prompt** — which typically doesn't change per user.

```typescript
const response = await anthropic.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: SYSTEM_PROMPT, // long, expensive, static
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: userMessage }],
})
```

The cache TTL is typically 5 minutes (ephemeral), so this only helps when you have burst traffic or repeat requests within that window. For high-traffic apps, that's most of the time.

> **Rule of thumb:** If your system prompt is more than 1,000 tokens, enable prompt caching today. It's a one-line change with measurable impact.

## Strategy 2: Exact Response Caching (For Deterministic Prompts)

If you have prompts where the input is the same and the output doesn't *need* to vary — think: "summarize this changelog", "extract the key points from this FAQ", or "generate the welcome message for a new user" — you can cache the entire response.

The key is setting `temperature: 0` to make the output deterministic, then caching based on a hash of the full prompt.

A Redis-backed pattern in Node.js:

```typescript
const cacheKey = `llm:${hash(systemPrompt + userMessage)}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)

const response = await callLLM(systemPrompt, userMessage)
await redis.setex(cacheKey, 3600, JSON.stringify(response)) // 1-hour TTL
return response
```

This is aggressive but highly effective for read-heavy use cases: help docs, product descriptions, static educational content. It also completely protects you from provider outages for those paths.

The downside is staleness risk. Set TTLs carefully, and build an invalidation hook so you can clear the cache when the underlying content changes. For AI features tied to dynamic data — user context, live inventory, real-time state — exact caching is usually the wrong tool.

## Strategy 3: Semantic Caching (For Conversational Products)

The most sophisticated strategy — and the most impactful for user-facing AI features — is **semantic caching**. Instead of caching on exact string match, you embed the user's query and look for *semantically similar* past queries in a vector store.

If a user asks "how do I reset my password?" and a previous user asked "I forgot my password, what do I do?", a semantic cache can return the stored answer rather than making a new LLM call.

The flow looks like this:

1. Embed the incoming user query
2. Search your vector store for similar queries (cosine similarity above a threshold)
3. If a match is found, return the cached response
4. If not, call the LLM and store the new (query, response) pair

The similarity threshold is your main tuning knob. Too strict and you get almost no cache hits. Too loose and you serve wrong answers. Start at `0.92` and tune from your eval set.

### When Semantic Caching Backfires

Semantic caching assumes that semantically similar *questions* have semantically similar *good answers* — which isn't always true when context matters.

"What's my account balance?" asked by User A and User B are semantically identical but should never share a cached response. Any prompt that contains personalized data, session state, or time-sensitive content is a semantic caching antipattern. Guard against this by scoping your cache keys per-user or by explicitly excluding certain intents from the cache entirely.

This is exactly why [writing solid LLM evals](/blog/how-to-write-llm-evals-for-your-ai-product) before you deploy semantic caching pays off — you need a baseline to know when a cached response is actually good, not just fast.

## Layering the Three Strategies

Most production AI products benefit from all three layers working together:

| Layer | What it caches | Best for |
|---|---|---|
| Provider prompt caching | System prompt KV computation | Every product with a static system prompt |
| Exact response cache | Full (prompt → response) pairs | Deterministic, static-content prompts |
| Semantic cache | Similar-intent queries | Conversational features, help, and FAQ |

The latency improvement stacks: provider caching shaves the model's warm-up time, exact caching eliminates the LLM call entirely, and semantic caching catches the long tail of similar questions your users keep asking.

If you're just starting out, add prompt caching first — it's the lowest-effort, highest-certainty win. Then layer in exact response caching for your most repetitive prompts. Save semantic caching for when you have solid evals and enough traffic to justify the vector infrastructure.

## One Thing to Watch

Caching can mask prompt regressions. If you update your system prompt but cached responses still serve from the old version, users see stale behavior and your evals don't catch it.

Build cache invalidation into your [AI response pipeline](/blog/streaming-responses-ai-products) from the start — whether that means versioning your cache keys by prompt hash or adding a manual "clear cache" step to your release checklist. The [Building AI Products](/blog/category/building-ai-products) discipline applies here too: ship deliberately, verify with real data, invalidate thoughtfully.

The goal is speed and economy *without* hiding what your AI is actually doing. Cache the output. Never cache the understanding.
