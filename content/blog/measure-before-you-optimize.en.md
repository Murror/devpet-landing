---
title: "Measure Before You Optimize: The Codepet Bug That Proved Us Wrong"
description: "A user told us long sessions made Codepet lag and eat memory. We knew exactly what to fix — and the measurement proved us completely wrong. A short engineering story about resisting the obvious."
date: "2026-06-11"
updated: "2026-06-11"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Founder, Codepet"
tags: ["engineering", "performance", "swiftui", "building-in-public"]
featured: false
---

A user wrote in with a problem we could picture immediately: after a long day of coding, the sessions Codepet captures get *huge*, and opening one of those long sessions makes the app stutter and balloon in memory.

We knew exactly what was wrong. Or we thought we did. This is the story of how the fix we were certain about turned out to be the wrong fix — and the two-minute measurement that saved us from shipping it.

## The reflexive diagnosis

Here's the relevant piece of Codepet. The Reflection tab replays your coding session as a narrative: every prompt, every tool call, every file edit your AI made, captured as events and stitched back into a readable story. A busy session is a lot of events. The one our user was opening had **1,074** of them.

So the diagnosis wrote itself. *Of course* it's slow — we're holding thousands of events in memory, some of them full file diffs and command dumps, and we're keeping the entire history in one giant array. The fix was obvious: cap the array. Keep the most recent 500 events, drop the rest, problem solved.

We even wrote it. It felt good. It was the kind of change that looks responsible in a diff.

> The most dangerous bug fix is the one that looks responsible in a diff.

## "Measure it first"

Before merging, we made ourselves do the unglamorous thing: actually measure where the memory was going.

The result was humbling. Across **all 3,272 events** in the entire history, the total text came to **0.16 MB**. The single largest event was **985 characters** — not one event in the whole store was big enough to even trigger the safety cap we'd been so worried about. The "thousands of heavy events eating memory" story we'd told ourselves was, in raw numbers, a rounding error.

And the cap we'd written? It would have been actively harmful. That array isn't just a log — it's the source the app rebuilds *every session in your history* from. Capping it at 500 wouldn't have trimmed fat; it would have made older sessions silently disappear and chopped the big session down to a fragment. We'd have "fixed" the performance complaint by quietly deleting the user's history.

We reverted it before it ever shipped.

## The real culprit

With the data ruled out, the actual problem stood out clearly. The cost wasn't *storing* the session — it was *rendering* it. Opening a session built a view for every single turn at once: parsing Markdown, scanning each line for glossary terms to link, spinning up typewriter animation state — all 1,074 events' worth, instantly, whether you ever scrolled to them or not.

The session wasn't heavy. The act of drawing all of it at once was.

The fixes that followed were small and boring, which is usually a sign you've found the right layer:

- **Render lazily.** Turns now build only as they scroll into view, instead of the whole session materializing the moment you click it. This was the fix that mattered.
- **Preview, don't dump.** Inside the technical details, long event bodies show a short preview with a "Show more" toggle, so an expanded turn doesn't lay out full file contents for every line up front.
- **Cache the parsing.** Markdown that's already been parsed is reused instead of re-parsed as you scroll back and forth.
- **Keep one cheap safeguard.** We did add a generous cap on any single event's text — not because today's data needs it, but so one pathological 10-megabyte log dump can never hold the whole tab hostage later.

## What we actually learned

- **The convincing diagnosis and the correct one are not the same diagnosis.** Ours was convincing *because* it fit a story we already believed about "big data = slow." Stories are not measurements.
- **Optimize the layer the cost actually lives in.** The slowness was real; we'd just located it one floor below where it happened. Memory was fine; rendering was the bill.
- **Some "optimizations" delete user value.** The version we almost shipped would have erased history to win a benchmark nobody was running. Measuring didn't just point us at a better fix — it stopped us from causing a worse bug.

The whole detour cost about two minutes of measuring and saved us from a confidently wrong change to a feature people rely on. We'll take that trade every single time.
