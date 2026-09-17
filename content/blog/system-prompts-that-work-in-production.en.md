---
title: "How to Write System Prompts That Actually Work in Production"
description: "Most system prompts are written for demos. Here's a practical framework for prompts that stay reliable when real users—and real edge cases—arrive."
date: "2026-06-16"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["system-prompt", "prompt-engineering", "llm", "ai-products", "ship", "production"]
---

The moment you push an AI feature to production, the gap between "it works in my tests" and "it works for my users" becomes very real, very fast.

Most teams write a system prompt during a one-afternoon prototype, tweak it until the demo looks good, and ship it. Then the edge cases arrive: the user who phrases things differently, the context that's longer than expected, the question the model was never designed to answer — but answers cheerfully anyway. The system prompt that looked great at 11 p.m. on a Friday becomes a liability by Monday.

This isn't bad luck. It's a structural problem with how system prompts are usually written — and it has a fix.

## Why system prompts fail (and why it's rarely the model's fault)

The first instinct when an AI feature misbehaves is to blame the model. Swap the model, the logic goes, and things improve. But most reliability problems aren't model problems — they're prompt problems.

System prompts fail for a handful of predictable reasons:

- **They describe the happy path only.** The prompt explains what the model should do when everything goes right. It's silent on what to do when the user asks something off-topic, provides incomplete input, or wants something the feature wasn't designed for.
- **They're tuned on demo-speak.** Real users write casually, abbreviate, and make grammatical errors. Prompts refined on polished test inputs often behave strangely on messy real ones.
- **Constraints are implicit.** The author knew what the feature wasn't supposed to do — but never told the model. Without explicit constraints, the model fills in the blanks, usually in unexpected ways.

## The four parts of a working system prompt

A production-ready system prompt doesn't need to be long. It needs to be *complete*. Four parts cover most cases:

### 1. Role — who the model is

Start with a crisp identity statement. Not just "you are a helpful assistant" — something specific enough to actually constrain behavior.

```
You are a coding coach inside the Codepet app.
You help beginners understand why their code does what it does
— not just what to change.
```

The role anchors everything else. When the model hits an edge case you didn't predict, a clear role gives it something to reason from.

### 2. Context — what the model knows

Give the model the facts it needs: the user's situation, the product's purpose, the data it's working with. Don't make it infer things you already know.

```
The user is working in Python. Their current exercise is
about loops. Relevant code: {user_code}
```

Inject dynamic context here with template variables. Keep this section factual and tight.

### 3. Constraints — what the model must not do

This is the section most prompts skip — and the most valuable one in production. Be explicit about the edges:

```
Do not write the solution for the user. If asked directly,
redirect with a guiding question. Stay on the topic of the
current exercise — do not answer unrelated coding questions.
```

Explicit constraints prevent the model from "helpfully" doing things that break your product's purpose. Write them for the failure modes you've already seen — and the ones you can imagine.

### 4. Output format — exactly what you want back

If your UI expects a specific shape, tell the model. If you want JSON, say so and give an example. If you want a short paragraph, give an approximate word count.

```
Respond in 2–3 short sentences. Friendly, encouraging tone.
No code in your response unless the user shared code first.
```

For structured outputs, include an example schema. Models follow examples more reliably than abstract descriptions.

## Three things that move the needle in practice

Beyond the four-part structure, a few tactics separate prompts that hold up under load from ones that don't:

**Write for failure modes, not for success.** After your first week in production, pull a sample of outputs and look specifically for the bad ones. Every bad output is a constraint you didn't write. Add it.

**Use few-shot examples inside the prompt.** For nuanced tasks — tone, level of detail, handling ambiguous questions — a few concrete input/output pairs beat lengthy instruction paragraphs. The model reads the room from examples faster than from abstract rules.

**Pin the format, not the content.** The model's vocabulary is more flexible than yours. Trust it to choose words. Don't trust it to choose structure. Over-constraining content makes outputs feel robotic; under-constraining format makes them unpredictable.

## Testing your prompt before it becomes a bug report

The best time to catch a broken prompt is before it ships. Even a lightweight eval loop — [10–15 golden test cases](/blog/how-to-write-llm-evals-for-your-ai-product) that cover your core flows and your known edge cases — will catch most regressions before your users do.

Run those cases after every prompt change. A prompt change that improves the happy path but breaks three edge cases isn't an improvement; it's a trade-off you made without knowing.

> The goal isn't a perfect prompt. It's a prompt you can change with confidence — because you know what it's supposed to do, and you can verify it.

## When to add vs. when to restructure

As prompts age, there's a temptation to patch them: add one more constraint, one more paragraph, one more caveat. This works for a while. Then the prompt becomes a 2,000-token wall of text that contradicts itself and confuses the model as much as it guides it.

A better heuristic: if a single well-placed constraint or example fixes the problem, add it. **If you're writing around a fundamental mismatch between the role and what users actually want, restructure.**

The mismatch usually surfaces when you notice you're fighting the model — adding constraints to undo what earlier instructions caused. That's the sign to step back and rewrite from the role definition down.

## Start small, iterate often

The system prompt that ships with your feature on day one won't be the one that's working well on day 30. That's fine — it's supposed to evolve. What matters is that you have a process: write deliberately, test against real cases, and treat every failure as a new data point.

For builders working on [AI products](/blog/category/building-ai-products), the system prompt is one of the highest-leverage places to spend time. It's the one piece of work where a focused rewrite can change the entire character of a feature — more than almost anything else in the stack.

Write it like it matters. Because once real users arrive, it does.
