---
title: "Building an AI Product in Public: What Codepet's First Year Taught Us"
description: "The honest story of building an AI-powered macOS app — the bets that paid off, the features we deleted, and what we'd tell anyone shipping with AI today."
date: "2026-06-09"
updated: "2026-06-09"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Founder, Codepet"
tags: ["ai-products", "building-in-public", "startups", "macos"]
featured: true
---

When we started building Codepet, the pitch fit in one sentence: an AI that teaches you to build real software, not just finish tutorials. A year later that sentence is intact — but almost everything *underneath* it has been rewritten at least twice.

This is the unglamorous version of the story. The bets that worked, the ones that didn't, and the lessons we keep relearning.

## Start with the smallest loop that feels alive

Our first prototype was ambitious and dead on arrival. It had a curriculum, a skill tree, eight companions, and a roadmap — and none of it mattered, because the core loop wasn't fun yet.

The thing that finally clicked was embarrassingly small: write a line of code, get an immediate, *specific* reaction from your pet. Not "Great job!" but "That `useEffect` will run on every render — want to see why?"

> The unit of an AI product isn't a feature. It's a loop short enough to feel like a conversation.

Once that loop felt alive, everything else had something to attach to. We deleted three months of curriculum work and didn't miss it.

### What we learned

- **Demo the loop, not the roadmap.** If the 30-second core interaction doesn't make someone lean in, more features won't save it.
- **Latency is a feature.** A correct response that arrives in four seconds loses to a good-enough response in 400ms. We spent real engineering effort just making the pet *react fast*.

## Treat the model as a component, not the product

Early on we over-indexed on prompts. Every problem looked like a prompt-engineering problem. The trap is that prompts feel like progress — you tweak, you get a better answer, you ship.

The reframe that helped: **the model is one component in a system**, and most of the quality comes from everything *around* it — retrieval of the user's actual code, the feedback UI, the memory of what they struggled with yesterday, the guardrails that stop it from hand-holding too much.

A few concrete decisions:

- We version our prompts like code, with evals attached. A prompt change that improves one case and quietly breaks five is the most common way to regress an AI product.
- We log every interaction where the user *disagreed* with the pet. Those disagreements are the highest-signal dataset we have.
- We default to the most capable model for reasoning-heavy moments and a faster, cheaper one for chatter. Users can't tell you which model answered — they can tell you when it was slow.

## Ship the embarrassing version

The version of Codepet we were proud of would have shipped six months late. The version we were slightly embarrassed by shipped on time and taught us what was actually wrong — which was never what we'd predicted.

Building in public forced this. When you've said out loud that something ships this month, "let's polish it for one more sprint" stops being free.

### The features we deleted

| Feature | Why it died |
| --- | --- |
| A full IDE inside the app | Users already had VS Code; we were competing with ourselves |
| Streak-based daily goals | Created guilt, not motivation — retention *dropped* |
| Auto-generated quizzes | Felt like school; the whole point was to escape that |

Every one of those felt essential on the roadmap. Contact with real users killed them in days.

## What we'd tell you if you're shipping with AI now

1. **Find the loop first.** Everything compounds off a core interaction that's genuinely good. Don't build the cathedral before the campfire.
2. **Instrument disagreement.** The moments your AI gets it wrong — and the user knows — are worth more than a hundred happy-path logs.
3. **Make speed non-negotiable.** Perceived intelligence and perceived speed are nearly the same axis to a user.
4. **Write down your taste.** As the team grows, "good output" stops being obvious. We keep a living doc of what a great pet response looks like, with examples.

A year in, Codepet is still a macOS app that helps people build real things with AI. But now we know *which* sentence underneath that matters — and we got there by shipping, watching, and being willing to delete our own good ideas.

If you're building something similar, we'd love to compare notes. The next post in this series digs into the eval harness we use to keep the pet's quality from drifting as the models change underneath us.
