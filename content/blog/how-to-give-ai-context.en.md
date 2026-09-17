---
title: "How to Give AI Better Context and Get Answers Worth Acting On"
description: "Generic AI answers come from generic prompts. Here's how to give AI the right context — about your project, your thinking, and your constraints — so responses actually move the needle."
date: "2026-06-21"
category: "second-brain"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai", "prompting", "context", "productivity", "second-brain"]
---

There is a specific frustration that comes with asking AI a real question and getting an answer that reads like a search result. Technically correct, helpfully organized, and completely detached from your actual situation. The model didn't fail you — you just didn't give it enough to work with.

Context is the input. Quality out depends entirely on quality in.

## Why your AI sounds like it's talking to everyone else

When you ask "how do I structure a database for a user's notes?", the model has almost nothing to go on. Notes about what? What database? What framework? What scale? What have you already tried? So it answers in the only way it can — broadly. You get an overview that would work for anyone and is therefore perfect for no one.

This isn't a model limitation. The most capable AI in the world gives generic answers to generic questions. The skill that separates people who get real leverage from AI from people who keep getting Wikipedia summaries is context — how much you give it, how well you frame it, and how consistently you do it.

## The before and after

Here's a real example of the gap context creates.

**Without context:**
> How do I sort a list in Swift?

The model gives you a three-sentence answer with `sorted(by:)` and maybe a note about ascending vs descending. Fine, but you already knew how to sort. That wasn't the real question.

**With context:**
> I'm building a playlist screen in a macOS app. I have an array of `Song` structs with `listenCount: Int` and `isPinned: Bool`. I want to sort by most-played, but pinned songs should always appear first — even if they have fewer plays. I've tried a two-pass sort but it's getting messy. What's a clean way to express this?

Now the model can actually help. It knows the language, the data shape, the behavior you want, and where you've already been. The answer it gives you is something you can drop straight into your code:

```swift
songs.sorted {
    if $0.isPinned != $1.isPinned { return $0.isPinned }
    return $0.listenCount > $1.listenCount
}
```

That's not a trick prompt. That's just telling the AI what it needs to know.

## Five things worth including in every serious AI conversation

### 1. Your project and goal

Not the task in isolation — the goal the task is in service of. "I'm building a macOS app that helps people learn to code alongside an AI companion" is context that colors every answer you'll get. Start there.

### 2. What you've already tried (and what happened)

This is the most underused piece of context. Every failed attempt carries information: a constraint you discovered, an approach that almost worked, a direction you eliminated. When you share your history, the model stops suggesting things you've already ruled out.

### 3. Your constraints

Language, framework, team size, time available, existing code patterns, things you don't want to change. Constraints are the walls of the problem. Without them, the model designs for an open field — elegant in theory, unusable in your actual situation.

### 4. Your current mental model of the problem

Share how you understand the problem right now — even if you think you're wrong. "I think the issue is in how I'm managing state, but I'm not sure" is better than nothing. The model can confirm your intuition or point precisely to where it goes astray.

### 5. What kind of help you actually want

Explore, decide, critique, or just write? These are very different asks. "Help me think through the trade-offs" invites a completely different response than "give me the implementation." Being explicit saves both of you time.

## Build a context snippet library

Some context is the same across every session on the same project: your stack, your coding style, your constraints, your goal. Writing this out every time is friction you don't need — and leaving it out is why your AI forgets who you are the moment you open a new tab.

Keep a short "project context" block somewhere easy to grab — a text expander snippet, a pinned note, a comment at the top of your scratchpad. Something like:

```
Project: Codepet — macOS app for learning to code with AI (Swift, SwiftUI)
Style: Clean, functional, minimal external dependencies
Current focus: Playlist feature with a gamification loop
Constraints: macOS 14+, small team, ship in two weeks
```

Paste this at the start of any session that touches that project. The difference is immediate and cumulative.

For people who want to go further, a personal RAG system that automatically pulls relevant notes into every AI conversation is the logical next step — we wrote a full walkthrough in [How to Build a Personal RAG System for Your Notes](/blog/build-personal-rag-for-notes).

## The habit that actually compounds

The builders who get the most out of AI don't have better prompts — they have better habits. They start every project with a context document. They paste their mental model before they ask the question. They share what they've tried. They correct misunderstandings early in a session so the rest of it runs better.

Over time, this becomes instinctive. It stops feeling like extra work and starts feeling like the minimum — because anything less produces answers you have to throw away.

> "The model is as smart as the context you give it. That's not a criticism of the model — it's the most empowering thing about using AI seriously."

If you want to take this further — using AI not just as a coding tool but as a genuine thinking partner for complex problems — the way you frame questions matters as much as the context you include. That's a different skill, and we explored it in [How to Use AI as a Thought Partner, Not a Search Engine](/blog/ai-as-thought-partner-not-search-engine).

## The concrete takeaway

Before your next AI session, spend ninety seconds writing down: what project you're on, what you've already tried, and what you actually want the AI to do. Paste it before your question. Notice what changes.

The model hasn't changed. Your answer has.
