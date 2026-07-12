---
title: "How vs Why: The AI Question Pattern That Predicts Your Coding Progress"
description: "Learners who ask 'how do I fix this?' get unblocked fast. Learners who ask 'why isn't this working?' build durable understanding. Here's what we see in real sessions — and how to develop the habit."
date: "2026-07-12"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["learning", "ai", "prompting", "skill-building", "coding"]
---

After watching hundreds of learners work through their first real coding projects, one pattern stands out above almost everything else. It's not how often someone practices. It's not which language they start with. It's not even how technically minded they are going in.

**It's the shape of the questions they ask their AI.**

Two learners can sit down with the same project, the same tools, and the same block of time. Six weeks later, one has shipped something they can explain in their sleep. The other has made real progress — sometimes impressive progress — but keeps asking for help with the same types of problems they faced on day one. The difference, almost always, traces back to a single word: *why* versus *how*.

## The Two Types of Questions

A "how" question looks like this:

- "How do I center this element on the page?"
- "How do I fetch data from an API in JavaScript?"
- "How do I make this button change color when clicked?"

A "why" question looks like this:

- "Why isn't this element centering even though I set `margin: auto`?"
- "Why is my API call running before the data is ready?"
- "Why does the button color change the first time but not after that?"

On the surface, both get you unstuck. And that's exactly the trap.

## Why "How" Works — and Why It Doesn't Compound

"How" questions are incredibly efficient. You ask, the AI answers, you move forward. For a beginner who wants momentum, this feels exactly right — and for quick lookups (syntax, function signatures, library names), it genuinely is.

But here's what we see happen over time: learners who stay in "how" mode build what you might call **assembled understanding**. They know what pieces go where because they've placed them before. They can recognize patterns. What they struggle to do is improvise — to reason through a new type of problem when no remembered solution is close enough to reach for.

When those moments arrive, which they always do, "how" learners tend to freeze or paste the entire error message into an AI chat and wait for a fix. The fix arrives, it works, and they move on — without knowing why it worked. The cycle continues.

This isn't laziness. It's a natural response to a tool that is exceptionally good at delivering answers. The path of least resistance is asking for answers, and AI makes that path completely frictionless.

> The most useful thing an AI can do for a learner isn't always the most obvious thing it can do.

## Why "Why" Is Harder — and Why It Compounds Faster

"Why" questions force engagement with causation, not just solution. When you ask "why isn't this working?", you're implicitly committing to understanding the explanation before applying the fix. That one shift changes what you take away from every single interaction.

Consider a concrete example:

```css
/* The "how" answer: here's the fix */
.container {
  display: flex;
  justify-content: center;
}

/* The "why" answer: flex changes the formatting context.
   margin: auto only works to center blocks in normal flow.
   In a flex container, alignment is handled differently. */
```

A learner who asked "how do I center this?" gets the fix. A learner who asked "why isn't `margin: auto` centering this?" gets the fix *plus* the CSS box model, the difference between block and flex formatting contexts, and why `justify-content` exists in the first place. The next time they hit a layout issue, they have a mental model to reason from — not just a fix to remember.

This compounds. Every "why" answer adds to an interconnected map of understanding. Every "how" answer is a sticky note that may or may not be there when you need it.

The learners who make the most progress — and report the most confidence at the end of a project — aren't necessarily the fastest or the most technically prepared at the start. They're the ones who slow down to understand, even when it feels inefficient. This connects directly to what we've written about [comprehension debt](/blog/comprehension-debt-the-hidden-cost-of-coding-with-ai): the cost of moving forward without understanding accumulates silently, then surfaces all at once.

## What Triggers the Shift

The interesting question isn't just that this divide exists — it's what causes someone to move from "how" to "why."

In practice, it's rarely a lecture about best practices. It's almost always a moment of confusion that "how" mode can't resolve: a bug the fix doesn't fix, a feature that behaves differently in one context than another, an AI answer that works for the example but not for the actual project. These moments are frustrating. They're also some of the most valuable things that can happen to a learner.

When "how" stops working, the natural next step is to ask a different kind of question. And learners who've felt those limits tend to start asking "why" proactively — not because they were told to, but because they've learned it gets them somewhere more useful.

You can also accelerate the shift deliberately:

1. **Before asking for a fix, write your guess.** Even if it's completely wrong. "I think this is happening because X" trains the habit of forming hypotheses before reaching for answers.
2. **After getting an answer, ask one follow-up: "Why does that work?"** This turns every solution into a transferable lesson.
3. **When something works unexpectedly, get curious.** "It works but I don't know why" is a flag, not a finish line. [Keeping a short note about it](/blog/how-to-keep-a-coding-journal) forces the kind of reflection that cements understanding.

## What We Build Around This

One thing we've thought carefully about at Codepet is how to guide learners toward "why" questions without being preachy about it. Nobody wants to be told to ask better questions.

What works is designing the interaction so "why" questions arise naturally. When Codepet's companions respond to a "how" question, they answer it — but they surface the underlying principle alongside the fix, point to where it shows up again, and name the thing the learner will want to hold onto. Less "here's the fix" and more "here's the fix, and here's what's actually happening."

We've also noticed that learners who maintain any kind of practice log — even a few lines per session — start asking better questions faster. Writing forces you to articulate your understanding, and gaps in that articulation tend to surface themselves before the next session begins.

## The Concrete Takeaway

Pay attention to the questions you're asking your AI. Not to judge yourself, but to notice the pattern. If most of them start with "how do I...", you're not doing anything wrong — but you're leaving a lot on the table.

The next time you get an answer that works, spend one minute asking why it works. Ask it of the AI, or ask it of yourself by writing it down. That minute is worth more than the next thirty minutes of building.

The fastest way to get better at coding isn't to ask more questions. It's to ask better ones.
