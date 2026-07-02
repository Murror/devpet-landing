---
title: "How to Give Your AI App Memory"
description: "AI models are stateless by default. Here's how to add short-term, long-term, and episodic memory to your AI product without overcomplicating the architecture."
date: "2026-07-02"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["memory", "context", "rag", "llm", "product", "context-window"]
---

Every AI app ships with the same invisible bug: **the model forgets everything the moment a session ends.**

Your user carefully explains their project on day one — their goals, their background, the constraints they're working inside. The model helps them brilliantly. They come back the next day and the model greets them like a total stranger.

This is the default state of every LLM-powered product. Models are stateless. They have no past. What they know is exactly what you put in the prompt. Getting around this isn't optional once you're building something real — it's one of the first architectural problems you'll hit, usually right after "demo day."

The good news: this is a solved problem, just not always a simple one. Here's how to think about memory in AI products — broken into three layers that serve different needs.

## The three layers of AI memory

Product memory isn't one thing. It breaks into at least three distinct problems:

- **Short-term memory** — remembering what happened earlier in this conversation
- **Long-term memory** — remembering what the user told you across many sessions
- **Episodic memory** — remembering what happened in *last* session specifically

Most tutorials cover short-term memory and stop there. But the gap between short-term and long-term is exactly where most AI products fail their users on day two of real use.

## Short-term memory: it's just the conversation history

The simplest form of memory is conversation history — the list of messages you pass to the model on each call. Every time the user sends a message, you append it to the list, send the whole thing to the model, and append the reply. That's all.

```json
[
  { "role": "user", "content": "I'm building a habit tracker in Swift." },
  { "role": "assistant", "content": "Got it! Let's start with the data model..." },
  { "role": "user", "content": "How do I store streaks across days?" }
]
```

The catch is the context window. If a conversation runs long enough, you'll overflow the model's token limit and hit an error — or worse, quietly truncate older turns and lose important context without any warning.

The practical fixes:

- **Sliding window**: keep only the last N turns. Simple, but loses early context entirely.
- **Summarization**: every K turns, ask the model to compress the earlier conversation into a compact summary paragraph, then replace those turns with the summary. This is the most common production pattern — you preserve the meaning without the token cost.
- **Hierarchical context**: maintain a running "session summary" at the top of the prompt that gets updated periodically, plus the raw recent messages below it.

If you want to understand context window trade-offs more deeply, [Context Windows for Product Builders](/blog/context-windows-for-product-builders) covers the mechanics in detail.

## Long-term memory: user profiles and semantic search

Short-term memory handles the conversation. Long-term memory handles everything across conversations — the user's goals, preferences, history, and the persistent facts you've learned about them.

Two patterns dominate here:

**Structured user profile.** You maintain a compact, structured record for each user: what they're working on, their skill level, their preferences, important facts they've shared. You inject a compressed version of this into every system prompt. Think of it as a per-user CRM you write to yourself, one fact at a time.

```
[System context for @nguyen]
- Working on: Swift iOS habit-tracking app
- Skill level: intermediate iOS, new to CoreData
- Last stated goal: add iCloud sync
- Preferred style: concise explanations with code examples
```

This works well for stable, slow-moving facts. It doesn't scale to storing hundreds of detailed interactions verbatim.

**Retrieval-augmented memory (semantic search).** When a user asks something, you search a vector database of their past interactions and pull in the most relevant ones. The model only sees what's relevant to the current question — not every memory ever stored.

This is conceptually identical to [building a personal RAG for notes](/blog/build-personal-rag-for-notes), except the corpus is prior conversations instead of notes. You embed each conversation summary, store it in a vector store (Pinecone, Supabase pgvector, Qdrant), and retrieve by similarity at query time.

The combination — a structured profile for stable facts plus semantic retrieval for detailed episodic memory — covers most real-world product needs.

## The gap: episodic memory

Here's the part that trips up almost every AI product.

Your user ends a session mid-task. The model helped them get halfway through something significant. They come back tomorrow. Without episodic memory, they have to re-explain everything from scratch. That's not just annoying — it breaks the emotional contract of a tool that's supposed to *know* them.

Episodic memory means storing what happened in a specific session as a discrete, interpretable unit — not raw conversation turns, but a structured record: *what the user was working on, where they got stuck, what was resolved, and what's still open.*

The simplest implementation:

1. At the end of each session, ask the model to write a structured summary: `{ "working_on": "...", "progress": "...", "open_questions": ["..."], "next_steps": "..." }`.
2. Store it in your database, linked to the user ID and timestamp.
3. At the start of the next session, retrieve the most recent session summary and inject it into the system prompt: *"Last time, you were working on X. You made progress on Y. You had open questions about Z."*

This single pattern dramatically changes how your product feels. The model stops being an amnesiac oracle and starts feeling like a collaborator who actually pays attention.

### What about forgetting?

Memory needs a decay strategy. You don't want a user's profile to accumulate stale or contradictory facts indefinitely. Simple approaches that work: LRU eviction from the structured profile (drop the oldest facts when you exceed a size limit), confidence scores that decay over time, and letting users explicitly clear or correct what the system remembers about them.

Getting this right is the difference between a product that feels genuinely intelligent and one that just feels like a fancier autocomplete.

## Putting it together: start simpler than you think

Resist the urge to jump straight to vector databases and embeddings on day one. A well-maintained structured profile and session summaries will serve most products longer than you expect — and they're debuggable in ways that vector search isn't.

A practical build order:

1. **Conversation history with summarization** for in-session memory — this alone covers 80% of use cases.
2. **A structured user profile** injected into every system prompt — handles the stable facts that matter most.
3. **Per-session summaries** stored and retrieved at the start of the next session — closes the day-two gap immediately.
4. **Semantic retrieval** added later, once you have enough data to make it worthwhile and can measure the actual improvement.

> The goal isn't to give the AI a perfect memory. It's to make the user feel remembered. Those are different problems — and the second one is much easier to solve.

Build the simplest thing that makes users feel the product knows them, measure whether it works, and then layer in the more complex approach only when you have evidence it will actually move the needle.
