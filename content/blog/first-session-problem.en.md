---
title: "The First Session Problem: What New Users Taught Us"
description: "The first ten minutes of a user's session tell you almost everything about whether they'll return. Here's what we found watching new users open Codepet."
date: "2026-07-08"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["user-research", "onboarding", "ai-product", "ux", "retention"]
---

The most important user session is the first one. Not because it generates the most data — it generates the least. But because the first ten minutes reveal something that later sessions quietly conceal: what a person actually expects from your product before they've adapted to it.

At Codepet, we started doing recorded first-session reviews about six months in — watching users open the app for the first time, with no instructions from us, just the product as they found it. It was humbling. It changed three things we'd been confident about.

## What we expected

We built Codepet with a mental model of the motivated learner: someone who opens the app, sees the AI companion, types a question about the thing they want to build, and gets started. We'd tested this flow extensively with early users who already knew what they wanted — developers curious about AI-assisted learning, people with a specific project in mind.

What we hadn't tested nearly enough was the experience of someone who'd heard about Codepet but wasn't quite sure what it was for. And that's most of the people who actually open the app.

## Three things the first session revealed

**1. People don't start with a question. They start with a vibe check.**

The first thing most new users do isn't type anything. They look around. They tap a companion, explore the UI, browse a skill category. They're asking themselves: *what kind of thing is this?* Before they give the AI anything, they're deciding whether it seems worth their time.

We'd optimized heavily for the moment after someone types their first message. We'd barely thought about the thirty seconds before it.

**2. The first message is almost always too vague to be useful — and users sense it.**

When users finally typed their first message, the most common pattern was something like "help me learn to code" or "I want to make an app." Broad, exploratory, low-commitment. And then, almost immediately after seeing the AI's response, they'd back off — either with an even vaguer follow-up, or by closing the app.

What was happening: our response was too long, too detailed, too structured. It felt like a lecture before they'd even asked for one. They'd offered a small signal — a direction, a vibe — and we'd come back with a curriculum. Here's what that looked like:

```
User: "help me learn to code"

Before: [500 words breaking down programming concepts,
         suggesting resources, listing learning paths...]

After:  "What do you want to build? Tell me a bit about it
         and I'll help you find a starting point."
```

The calibration was off. A short, curious reply — something that ends by bouncing the question back — extends the conversation. A wall of text ends it.

**3. Confusion about what to do next was the most common stopping point.**

In our recordings, the single most frequent pause wasn't after a bad response. It was after a *good* one. Users read something that clicked — then sat there, unsure of the next move. Copy the code? Ask a follow-up? Click something?

This is partly a UX problem, but it's also a mental model problem. Most people don't yet have an intuition for AI dialogue as a *workflow*. They know how to Google (read the top result, done) and they know how to ask a friend (back and forth naturally). AI sits somewhere between the two, and the first session is often where they're still figuring out which it is.

## What changed

Three concrete changes came directly from first-session observations.

First, we rebuilt the **empty state** to answer "what kind of thing is this?" before the user asks. Short, specific, honest — two sentences on what Codepet is for, and three example prompts showing the range. Not a feature list. An invitation.

Second, we added **response-length calibration for first sessions**. When a user's opening message is broad or exploratory, the AI now defaults to a shorter, more conversational reply — something that ends with a question back rather than a comprehensive answer. The goal is to extend the dialogue, not win the first exchange.

Third, we added a **"what now?" nudge** after AI responses in the first three sessions. A small UI element — unobtrusive — offering two or three paths forward: copy the code, ask a follow-up, try it yourself. The pause-and-close pattern dropped noticeably.

None of these changes came from user surveys or app store reviews. They came from watching.

> What users say in feedback and what they do in the product are related — but they are not the same thing. One is memory. The other is behavior.

## What this means for AI product builders

If you're building anything with an AI backbone, first-session behavior is worth watching — not just measuring. Metrics tell you where people drop off. Recordings tell you *why*. And the "why" of AI product first sessions almost always comes down to one of three things:

- **Calibration**: the response was too long, too formal, or too detailed for what the user offered
- **Mental model mismatch**: the user doesn't yet understand what kind of back-and-forth this product is
- **Next-step ambiguity**: they liked what they saw but had no obvious place to go

The good news: all three are fixable in the product itself. None of them require a smarter model.

Calibration problems usually live in your [system prompt design](/blog/system-prompts-that-work-in-production) — specifically, instructions about response length and tone for early sessions. Mental model problems usually live in empty states and example prompts. Next-step problems usually live in response structure: ending each AI turn with a clear, low-friction invitation to continue.

It's also worth noting that the first-session problem compounds: users who clear it once are much more likely to stay. The patterns we observed in early sessions closely track the broader behaviors described in [what happens when a user actually ships](/blog/what-happens-when-you-actually-ship) — the through-line is whether someone crosses the threshold of "this thing works for me."

## The takeaway

First sessions are a product mirror. They show you what your product actually is — not what you meant it to be.

If you haven't watched recordings of first-time users opening your product, that is the most important thing you can do this week. Not A/B tests. Not dashboards. Just a handful of sessions, paying attention to where they pause, what they expect, and what breaks the spell.

Then fix the first thing that breaks it. You might be surprised how small the fix turns out to be.
