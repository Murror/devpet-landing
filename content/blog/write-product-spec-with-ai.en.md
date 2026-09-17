---
title: "How to Write a Product Spec with AI Before You Write Any Code"
description: "A practical approach to drafting a product spec with AI that surfaces edge cases, aligns your thinking, and saves you from building the wrong thing."
date: "2026-06-30"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["product spec", "planning", "AI", "product design", "indie hacker", "shipping"]
---

There's a moment every builder knows: you have a clear picture of what you want to make, you can feel the energy, and opening your editor feels like the most natural next step. So you open it. You start typing. Two weeks later you're staring at a half-built thing that doesn't quite solve the problem you set out to fix, with a list of edge cases you never considered and a vague sense that you should have thought about this differently from the start.

The tool that's supposed to speed this up — AI — can actually make this worse. Because AI lets you write code so fast that you can code the wrong thing very efficiently.

The fix is one step you probably know and skip: write the spec first.

## Why specs matter more in the AI era, not less

When coding was slow, you had time to think. Typing forced you to confront inconsistencies. Now you can describe a feature in a sentence and have working code in seconds. That's genuinely wonderful — but the thinking gap that used to be filled by slow coding still exists. It just isn't filled anymore.

The product spec is where that thinking happens. A spec is a short document that answers: what are we building, who is it for, what problem does it solve, and what does "done" look like? It doesn't have to be long. A strong spec for a single feature can be three hundred words. But those three hundred words do something no amount of AI-generated code can do: they force you to be coherent before you're fast.

Builders who spec before they code tend to build fewer features and ship more of them. That's a consistent pattern in [what happens when you actually ship](/blog/what-happens-when-you-actually-ship): the people who finish are the ones who started with a clear target.

## The five-part spec structure that works

A good spec for a feature or small product has five sections. Keep them short and specific.

**1. Problem.** What's broken, missing, or frustrating right now? Who experiences it? Write one paragraph, not a thesis.

**2. Users.** Who specifically are you building for? Not "developers" — "solo founders who use VS Code and don't have a QA team." Specificity here prevents you from trying to satisfy everyone.

**3. Solution.** What are you actually building? Describe it from the user's perspective: "The user uploads a file, sees a preview, then confirms before processing." Avoid implementation details at this stage.

**4. Success criteria.** How do you know this worked? One to three measurable outcomes. "Users complete the upload flow without contacting support" is better than "it's intuitive."

**5. Out of scope.** List two or three things you're deliberately not building. Out-of-scope decisions are often the most useful part of the spec — they prevent scope creep before it starts.

## Using AI to write the spec, not just the code

Here's where the real leverage is. You can use AI to help write the spec itself, and it's surprisingly effective at catching gaps in your thinking. The key is not asking AI to write the spec for you — it's using AI as a collaborator to stress-test what you already have in mind.

Start with a brain dump:

```
I want to build [rough description]. The user would [intended action] 
and then [outcome]. It's for [audience]. Help me draft a product spec 
using this structure: Problem / Users / Solution / Success criteria / 
Out of scope.

Push back on anything that seems vague or inconsistent. Ask me 
clarifying questions before you write anything.
```

That last instruction matters. Without it, AI will produce a plausible-sounding spec that papers over your confusion. With it, AI acts more like [a thought partner than a search engine](/blog/ai-as-thought-partner-not-search-engine) — it surfaces the questions you haven't answered yet.

The clarifying questions are the value. "What happens if the file is corrupt?" "Is this feature gated to paid users?" "What's the fallback if processing fails?" These are the edge cases you'll hit in week two if you don't face them now.

## Let AI play devil's advocate on your spec

Once you have a draft, run this prompt:

```
Here's my spec: [paste spec].

Take the role of a skeptical engineer who has seen too many vague specs 
cause two-week debugging sessions. Point out: (1) anything underspecified, 
(2) edge cases I haven't addressed, (3) anything that would be harder to 
build than I seem to think. Be direct.
```

> A spec with red marks is a spec doing its job. Every gap you find here is a bug you're preventing before it hits production.

Don't treat every piece of pushback as a reason to over-engineer. Some edge cases genuinely don't matter for a v1. But knowing about them before you build means you're making that call deliberately — not discovering it at 11pm.

## When to stop speccing and start building

This is where people get stuck in the other direction. A spec is a planning tool, not a life commitment. If you're on revision five and mostly moving commas around, you've hit the point of diminishing returns.

The signal to start building: you can explain the feature in a paragraph and someone else can ask you specific questions about it. Not "how does it work?" but "what happens when they close the browser mid-upload?" When the questions get specific, your thinking is specific. Build.

For fast solo projects, a spec doesn't need to live in a document at all. You can run this as a 10-minute conversation with AI before opening your editor. The artifact isn't the point — the clarity is.

## The concrete takeaway

Before you write your next feature, spend 15 minutes on a spec. Use AI to draft it with you, then run the devil's advocate prompt. Your spec should be clear enough that you can describe it to a friend without waving your hands. If you can't explain it, you can't build it — and you definitely can't prompt it.

The [Building AI Products](/blog/category/building-ai-products) section has more on the full cycle from idea to shipped. But this step — spec first — is the one most builders skip and later regret.
