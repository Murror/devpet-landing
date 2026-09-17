---
title: "Model Routing: Use the Right LLM for Each Job in Your Product"
description: "Smart AI products don't run every task through your most expensive model. Here's how to route between LLMs by task complexity — and cut costs without sacrificing quality."
date: "2026-07-19"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["llm", "model-routing", "cost-optimization", "ai-products", "architecture", "building-ai-products"]
---

There's a quiet assumption hiding in most early AI products: one model, every task.

It makes sense when you're starting out. Pick the best model you can access, route everything through it, ship. The product works. Users are happy. Bills are... not terrible yet.

Then you scale. Suddenly every user interaction costs real money, latency has become a complaint, and you're doing the math on what it'll look like at 10x your current usage. That's when you realize you've been routing a question like "what's 2+2?" through the same model you use to generate an entire technical design document.

Model routing fixes that. It's not complicated — but it's one of the highest-leverage moves you can make once your AI product is past the demo stage.

## What Model Routing Actually Is

Model routing means dispatching different tasks to different LLMs based on what the task actually needs. Cheap, fast models handle simple jobs. Powerful, expensive models handle the work that genuinely requires depth.

In practice, it usually looks like two or three tiers:

- **Fast tier** — a smaller, low-latency model (like Claude Haiku or GPT-4o mini) for classification, short summaries, intent detection, and anything that just needs to be *right* without being brilliant.
- **Standard tier** — a mid-range model (Claude Sonnet, GPT-4o) for generation tasks that need coherent multi-paragraph output, light reasoning, or following complex instructions.
- **Power tier** — your most capable model (Claude Opus, o1) reserved for tasks that genuinely need it: architectural analysis, nuanced feedback, multi-step reasoning.

The key insight is that task complexity is not uniformly distributed across your product. Most requests are simple. A few require real horsepower. Routing lets you match cost to actual need instead of paying power-tier prices for everything.

## How to Decide Which Tier Gets Which Task

Start by cataloguing the AI calls in your product. For each one, ask: what does failure look like here, and how good is "good enough"?

A chatbot greeting message that personalizes by username? Good enough is extremely easy to hit — a small model handles it fine. A code review that needs to catch subtle logic errors in a 300-line function? That's a power-tier task where a confident but wrong answer is worse than a slower, expensive correct one.

Some heuristics that work across most products:

- **Output length is a proxy for complexity.** If the task produces a sentence or two, a fast model almost certainly works. If it produces multiple paragraphs of structured reasoning, escalate.
- **Structured extraction is cheaper than generation.** Pulling specific fields from a block of text (classify this sentiment, extract these entities, does this match this schema) is often well within a small model's capability.
- **Conversational context matters.** A follow-up question in an ongoing conversation usually costs less than the first deep-dive response — the heavy lifting is already done.
- **When user trust is directly on the line, don't route cheap.** If a wrong answer would make a user distrust the product entirely, the power tier is worth the cost.

## A Simple Routing Layer in Practice

The fastest implementation is a function that takes a task type and returns a model ID. No magic required:

```typescript
type TaskTier = 'fast' | 'standard' | 'power'

const MODEL_FOR_TIER: Record<TaskTier, string> = {
  fast:     'claude-haiku-4-5-20251001',
  standard: 'claude-sonnet-5',
  power:    'claude-opus-4-8',
}

function routeToModel(taskType: string): string {
  const tier = TASK_TIERS[taskType] ?? 'standard'
  return MODEL_FOR_TIER[tier]
}

const TASK_TIERS: Record<string, TaskTier> = {
  'intent-detect':      'fast',
  'short-summary':      'fast',
  'content-classify':   'fast',
  'draft-reply':        'standard',
  'explain-concept':    'standard',
  'code-review':        'power',
  'architecture-plan':  'power',
}
```

This is deliberately boring. That's the point. The routing decision is explicit and inspectable — you can see exactly why a task goes where it goes, and changing it takes one line. No black-box inference layer deciding where your API dollars go.

As you learn which tasks are actually causing quality problems, you adjust the map. A task that started as `fast` might get promoted to `standard` when you discover edge cases. A task that started at `power` might safely drop to `standard` after testing proves it holds.

> The routing layer is also where you add fallbacks. If the power model times out or errors, you can retry on standard rather than surfacing a failure. Tier degradation is a useful pattern — serve a slightly worse response rather than no response.

## The Economics

Rough numbers to illustrate the shape of the savings (exact costs vary by provider and change over time — always check current pricing):

If your fast tier runs at ~1/10th the cost of your power tier, and 70% of your calls are genuinely fast-tier tasks, you're paying for power only where it matters. A product doing 100k requests/month might spend 3–4x more on the naïve "power tier for everything" approach than on a properly routed stack.

The other gain is latency. Small models respond faster — often significantly faster. For user-facing interactions, this is sometimes more important than the cost. A user asking a quick question shouldn't wait four seconds for the same response a small model could return in under one.

## Where Routing Gets Tricky

A few things to watch:

**Don't over-classify upfront.** If classifying every incoming request into a tier requires an LLM call, you've added cost and latency before the actual task even runs. Use rule-based routing for known task types (you launched this UI element, you know what it does). Reserve dynamic classification for open-ended inputs.

**Tier blurring happens.** A task you classified as "simple" will eventually get a hard input. Build monitoring so you can see when fast-tier tasks produce outputs users flag as wrong, and use that signal to reclassify.

**Test the cheaper model seriously.** Don't assume the small model fails without actually testing it on your task. Especially for well-defined structured tasks, you may be surprised. See [how to write LLM evals for your AI product](/blog/how-to-write-llm-evals-for-your-ai-product) for a practical way to run that comparison.

**Keep the routing logic in one place.** Scattered `if env === 'prod' use cheaper model` logic is how routing becomes debt. The `TASK_TIERS` map approach above means your routing decisions are visible and version-controlled.

## Where to Start

If you've never done model routing, start with exactly two tiers — not three. Pick one or two tasks in your product that you're confident are simple and well-defined. Move those to your fast tier. Measure quality. If it holds, expand the list.

Don't try to route everything on day one. The goal is to establish the infrastructure and the discipline, then iterate. The routing layer is just a map — it gets better as you learn more about your workload.

For most products, the biggest cost and latency wins come from the first routing pass: the moment you stop routing "is this a valid email address?" through your most powerful model.

You can pair this with [response caching](/blog/caching-llm-responses-in-production) for a compounding effect — route cheap tasks to a fast model, and cache those responses for repeated inputs. That's where the economics start to look genuinely good. The [Building AI Products](/blog/category/building-ai-products) category has more on both.

**The takeaway:** your AI product almost certainly has tasks that don't need your best model. Finding those tasks and routing them correctly is one of the lowest-risk, highest-leverage improvements you can make. Start small, measure everything, and let the data tell you where to escalate.
