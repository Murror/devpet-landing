---
title: "Comprehension Debt: The Hidden Cost of Coding With AI"
description: "AI makes you faster today and quietly weaker tomorrow. The research on comprehension debt — and how to use AI without letting your skills erode."
date: "2026-06-23"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "learning", "coding", "skill-erosion", "research"]
---

There's a strange feeling that shows up a few weeks into building with AI. You're shipping faster than ever — features land in an afternoon that used to take a week — and yet, if someone asked you to explain *why* a particular function works, you'd hesitate. The code is yours. You accepted it, you committed it, it's in production. But you don't quite *understand* it.

That gap has a name now: **comprehension debt**. Like technical debt, you borrow against the future to move fast today. Unlike technical debt, the thing you're slowly depleting isn't your codebase — it's *you*.

## The frustration everyone feels but few can name

When the 2025 Stack Overflow Developer Survey asked nearly 49,000 developers what frustrates them most about AI tools, the top answer wasn't "it's too slow" or "it's too expensive." It was **"almost right, but not quite"** — cited by **66%** of respondents. The output looks correct, reads correct, compiles correct, and then quietly isn't.

The trust numbers tell the same story from another angle. **84%** of developers now use AI tools, yet **46%** actively distrust their accuracy and only **3%** say they highly trust it. We've built a workflow on a tool we don't believe — and that contradiction is doing something to how we learn.

> The efficient path and the learning path have quietly split apart. The fastest way to ship is now, often, the slowest way to grow.

## What the research actually found

For a while, "AI is eroding developer skill" was a vibe — a thing senior engineers grumbled about. It isn't a vibe anymore. A cluster of recent studies, several of them randomized controlled trials, point the same direction:

| Finding | Number | Source |
| --- | --- | --- |
| Experienced devs were *slower* with AI — while believing they were 20% faster | **−19%** | METR 2025 (RCT) |
| AI users scored lower on comprehension of code they "wrote" | **50% vs 67%** | Anthropic 2026 (RCT) |
| The *fastest* pattern — complete delegation — had the *worst* learning | **under 40%** comprehension | Anthropic 2026 |
| Copy-paste up, refactoring down since AI adoption | clones **~8×**, refactor **25% → under 10%** | GitClear (211M LOC) |
| Copilot output containing exploitable vulnerabilities | **~40%** | NYU / Pearce et al. |
| Devs reporting decreased confidence in their own problem-solving | **20%** | SO 2025 |

The METR result is the one that should stop you. Experienced open-source developers, working on their own repositories, were measurably **slower** with AI assistance — and *felt* about 20% faster the whole time. The perception of speed and the reality of speed had completely decoupled. If you can't trust your own sense of "this is helping," you need something outside yourself to tell you the truth.

## Comprehension debt, in one sentence

The Anthropic study draws the cleanest line. Developers who leaned on **complete delegation** — let the model write it, skim it, accept it — comprehended **under 40%** of the resulting code. The group that engaged with the work scored far higher. Same tool, same task, wildly different outcomes — and the *only* variable was how much the human stayed in the loop.

This is comprehension debt made concrete. You can ship a feature you understand 40% of. It'll probably work. But three months later, when it breaks at 2 a.m. and the AI's suggested fix is *also* "almost right, but not quite," that missing 60% is the wall you hit. Writer Addy Osmani called it exactly this: the debt comes due not when you write the code, but when you have to *change* it.

## Why a faster tool can't save you from this

Here's the uncomfortable part, and it's the load-bearing insight of everything above:

**The efficient path is the low-learning path.** Complete delegation is the fastest way to produce code *and* the way that teaches you the least. They're the same action. So a tool whose entire job is to make you faster cannot, by its own design, fix this — the fix is "slow down and engage," which runs directly against its core metric.

That's not a knock on AI assistants. Claude Code, Cursor, and Copilot are extraordinary at what they do. It's just that "build faster" and "get better" are different goals, and no amount of build-faster solves get-better. You need a second loop running alongside the first — one whose KPI is *your* growth, not your output. We've written before about [the difference between AI as a crutch and AI as a coach](/blog/ai-crutch-vs-ai-coach); comprehension debt is the mechanism that makes that distinction matter.

## How to pay it down

The encouraging news is that the science of what *reverses* comprehension debt is well understood — and none of it requires giving up AI. A few high-leverage habits:

- **Read the diff before you accept it.** Not all of it, all the time — but on any large, fast-accepted change, spend 20 seconds answering "what does this actually do?" Unread accepted diffs are where debt accumulates fastest.
- **Self-explain after a task.** Out loud or in a note: *what did this do, and why did it work?* Self-explanation has one of the most robust effect sizes in all of learning research. It's nearly free and it's the closest thing to a cheat code.
- **Ask "why," not just "what."** When the model hands you a solution, ask it to explain the reasoning before you move on. You're converting a black box into a lesson.
- **Use spaced retrieval for the concepts you meet.** A term you saw once and never recalled is a term you didn't learn. Revisit the unfamiliar concepts from your sessions a day or two later, from memory.
- **Write the conceptually hard parts yourself.** Delegate the boilerplate; keep the thinking. The generation effect — you remember what you produce far better than what you read — is real.

Here's a thirty-second ritual that bundles most of it:

```text
Before you accept a big diff, answer three questions:
  1. What does this change do, in one sentence?
  2. Why this approach and not the obvious alternative?
  3. What would break if I deleted it?
If you can't answer all three, you don't own this code yet.
```

## The takeaway

AI hasn't made comprehension optional — it's made it *easy to skip*, which is a more dangerous thing. The developers who'll still be excellent in two years aren't the ones who resisted AI or the ones who delegated everything to it. They're the ones who used it at full speed while keeping a second loop running: a small, deliberate practice of staying in the loop, reading the diff, and explaining the work back to themselves.

You don't have to choose between shipping fast and growing. You just have to notice that, by default, the tool optimizes for one and silently bills you for the other. Pay the debt down a little every day, and it never comes due all at once.

*Watching people learn to direct AI without losing the plot is exactly what we obsess over at Codepet — see more in [User Insights](/blog/category/user-insights) and [what hundreds of beginners taught us](/blog/what-beginners-taught-us-learning-to-code-with-ai).*
