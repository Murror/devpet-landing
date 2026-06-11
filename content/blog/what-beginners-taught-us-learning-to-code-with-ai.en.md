---
title: "What 500 Beginners Taught Us About Learning to Code with AI"
description: "Patterns from watching hundreds of first-time builders learn with an AI companion — where AI helps, where it quietly hurts, and what actually makes skill stick."
date: "2026-05-28"
category: "user-insights"
author: "Nguyen"
authorTitle: "Founder, Codepet"
tags: ["user-research", "learning", "ai", "education"]
---

Over the last few months we watched more than 500 people open Codepet for the first time and try to build something real with an AI companion at their side. Some had never written a line of code. Some had finished a dozen tutorials and still couldn't start a project from scratch.

Here's what surprised us.

## AI removes the wrong kind of struggle — and that's the danger

The promise of coding with AI is that it removes friction. And it does. But not all friction is bad. Some of it *is* the learning.

We saw a clear split:

- **Productive struggle** — figuring out *why* a fix works, naming a variable, deciding how to structure a function. This is where skill forms.
- **Pointless struggle** — fighting a cryptic error message, a missing semicolon, environment setup. This is pure tax.

AI is fantastic at deleting pointless struggle. The risk is that, left unchecked, it deletes the productive kind too — it'll happily write the whole function before the learner has formed a single hypothesis.

> The beginners who improved fastest weren't the ones who asked the AI for the least help. They were the ones the AI made *think* before it answered.

That insight reshaped our product. The pet now withholds the full answer when it detects you're one nudge away from getting it yourself.

## "I don't know what to build" is the real beginner blocker

We assumed the hard part was syntax. It wasn't. The single most common place people stalled was the blank canvas: *what do I even make?*

Tutorials hide this problem by handing you the project. The moment we asked people to build their *own* thing, a third of them froze.

### What helped

- **Project scaffolding from interests.** When the pet asked "what's something you wish existed?" and turned the answer into a tiny, achievable v1, completion rates jumped.
- **Shrinking the first win.** The first shippable thing has to be embarrassingly small. A button that does one thing beats a planned app that never starts.
- **Naming the next step, not the whole path.** Beginners don't need a roadmap. They need to know the *one* thing to do next.

## Confidence is a feature you have to design for

The strongest predictor of whether someone came back the next day wasn't how much they knew — it was whether they felt like *the kind of person who builds things*.

That feeling is fragile and designable. A few things moved it:

1. **Attribute the win to the user, not the AI.** "You spotted that bug" lands differently than "I fixed it for you."
2. **Make progress visible.** Seeing the skill tree light up did more for motivation than any points system we tried.
3. **Let them teach back.** When the pet occasionally asked the learner to explain *why* something worked, retention of that concept roughly doubled in our follow-ups.

## What we got wrong

We thought gamification would drive engagement. For beginners, heavy gamification *backfired* — streaks created guilt, leaderboards created comparison, and both pulled focus away from the actual building. The mechanics that worked were the quiet ones: a pet that remembered yesterday, a visible sense of "you're further than you were."

## The takeaway

If you're building anything that teaches with AI, the lesson is counterintuitive: **your job isn't to make things easy. It's to make the right things hard.**

Remove the tax. Protect the struggle that builds skill. Shrink the first win until it's impossible to avoid. And design, explicitly, for the moment someone thinks *I can actually do this.*

We're still learning — every cohort surprises us. If you want to see how these insights show up in the product, the [Building AI Products](/blog/category/building-ai-products) series covers the engineering side of the same story.
