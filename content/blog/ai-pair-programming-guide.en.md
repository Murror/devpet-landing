---
title: "How to pair program with AI: a guide for solo builders"
description: "Pair programming with AI is a real workflow, not just autocomplete. Learn the driver-navigator model, rubber-duck debugging, and when to take back the wheel."
date: "2026-07-11"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "pair programming", "workflow", "indie hacking", "productivity", "coding"]
---

If you learned about pair programming in a textbook, it sounds like something for teams at big tech companies — two engineers sharing a keyboard, one typing while the other thinks out loud. Not exactly the indie-builder workflow.

But that framing has quietly become useful again, because AI is now a credible second seat. The question isn't whether to pair with AI — most builders already do, informally. The question is whether you're doing it *intentionally*, in a way that actually makes you faster and sharper.

This post walks through how to turn ad-hoc AI usage into a genuine pair-programming practice: specific techniques, a sample session flow, and the places where the analogy breaks down.

## Why "pair programming" is the right mental model

The traditional model has two roles: the **driver** writes code, and the **navigator** thinks about structure, spots problems, and looks ahead. They swap. Neither is permanently "in charge."

What makes this framing useful with AI is the same thing that makes it useful between two humans: **the act of explaining what you're trying to do forces clarity**. When you describe a problem to your AI partner in enough detail to get useful output, you've often already found half the bug.

The difference from solo AI coding is intention. Vague prompts get vague code. But if you approach each AI session as a pairing session — you're the navigator setting direction, the AI is driving — the quality of what you put in (and what comes out) goes up noticeably.

## The driver-navigator swap

A practical setup for each chunk of work:

1. **Start as navigator.** Describe the feature, constraint, and expected output in plain language. Treat this like a brief to a capable engineer who hasn't seen your codebase.
2. **Review the driver's output.** Don't just paste and run. Read the code the AI produced as if you were reviewing a PR. Where are the assumptions? What edge cases are missing?
3. **Swap.** Write the next step yourself, then hand back. Or, if the AI's approach is wrong, take the keyboard entirely and refactor — then re-brief for the next chunk.

The key is the swap. Staying in navigator mode indefinitely leads to exactly the [comprehension debt](/blog/comprehension-debt-the-hidden-cost-of-coding-with-ai) that makes AI-assisted code brittle over time. The engineer who reviews but never writes is not actually building.

## Rubber-duck debugging with a duck that talks back

Classic rubber-duck debugging works because articulating a problem out loud forces you to structure it. An AI is a rubber duck that structures *back* — it surfaces hypotheses, asks clarifying questions, and lets you rule things out faster than staring at a diff.

When you hit a bug, try this before pasting the error:

```
I'm seeing [symptom]. Here's what I expected: [expected behavior].
Here's what's actually happening: [actual behavior].
My current hypothesis is [hypothesis]. What am I probably missing?
```

This prompt structure forces you to form a hypothesis before you ask — which often surfaces the answer on its own. When it doesn't, the AI's response narrows the search space rather than producing a generic suggestion.

> The best debugging sessions aren't the ones where the AI finds the bug fastest. They're the ones where you understand the codebase better at the end than you did at the start.

## Giving your AI partner useful context

In human pair programming, the navigator holds context the driver doesn't have to track — the business logic, the existing architecture, the decisions already made. When pairing with AI, you have to supply that context explicitly, every session.

A few things that consistently improve output quality:

- **Share the constraint, not just the task.** "Add a retry mechanism" is weaker than "Add a retry mechanism — this is a macOS app with flaky connectivity, and we can't block the main thread."
- **Paste the relevant types and interfaces.** AI hallucinates less when it can see the actual shape of your data.
- **Mention what you've already tried.** This stops the AI from cycling back to approaches you've ruled out.
- **Name the fidelity you want.** "Sketch the structure" versus "production-ready, handle edge cases" produce very different outputs. Both are useful at different stages.

For a deeper look at context-giving technique, see [how to give AI context that actually helps](/blog/how-to-give-ai-context).

## When to take the wheel back entirely

There are moments where you should stop pairing and just write the code yourself:

**When the domain logic is genuinely novel.** AI reasoning on well-trodden patterns — CRUD, auth flows, parsing, standard UI components — is strong. On something genuinely unique to your product (a specific algorithm, a domain constraint that doesn't appear in public training data), it often confabulates confidently. Write that part yourself, then let AI help test it.

**When you've accepted three suggestions in a row without reading them.** This is the crutch pattern. Stop, re-read the last 20 lines you merged, and make sure you can explain every decision. If you can't, you've swapped a real problem for a faster one.

**When a refactor involves the whole shape of a module.** AI is good at local transformations. Major architectural changes benefit from being thought through by a human first — then hand the AI the plan and let it help execute, not invent.

## A sample 45-minute pairing session

Here's what a focused session looks like in practice:

**Minutes 0–5: brief the room.**
Write a short paragraph describing what you're building, what already exists, and what done looks like. This brief is ostensibly for the AI — but writing it also clarifies your own thinking. Many bugs are avoided here.

**Minutes 5–25: drive in well-scoped chunks.**
Hand over one clearly-defined task at a time. Review the output. Swap or iterate. Resist accepting anything you can't explain.

**Minutes 25–35: write the hard part yourself.**
Identify the piece most specific to your product logic — the part where the AI is most likely to guess. Write it without assistance. This is where you earn the understanding that makes the rest maintainable.

**Minutes 35–45: let AI write the tests.**
AI is excellent at generating edge-case tests once it has working code to examine. Give it the function, ask for cases you might have missed, review and add the ones that feel right. This is one of the genuinely high-leverage uses.

## The question to answer before closing the tab

Before you end the session, ask: *Could I rebuild the core logic of what we just shipped, from scratch, without the AI's help?*

Not "could I reproduce it exactly" — but "do I understand it well enough to defend it in a code review, extend it next week, and debug it when it breaks?"

If yes, the session worked. If no, you've taken on [comprehension debt](/blog/comprehension-debt-the-hidden-cost-of-coding-with-ai) that will compound.

Pair programming with AI isn't a shortcut to shipping more code faster. Done well, it's a practice for shipping real things while staying the engineer who understands what's running in production. That distinction is worth protecting.
