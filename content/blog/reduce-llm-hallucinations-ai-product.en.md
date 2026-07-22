---
title: "How to Reduce LLM Hallucinations in Your AI Product"
description: "Practical techniques for reducing LLM hallucinations in production — grounding, structured outputs, evals, and fallback UX that keeps users trusting your product."
date: "2026-07-22"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["hallucinations", "llm", "reliability", "prompt-engineering", "evals", "ai-product"]
---

There's a specific kind of dread that every AI product builder knows. A user screenshots your product confidently stating something completely wrong — an invented statistic, a nonexistent API method, a policy your product never had. The model hallucinated. And because it sounded so certain, your user believed it.

Hallucinations aren't a bug you can patch out. They're a fundamental property of how large language models work: the model is predicting the next most-likely token based on learned patterns, and sometimes those patterns lead somewhere untrue. The job isn't to eliminate hallucinations entirely — that's not on the table yet. The job is to design your product so hallucinations either don't reach users, or don't cause harm when they do.

Here's what actually moves the needle.

## Ground the model in real data, not memory

The single most effective technique is **giving the model the information it needs, right in the prompt**. Instead of asking the model to recall facts from training, you retrieve the relevant data yourself and inject it into the context.

This is the foundation of Retrieval-Augmented Generation (RAG). Instead of:

```
"What does the user's subscription plan include?"
```

You do:

```
User subscription plan: Pro — unlimited projects, 5 team seats, API access.

Based on the above, what does this plan include?
```

When the model has the right answer in front of it, it doesn't need to invent one. RAG dramatically cuts factual hallucinations for anything domain-specific — your docs, your user's data, your product knowledge base.

> The rule: if the answer exists somewhere in your system, retrieve it first. Don't make the model guess.

[Context Windows for Product Builders](/blog/context-windows-for-product-builders) covers how to think about what you're feeding into that context and how much fits.

## Use structured outputs to contain slippage

Free-form text is where hallucinations hide. When you ask an LLM to return a JSON object with specific fields, the model is constrained to follow a schema — and modern APIs let you enforce that schema at the call level.

Instead of "summarize the user's goals," ask for:

```json
{
  "primaryGoal": "...",
  "confidence": "high | medium | low",
  "sourceQuote": "..."
}
```

Now you have a reliable format your UI can render, a confidence signal to decide whether to surface the result or queue it for review, and a `sourceQuote` field that forces the model to anchor its answer to something real. That last field alone catches a surprising number of invented claims — if the model can't find a quote to cite, it has to say so.

See [Structured Outputs for AI Products](/blog/structured-outputs-for-ai-products) for a full walkthrough of how to wire this up in practice.

## Tighten the system prompt

Hallucinations often happen in the vacuum left by a thin system prompt. A model asked an open-ended question with no guardrails will draw on whatever feels plausible — including invented facts.

A production system prompt for a factual feature should define:

1. **What the model knows** — what sources it can draw on
2. **What to do when uncertain** — "If you don't know, say so. Never guess."
3. **What's off-limits** — topics outside the product's scope

```
You are a coding tutor for beginner developers. You help users understand
errors and concepts in their code.

If asked about topics outside coding, say that's outside your area.

Never invent library versions, API names, or framework behavior you aren't
certain of. If you're unsure, say "Check the official docs for this one."
```

This won't stop all hallucinations, but it creates a perimeter. [System Prompts That Work in Production](/blog/system-prompts-that-work-in-production) goes deeper on how to structure these without making them unwieldy.

## Lower the temperature for factual tasks

Temperature controls how "creative" the model is. For tasks where accuracy matters — data extraction, factual questions, document summarization — set it to 0 or very close. You lose some variation in phrasing, but you get more consistent, grounded outputs.

Keep higher temperatures for creative work: brainstorming, writing variations, generating options. The setting should match the task.

```ts
// Factual extraction — temperature 0
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  temperature: 0,
  messages: [/* ... */],
})

// Creative brainstorm — temperature 0.8
const response = await client.messages.create({
  model: "claude-sonnet-5",
  max_tokens: 1024,
  temperature: 0.8,
  messages: [/* ... */],
})
```

## Ask the model to check its own work

Self-verification is underused. Instead of one model call, make two:

1. **First call**: generate the answer
2. **Second call**: ask the model to check the answer against the source material

```
Does the following answer accurately reflect what's in this document?
Reply YES or NO, then explain any inaccuracies.

Document: [your retrieved source]
Answer: [model's first response]
```

This adds latency and cost, so reserve it for high-stakes features — medical summaries, financial data, legal explanations. But in those contexts, catching one bad output before it reaches a user is worth the extra round-trip.

## Write evals before you ship

The way to catch hallucination patterns before users do is to write evals: automated tests that exercise your AI feature against known-good outputs. A simple set of 20–30 test cases — real inputs with expected outputs — run against every prompt change will surface regressions before they go live.

A hallucination-specific eval can compare model outputs against a set of reference documents and flag responses containing facts not present in those sources. You can start with a spreadsheet and a script before you build anything fancier.

[How to Write LLM Evals for Your AI Product](/blog/how-to-write-llm-evals-for-your-ai-product) walks through the mechanics — it's one of the highest-leverage things you can do before launch and one of the most skipped.

## Design fallback UX into the product

Even with all of the above in place, hallucinations will still slip through. The question is: what does your user see when they do?

Good fallback UX:

- Shows confidence levels alongside outputs ("Based on your plan details")
- Adds "View sources" links for factual claims the model derived from real data
- Includes a quick "Was this helpful?" signal so you can capture errors users notice
- Frames the feature honestly — "AI-assisted — verify for important decisions"

Users are more forgiving of AI being wrong when they know AI is involved and were told to double-check. What erodes trust is confidently-stated falsehoods with no signal that uncertainty was possible. Design for honesty, not omniscience.

## The concrete takeaway

Hallucinations are a property of the technology, not a bug waiting for a fix. What you control is the layering around it:

- **Grounding** — give the model the right data so it doesn't have to guess
- **Structured outputs** — force a schema that anchors claims to sources
- **System prompt** — define what "I don't know" looks like
- **Temperature** — zero for facts, higher for creativity
- **Self-verification** — two-call checks for high-stakes features
- **Evals** — catch regressions before your users do
- **Fallback UX** — set honest expectations in the product itself

Build these seven layers in and most hallucinations become either caught or recoverable. That's not perfect — but it's a product users can trust, which is what actually compounds.
