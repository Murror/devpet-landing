---
title: "The Decision Log: Stop Relitigating Choices You've Already Made"
description: "Solo builders waste hours re-making decisions they settled weeks ago. A decision log captures your reasoning so AI sessions run faster and second-guessing stops."
date: "2026-07-03"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["decision-log", "second-brain", "ai", "indie-hacker", "workflow", "knowledge-management"]
---

There's a tax that every solo builder pays, and it barely shows up in any productivity system because it masquerades as thinking: the tax of re-making decisions you've already made. You spend twenty minutes weighing the same framework trade-off you resolved in February. You re-open the scope question you closed last sprint. You find yourself back in the exact debate you settled three weeks ago — only now you can't quite remember which way you landed, or why.

The decision log is the cure. It's the simplest, most underrated tool in a solo builder's arsenal: a running document that captures each significant choice you make — the problem, the options you considered, the decision, and crucially, *why*. Three minutes per entry. Dividends for months.

## What goes in a decision log

Not everything. A log that records what font size you picked is noise. The signal is choices that are architectural, strategic, or hard to walk back:

- Technology and framework picks ("I chose Supabase over PlanetScale because X")
- Feature scope decisions ("Y is out of v1 because Z")
- UX direction calls ("Account creation is deferred to after first launch because research showed W")
- Data model choices ("A user has exactly one active project because V")

Each entry follows a four-field structure. Resist adding more:

```markdown
## [Date] — [Short title of the decision]
**Problem:** What question needed answering?
**Options considered:** What did you look at?
**Decision:** What did you pick?
**Why:** One sentence. Include the tradeoff you accepted.
```

Keep entries short. A log written in three-minute bursts will be maintained. A log that requires a blog post per entry will be abandoned.

## How AI turns the log into a real tool

A decision log in a static Markdown file is already useful. A decision log you can *query with an AI* is a completely different instrument.

The simple approach: keep your log in a `DECISIONS.md` file and paste the relevant entries into any AI session where history matters. Building a new auth feature? Paste in the two entries that touch authentication. Reconsidering a data model? Pull in the decisions that shaped it. The AI now knows what you decided, what you rejected, and why — and won't spend ten minutes suggesting paths you already closed.

> "I tried approach X and rejected it because Y. Given that constraint, here's what I'm trying to solve now."

That one sentence short-circuits a full brainstorming cycle. You're not starting from a blank search space; you're handing the AI a map of terrain you've already covered.

### Querying your own history

With a larger log — twenty or more entries — the AI becomes a navigator through your own project history. You can ask things like:

- "We're about to refactor the project data model. Which past decisions might this affect?"
- "I'm reconsidering whether to build Y. What was my original reasoning for cutting it?"
- "What tradeoffs have I consistently prioritized across this project?"

That last question is the most revealing. Patterns in your decisions surface your values as a builder — speed over polish, flexibility over opinions, depth over breadth. Seeing those patterns clearly means you can reinforce them deliberately or question them when the situation calls for it.

## The solo founder memory problem

Teams have a built-in memory system. Decisions get debated in Slack, documented in Notion, held implicitly by multiple people. When a question resurfaces, someone remembers. When the original reasoning is needed, someone tracked it.

Solo founders don't have that. Everything lives in one head, which means it's all equally susceptible to evaporation. A decision made after a long late-night session three weeks ago? Gone. The specific reason you went with one library over another? Fuzzy at best.

The emotional cost is real and rarely named. When you can't remember why you made a choice, you start second-guessing. You invite re-litigation you don't have time for. You open a door to "what if I'd done it differently" spirals that consume hours without producing anything.

The decision log closes that door. "I decided X on April 3 because Y. That reasoning still holds. Moving on." That's not rigidity — it's efficiency. It frees the mental space occupied by low-grade uncertainty.

There's also a cleaner kind of reconsideration available when you have the record. Instead of vague anxiety ("maybe I should rebuild this"), you can ask a concrete question: "My reasoning was Y. Y is no longer true. Does the decision still stand?" That's thinking, not ruminating. The difference matters more than it sounds.

## Pairing it with your context file

The decision log is most powerful alongside a context file — the `CONTEXT.md` or `CLAUDE.md` you might already use to orient AI sessions. Think of them as two layers that serve different purposes:

- **Context file**: where the project *is* right now — current focus, stack, open questions.
- **Decision log**: where the project *has been* — the choices that shaped it, the paths not taken.

At the start of a session, paste the context file for immediate orientation. When you go deeper into a specific area, add the relevant decision log entries. Together they give an AI a complete picture of both where you are and how you got there. Without the decision log, the AI knows your current state but not your constraints. Without the context file, it knows your history but not your direction.

If you're not yet running a weekly review to keep that context file current, [the weekly AI reset](/blog/weekly-ai-project-reset) lays out a 30-minute practice that pairs naturally with maintaining a decision log.

## Starting mid-project

The hardest part of a decision log is starting one when a project is already underway. Here's the approach that works: write down the last five significant decisions you can remember, then add new ones going forward.

You'll notice something immediately: you know what you chose, but you're vague on why. That vagueness is exactly the gap the log closes. Reconstructing the reasoning — even imperfectly — is still worth doing. Future-you will have more to work with than nothing.

A starter template:

```markdown
# Decision Log — [Project Name]

## 2026-03-15 — Use Supabase for the backend
**Problem:** Needed a hosted database + auth I could ship in a weekend.
**Options considered:** Firebase (lock-in), PlanetScale (no built-in auth), Supabase.
**Decision:** Supabase.
**Why:** Auth out of the box, real Postgres underneath, generous free tier. Tradeoff: less control than managing my own Postgres.

## 2026-03-22 — Skip social login for v1
**Problem:** How much auth surface to expose at launch?
**Options considered:** Email only vs. email + Google/Apple OAuth.
**Decision:** Email only.
**Why:** OAuth adds App Store review, terms of service changes, extra config. Worth it at v1.1, not v1.
```

Pin this file at the root of your project, link it from your context file, and update it every time a real decision gets made. That's the whole system.

### The decisions worth capturing in real time

Some choices arrive slowly — you deliberate, weigh options, sleep on it. Those are easy to log. The ones that get missed are the fast ones: the snap decision made during a debugging session, the scope cut you mentioned in passing in a Slack message to yourself, the library you swapped without thinking twice. These small choices accumulate into a project's character, and they're the first ones to become mysterious six weeks later.

A useful habit: end every significant AI session with a one-minute sweep. "Did I make any choices today that I haven't written down?" Usually the answer is yes, and the entry takes two minutes.

## The compound effect

The first time you use a decision log in an AI session, the gain is modest — you saved a few back-and-forth exchanges. By month three, the compound effect is visible. You have a record of every meaningful choice your project has made. You can query it. You can spot patterns. You can walk a new collaborator (or a new AI context) through your entire project's reasoning in under ten minutes.

More importantly, you've replaced a lossy human memory with a structured document that doesn't forget. For solo builders working in long, context-switching-heavy weeks, that durability is worth more than it looks.

## The takeaway

The decision log doesn't make your choices better. It makes your thinking *durable* — capturing the context that makes each decision sensible so it doesn't evaporate when the moment passes. It makes AI sessions faster. It makes reconsideration cycles sharper. And it removes the low-grade anxiety of knowing your project's history is only as reliable as your memory.

Start small. Write down the last five decisions you made. Log the next one as it happens. That's the entire practice.
