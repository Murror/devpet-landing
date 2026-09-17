---
title: "How to User-Test an AI Feature Before You Ship"
description: "Testing an AI feature isn't like testing a button. Here's a practical guide to user research that tells you whether your LLM feature actually works for real people."
date: "2026-07-21"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["user testing", "ai product design", "ux research", "llm", "user insights", "product engineering"]
---

There's a specific kind of silence in a user test that you learn to dread. The participant is looking at your AI feature, the output is technically correct, and they're just… sitting there. Not impressed, not confused — just waiting for something to make sense. They don't know what they asked. They don't know why they got what they got. And they're already planning to ignore the whole panel the next time they open the app.

That silence is what AI feature testing is really trying to catch. Not whether the model returns the right token — your evals do that. User testing is about something harder: does the feature fit into the mental model of the person who needs it?

## Why testing AI features is different

Standard usability testing has a clean binary: the user either completed the task or didn't. With AI features, you can have an output that's statistically correct and still completely fails the user. The reverse is also true — a slightly wrong answer, delivered at the right moment with the right framing, can feel transformative.

This makes AI features uniquely resistant to the usual "task completion rate" metrics. You need to test for something more subtle: **whether users can form an accurate mental model of what the AI can and can't do**.

A user who thinks your AI coding assistant can read their mind will be frustrated the first time it misunderstands context. A user who understands it needs explicit instructions will learn to prompt better and stick around. The difference isn't the model — it's the user's expectation going in.

## Recruit people who have the problem, not people who love AI

The most common mistake when recruiting for AI feature tests is selecting people who are excited about AI. They'll forgive everything, try everything, and tell you the feature is amazing. What you actually need are people who have the underlying problem your feature solves — and who don't particularly care how it's solved.

If you're testing an AI writing assistant embedded in a project management tool, recruit people who struggle with writing status updates. Not AI enthusiasts who already use five LLM tools daily.

Three to five participants is enough to find the major patterns. You're not trying to hit statistical significance — you're trying to identify the sharp edges where understanding breaks.

## Three questions to answer before you test

Before you open any session, write down the three things you most need to know:

1. **Where does the user first assume the AI is doing something it isn't?** (The overconfidence point.)
2. **What happens when the output is wrong — do they catch it, accept it, or defer to it?** (The trust calibration point.)
3. **After five minutes with the feature, can they explain to a colleague what it does?** (The mental model point.)

These questions force you to think about your feature from the outside. They also give you something to listen for during the session rather than free-associating.

## Running the session: the think-aloud protocol

Ask participants to narrate their thinking out loud as they use the feature. The instruction sounds simple but most people need a prompt: "As you go through this, tell me what you're expecting to happen, what you're noticing, and anything that surprises you."

The gold is in the moment of surprise. When someone says "oh, I thought it was going to —" and then trails off, that's the gap between your mental model of the feature and theirs. Write that sentence down exactly.

Don't rescue them when they get stuck. The instinct is to explain how the feature works — suppress it. What you see when they struggle is the real product. Every intervention resets the test.

> "The best thing a facilitator can do is be usefully boring — ask 'what are you thinking right now?' and then be quiet."

Code-specific tip: if you're testing a coding assistant or AI code review feature, ask participants to load one of their own actual projects, not a contrived demo task. The gap between toy problems and real-world context is where AI features most frequently fail.

## What to look for beyond "did it work?"

Most teams debrief by asking: did the user complete the task? That's necessary but not enough. Watch for three secondary signals:

**Proxy confidence.** Does the user go on to act on the AI's output, or do they immediately fact-check it? Blind acceptance is a risk signal — not because the output is wrong, but because the user hasn't developed a working model of when to trust it. That makes them fragile when the model does slip.

**Vocabulary drift.** Pay attention to what words participants use to describe the feature after they've used it for a few minutes. If they say "it searched the internet" and it didn't, or "it remembered from last time" and it has no memory — you have a mental model problem that will eventually cause real frustration.

**The re-prompt pattern.** When users get an output they didn't want, do they try again? How do they change their input? A user who makes no change and expects a different result has a fundamental misunderstanding of how LLMs work. A user who rewrites with more detail is learning — that's a good sign.

### The confidence mismatch

This is the pattern worth the most attention: users who are *more* confident about an AI output than the output warrants. It shows up when people skip the verification step for AI-generated content they'd normally double-check — code they'd run, facts they'd search, recommendations they'd think twice about.

In internal tests at Codepet, we found this most often with explanation features: when an AI explains *why* code works, users tend to believe the explanation without verifying the reasoning. The output is plausible, the delivery is confident, and the user just… accepts it. This is a UX problem, not a model problem.

### The wrong-but-right problem

The inverse is also real: an output that's technically imprecise but that the user correctly interprets and acts on — because their domain knowledge fills in the gaps. This feels like a win in testing, but it's fragile. The same output will fail badly for a less experienced user.

When you see participants filling in gaps mentally, note it and ask: "What made that feel clear to you?" The answer usually reveals a piece of context that your more novice users won't have.

## After the session: organizing messy feedback

AI feature testing generates messy, non-binary data. A good way to structure your debrief: sort observations into three buckets.

- **Expectation gaps** — things the user assumed the AI would do that it doesn't
- **Trust failures** — moments where the user rejected a correct output or accepted a wrong one
- **Vocabulary mismatches** — words or concepts the user used that don't map to how the feature actually works

This structure forces you to think about feedback as mental model problems, not just UI bugs. A button that's hard to find is a layout problem. A user who thinks your AI "analyzes their whole codebase" when it only reads the current file — that's an expectation problem that no amount of UI polish will fix.

## The one metric that matters most

After all the sessions, ask yourself: can users explain the feature accurately to someone who hasn't used it yet? Not sales-pitch accurately — mechanism-level accurately. Do they understand what the AI sees, what it produces, and roughly when it works well versus when it's likely to struggle?

If most of your participants can do this, the feature is ready to ship. If they can't, the problem isn't the model — it's the design. And no amount of fine-tuning will fix that.

---

For more on designing AI features users trust, see [How to Design AI Features Users Trust](/blog/how-to-design-ai-features-users-trust) and [Why AI Feature Adoption Stalls After Week One](/blog/why-ai-feature-adoption-stalls). If you're building your product in public, the [User Insights](/blog/category/user-insights) category is where we share what we're learning from real Codepet users.
