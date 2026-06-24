---
title: "How to Run a Weekly AI Reset (and Stop Your Project Drifting)"
description: "AI coding sessions lose context fast. A simple 30-minute weekly reset keeps your project on track, your prompts sharp, and your thinking clear."
date: "2026-06-24"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["weekly-review", "ai", "context", "second-brain", "habits", "workflow"]
---

There's a specific kind of frustration that comes from spending four hours in an AI coding session only to realize, at the end, that you've been solving the wrong problem. Not because the AI was wrong — it gave you exactly what you asked for — but because *you* drifted. The question you started with morphed, the scope crept, and by the time you looked up, you weren't building the thing you meant to build.

The fix isn't better prompting in the moment. It's a habit outside the moment: a weekly reset that clears the fog, reloads your real intentions, and gives your AI sessions something stable to anchor to.

Here's how to run one.

## Why AI projects drift

Every AI assistant works from a context window — the slice of information it can see right now. It doesn't remember what you decided last Tuesday. It doesn't know that you changed direction on the login flow. It meets you wherever you are in the moment, which means that if *you* don't have a clear mental model of where the project stands, neither will it.

The result is subtle drift. You start by asking for a button component. Then you're refactoring a whole page. Then you're redesigning the data model. Three hours later you have excellent code for a problem you no longer have.

> "The AI isn't drifting. You are. The AI is just following you."

The weekly reset exists to surface that drift before it compounds into real damage.

## What a weekly reset looks like

Thirty minutes, once a week. It has three parts.

### 1. Dump what happened

Open a document — a Markdown file, a Notion page, whatever you'll actually use — and brain-dump the week in your project. Not a polished summary. A rough answer to these four questions:

- **What did I build?** List the things you actually shipped or completed, even small ones.
- **What did I decide?** Any choice that changed direction: a library swap, a UX pivot, a feature cut.
- **What's still open?** Problems you punted on, questions you haven't answered, things that feel unstable.
- **What did I learn?** One or two insights you didn't have at the start of the week — about the user, the tech, or yourself.

This takes ten minutes. The value isn't the document; it's the act of articulating. You will notice drift here. "Wait, why am I still working on the onboarding flow? I decided to skip it two weeks ago."

### 2. Update your context file

This is the practical core. Most serious AI-assisted projects benefit from a `CONTEXT.md` — a persistent file that gives the AI a standing brief every time you start a new session. Depending on your toolchain, it might be called `CLAUDE.md`, `.cursor/rules`, or something else entirely; the name matters less than the habit.

After the brain-dump, update it. A minimal template that actually gets used:

```markdown
## Project: [Name]
**What this is:** [One sentence]
**Current focus:** [What you're building this week]

**Key decisions made:**
- [Decision 1, and why]
- [Decision 2, and why]

**What to avoid:**
- [The scope creep that keeps calling]
- [The rabbit hole that ate Tuesday]

**Open questions:**
- [The question that needs answering next]
```

The `What to avoid` section is the one people skip and later regret. Naming the distractions out loud makes them easier to resist. When you start Monday's session and paste this file in, the AI knows what game you're playing — and more importantly, *you* know too.

For more on how context files work within a single session, see [how to give AI the right context](/blog/how-to-give-ai-context). The weekly reset is what keeps that context from going stale.

### 3. Set one clear intention

End the reset by writing a single sentence: *This week I want to ship [specific thing].* Not a list. One thing. This becomes the filter for every session that follows. When an interesting detour presents itself — and AI sessions are full of them — you ask: does this get me to that one thing?

The constraint isn't punishment. It's navigation.

## The compound effect

The first reset is low-value. By week four, you have a four-entry log of real decisions, a context file that reflects your actual project (not the one you imagined in week one), and a sharp sense of where the work really lives.

You also have something more useful: a record of what you've already tried. When you open an AI assistant and say "I already tried X and Y — here's why they didn't work," you skip the suggestions that already failed. That's not a small thing. AI assistants generate ideas readily, including ideas you've already ruled out. A weekly log means you carry that filtering capacity forward instead of rediscovering dead ends from scratch every session.

If you're thinking about a longer-term system — a knowledge base that compounds alongside your project — [building a second brain that thinks with you](/blog/building-a-second-brain-that-thinks-with-you) goes deeper on the architecture.

## What drift actually costs

Concrete numbers. If you spend 20 hours a week in AI-assisted coding sessions and 20% of that is drift — solving the wrong subproblem, exploring a dead end you'd already ruled out, refactoring something you're about to delete — that's four wasted hours a week. Over a month, that's a full work-week gone.

The weekly reset doesn't eliminate drift. Cutting it by half is a realistic target, and half of four hours a week, compounded over a month of building, adds up to something meaningful.

### The patterns that signal drift

These are the tells worth watching for in your brain-dump:

| Signal | What it means |
| --- | --- |
| "I kept getting distracted by X" | X wants to be on the `avoid` list |
| "I'm not sure what I shipped" | The intention for the week wasn't specific enough |
| "I refactored something I'll delete soon" | The context file isn't anchoring sessions |
| "I had the same conversation twice" | Decisions aren't being captured anywhere |

Naming the pattern in the dump makes it available to fix the following week.

## A tool, not a ritual

One common mistake: treating the reset as a reflective journaling exercise. It's not. It's a maintenance task — the same category as cleaning your desk or pinning your dependencies. The artifact that matters is the updated context file that makes Monday's session 30% more focused than Friday's would have been.

If you're using Codepet, the context file feeds directly into how your companion approaches your sessions. The more current it is, the more relevant the feedback and the less time you spend re-explaining where the project is. But the habit is tool-agnostic: it works with any AI assistant, any project, any stack.

The practice is simple. Your project deserves thirty minutes a week.
