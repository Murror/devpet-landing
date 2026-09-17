---
title: "How to Scope an AI Feature Before You Build It"
description: "Most AI features fail before they're built — because the scope was wrong. A practical framework for defining what your AI should do, how good is good enough, and when to stop."
date: "2026-07-04"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "product-building", "feature-development", "llms", "prompting"]
---

The most common failure mode when building AI features isn't the model or the prompt. It's the scope.

AI features are seductive. You imagine the magic, you start prompting, and a week later you have something that *almost* works in a way that's *almost* useful. Then you spend three more weeks chasing the "almost." After building Codepet's core AI features — and watching how other indie builders approach their own AI projects — we've learned that the time to get precise isn't during implementation. It's before you write a single line of code.

## Define the job before you pick the tool

Before you choose a model, write a system prompt, or add an API key, answer this question: **what decision or action should this feature enable?**

AI features fail when the answer is vague ("it helps users understand things better") or too broad ("it answers any question about the app"). The more specific you can get, the faster you'll know whether you're building the right thing.

For Codepet's feedback feature, the job was narrow: look at what a learner just built, spot where they misunderstood a concept, and ask *one question* that surfaces the gap. Not explain the concept. Not suggest a fix. Just ask one question. That constraint made everything downstream easier — the system prompt shorter, the eval criteria obvious, the edge cases manageable.

> **The test:** Can you write three concrete things this feature *should* do, and three things it explicitly *should not* do? If you can't, the scope isn't done.

## Decide what "good enough" looks like

LLMs output a distribution — sometimes great, sometimes mediocre, occasionally useless. Scoping means deciding where on that distribution your users can tolerate landing.

Ask two questions before you build anything:

1. **What's the cost of a bad response?** An AI that occasionally writes an awkward commit message is low-stakes. An AI that gives wrong architectural advice is high-stakes.
2. **How often does it need to be right?** A 70% success rate might be acceptable for "suggest a tag for this note." It's nowhere near acceptable for "review this code before it ships."

These answers drive your architecture. Low-cost, moderate accuracy? A single fast model call with a tight prompt will do. High-cost, high accuracy? You'll want [evals in place](/blog/how-to-write-llm-evals-for-your-ai-product), a thoughtful fallback, and probably a slower, more capable model.

Don't guess at this. Write it down before you build.

## Map the edge cases on paper

The biggest scoping mistake is building for the happy path — the user who provides exactly the right input, at exactly the right moment.

Spend 20 minutes listing the failure modes:

- What if the user provides almost no context?
- What if the input is in a different language than expected?
- What if the user asks something completely off-topic?
- What if the model returns something misleading or wrong?

You don't have to solve every case before you build. You do need to *know they exist* and decide how you'll handle them. The worst time to think about edge cases is when a real user hits one in production.

A useful exercise: write five "bad input" examples and trace what your ideal feature would output for each. This almost always surfaces scope assumptions you didn't know you were making.

## Pick the right model tier for the job

Not every AI task needs your most capable model. Scoping means matching the tool to the job — not defaulting to the biggest or newest option.

```text
Simple classification (is this message on-topic?)       → fast, cheap model
Multi-step reasoning (explain why this logic fails)     → capable model, more tokens
Structured extraction (parse intent to a JSON schema)   → instruction-following + structured outputs
Long document analysis (summarize a long spec)          → model with large context window
```

More capability isn't always better. A simpler model often responds faster, costs less, and is easier to evaluate consistently. The [system prompts that hold up in production](/blog/system-prompts-that-work-in-production) tend to be for narrower, better-scoped tasks — not open-ended prompts trying to do too much. If your prompt is doing ten things, that's a scoping problem, not a prompting problem.

## Draw the user moment, not just the feature

AI features live inside a user flow. Before you finalize scope, draw the moment:

- What has the user just done?
- What do they expect to happen next?
- How will they know the AI responded well?
- What do they do when it responds badly?

A lot of AI features *feel* wrong not because the output is bad, but because the moment is wrong — the feature fires too early, too late, or in response to a question the user wasn't actually asking.

Scoping the moment is as important as scoping the prompt. A five-minute sketch in the notes app is usually enough.

## A lightweight scoping checklist

Before you write your first line of code:

- [ ] Written the job in one sentence (what it enables, not what it is)
- [ ] Defined three explicit "does" and three "does nots"
- [ ] Set the acceptable success rate and named the cost of failure
- [ ] Listed five bad-input edge cases and described ideal handling for each
- [ ] Chosen a model tier based on accuracy, latency, and cost needs
- [ ] Sketched the user moment — what just happened, what should happen next

None of this takes long. The whole checklist is a 30-minute conversation with yourself — or with your co-founder, your first user, or an AI you're briefing the same way you'd brief a teammate.

## Ship the narrow version first

Good scope doesn't mean small scope forever — it means small scope *to start*. Build the narrow version, put it in front of one real user, and see whether the job you scoped is actually the job they needed.

Every AI feature we've shipped at Codepet ended up with a different scope six weeks after launch. Not because the original scope was wrong — but because real use always reveals something the spec didn't.

The goal of scoping isn't to get it perfect before you build. The goal is to be specific enough that "did this work?" has a clear answer after you ship — and you can make the next iteration count.

That's the only kind of velocity that compounds.
