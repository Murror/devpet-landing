---
title: "Ask AI to Review Your Code, Not Write It"
description: "The most common way beginners use AI is also the one that stalls their growth. Here's the question shift that actually builds skill — and the prompts that make it work."
date: "2026-06-12"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "learning", "code-review", "beginners", "prompt-engineering"]
---

## The pattern that feels like progress

Open any new-coder forum and the advice is consistent: use AI to learn faster. What nobody explains is *how* to use it. Left to our own instincts, most beginners land on the most natural pattern:

1. Get stuck on a task.
2. Ask the AI to write the solution.
3. Read the code, think "okay, that makes sense," and move on.

It feels like learning. The problem is solved. You understood the output. On to the next task.

The trouble only appears later — usually three or four weeks in, when tasks get harder and the AI's answers stop clicking as neatly. That's when learners discover they've been building confidence, not understanding.

## Why generation mode doesn't build skill

There's a useful distinction in how we acquire skill: **recognition** versus **recall**. Reading AI-generated code and thinking "yes, that makes sense" exercises recognition. Writing code yourself — even incorrectly — exercises recall and problem-solving.

Skilled programmers think in patterns, not lines. When they see a bug, they form a hypothesis, look for evidence, and iterate. That process is what gets trained when you struggle. And AI-generated solutions — however well commented — tend to eliminate the struggle entirely.

> "The learner who copies a correct solution gains an example. The learner who writes a broken attempt and asks why it's broken gains a mental model."

This is something we noticed across Codepet users early on. Learners who asked for code generation could solve today's task, but they came back asking nearly identical questions the next day. Learners who wrote attempts and asked for feedback were — slowly, sometimes frustratingly — building something that transferred to new problems.

## The review prompt shift

The pivot is simple. Instead of:

```
Write me a function that filters a list of users by their active status.
```

Try:

```
Here's my attempt at filtering active users from a list. Can you tell me
what's wrong, and why?

def get_active(users):
  for user in users:
    if user.active == True:
      return user
```

The AI's response changes completely. It points out that `return` exits the function at the first match (so you need a list and `append`, or a list comprehension), explains *why* the original logic fails, and might offer a corrected version — but now you're reading that correction with context. You know what was wrong. The fix lands.

You can push this further depending on what you want to learn:

```
What's the most Pythonic way to write this? Explain what makes it idiomatic.
```

```
Is there anything in this code that would surprise a more experienced reader?
Why?
```

```
What edge cases does this not handle? Give me one, and let me try
to handle it myself before you show me.
```

That last prompt is especially powerful — the AI hands the problem back to you.

## Why "wrong" attempts are valuable input

One counterintuitive thing: you don't have to write *good* code for this to work. In fact, writing confidently wrong code is often more educational than writing cautiously correct code.

When you make a real mistake — not a typo, but a genuine conceptual error — the correction targets exactly the gap in your understanding. You get precision feedback on your specific mental model, not a generic explanation of how the topic works in general.

If you're stuck and genuinely can't write an attempt, start with pseudocode:

```
Here's what I'm thinking in plain English:
- Loop through the users list
- For each one, check if active is true
- Return all the ones that pass the check

I don't know how to turn this into real Python. What am I missing?
```

That's still a meaningful attempt. The AI can see what you understood (the logic) and identify specifically what knowledge you're missing (Python syntax, list construction) rather than explaining everything from scratch.

## What this looks like inside Codepet

When we built Codepet, we made a deliberate choice about the default behavior. The tempting option was to build the fastest path to a working answer — that feels good in the short term. Instead, we designed the AI companion to redirect "write me this" prompts toward guided attempts.

If you ask your Codepet companion to solve a problem outright, it pushes back gently: "What would your first attempt look like, even roughly?" It then reviews that attempt, points to exactly what needs work, and asks a follow-up question rather than handing over the complete answer.

This isn't about making things deliberately harder. It's about making the help land in a way that actually transfers. The mental friction isn't an obstacle to learning — it *is* the learning.

Learners tell us it's more frustrating at first. They also tell us that two months in, they're solving problems they couldn't have imagined tackling unaided. That tradeoff is the whole product strategy.

## A daily practice that works

If you're learning to code with AI right now, here's a concrete routine to try for two weeks:

- **Always write something first.** It doesn't have to work. It doesn't have to be complete. It just has to be your genuine attempt.
- **Ask for a review, not a solution.** "What's wrong here?" beats "Write this for me."
- **After seeing the correction, close the chat and rewrite it yourself.** This is the step most people skip. It's also the step that makes things stick in memory.
- **Ask one more question.** "What would make this code more robust?" or "What else should I know about this?" Push one level deeper every session.

It's slower than asking for the answer. It's also the only approach that builds skills which hold up when the scaffolding is gone.

## The AI that teaches by asking

There's a broader principle here that goes beyond coding: the AI interactions that build real capability are the ones where the AI asks *you* a question — not the ones where it answers yours.

The models powering today's AI tools are extraordinarily good at explaining things. But they're also extraordinarily good at making you *feel* like you understood something you didn't. The prompt pattern above — write an attempt, ask for a review — is a lightweight forcing function that turns explanation into genuine understanding.

Code is a forgiving medium for this. The feedback is binary: it runs or it doesn't. When you write a broken attempt, you're setting up a falsifiable hypothesis. When the AI reviews it, you get precise correction. That's as close as casual learning gets to real scientific feedback.

For more on how to get AI to coach rather than just answer, see our post on [using AI as a thought partner](/blog/ai-as-thought-partner-not-search-engine). And if you're curious about the behavior patterns we've observed across many new learners, explore the [User Insights category](/blog/category/user-insights).

---

**The takeaway is simple:** the most powerful thing you can do when learning to code with AI is give the AI something to respond *to*. Your broken attempt is more valuable than a blank prompt. Review mode is where the real skill lives.
