---
title: "LLM Tool Calling: A Practical Guide for AI Product Builders"
description: "Tool calling turns your LLM from a text generator into an AI that takes real action. Here's how to design, implement, and ship tool use without breaking production."
date: "2026-06-23"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["tool-calling", "llm", "ai-products", "function-calling", "build", "ship"]
---

The moment an LLM moves from *talking* to *doing* is the moment AI features get genuinely interesting. Tool calling — also called function calling — is the mechanism that makes that shift possible. It lets your model decide to call an external function, get a real result back, and weave that result into a coherent response.

If you've built anything with AI beyond a simple chatbot, you've probably hit the wall where text generation alone isn't enough. A user asks "what's the status of my order?" and your LLM confidently hallucinates an answer. Tool calling is how you fix that — and how you build AI features that actually ship. It's the core technique behind everything worth building in the [Building AI Products](/blog/category/building-ai-products) category.

## What Tool Calling Actually Is

At its core, tool calling is a structured protocol between you and the model. You define a set of tools — each with a name, a description, and a schema of parameters. The model, during generation, can decide to pause and request a tool call instead of producing text. Your application runs the function, sends the result back, and the model continues.

It looks something like this:

```
User: "What's the weather in Hanoi right now?"
→ Model decides: I need get_weather(city="Hanoi")
→ App calls your weather API
→ App returns: {"temp": 32, "condition": "humid", "feels_like": 38}
→ Model responds: "It's 32°C in Hanoi right now, though it feels closer
   to 38°C with the humidity."
```

The model never "knows" the weather. It knows how to ask for it — and how to use the answer. That distinction is everything.

## The Tool Calling Loop

Most production implementations follow a straightforward loop:

1. **Send** the user message plus your tool definitions to the model.
2. **Inspect** the response. If the model returned a tool call, execute it.
3. **Append** the tool result to the conversation.
4. **Resend** to the model for a final response.
5. Repeat if the model calls another tool (multi-step agentic flows).

This loop is conceptually simple but has real latency and cost implications. Each tool call adds at least one extra round-trip — more if the model chains multiple calls. Design your tools accordingly: fewer, more powerful tools often beat many narrow ones.

## How to Design Good Tools

This is where most teams go wrong. The model's ability to pick the right tool depends almost entirely on how well you describe it. A few principles:

**Write descriptions for the model, not for humans.** Your tool's `description` field is a prompt. Be explicit about when to use the tool, what inputs it expects, and what it returns. Vague descriptions lead to wrong calls or missed calls.

**Name tools like actions, not objects.** `search_knowledge_base` is better than `knowledge_base`. `create_calendar_event` is better than `calendar`. The verb signals intent.

**Keep parameters minimal and typed.** Every optional parameter is a decision the model has to make. If a field isn't needed, remove it. Use enums over free-text strings wherever possible — they constrain the model's choices and reduce invalid calls.

**One tool, one purpose.** A tool that does three things will be called incorrectly half the time. If you find yourself writing "OR" in a tool description, split it.

Here's an example of a well-described tool schema:

```json
{
  "name": "search_user_notes",
  "description": "Search the user's personal notes for relevant content. Use this when the user asks about something they may have previously saved, written, or referenced. Returns up to 5 ranked results with title, snippet, and date.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The search query — use keywords from the user's question, not the full question."
      }
    },
    "required": ["query"]
  }
}
```

Notice the description says *when* to use it, what it returns, and there's a usage note inside the parameter description. This level of specificity pays off in production.

## Tool Calling vs RAG: What to Use When

This is a common confusion for builders. Both retrieve external information — but they work differently and serve different use cases.

**RAG** pre-fetches context and stuffs it into the prompt before generation starts. It's great for broad knowledge bases, documentation, or cases where you always want to ground the model in a corpus. See our deep dive on [building a personal RAG for your notes](/blog/build-personal-rag-for-notes) for a practical walkthrough.

**Tool calling** is better when retrieval is conditional, when you need real-time data, or when you're taking an action — not just looking something up. If your AI might or might not need to check an API depending on what the user asks, use a tool. If you're fetching live data, running queries, or writing to a system, use a tool.

In practice, many production apps use both: RAG for static knowledge, tools for dynamic actions.

## Production Considerations

Getting tool calling working in a demo takes an afternoon. Getting it reliable in production takes longer. A few things to plan for:

> **The biggest mistake we see:** teams add 20+ tools in their first production system and wonder why the model keeps calling the wrong one. A narrower, more deliberately described tool surface almost always outperforms a broad one.

**Error handling.** Your tools will fail. Rate limits, network timeouts, invalid inputs, empty results. Build tool wrappers that return structured error messages the model can reason about — not stack traces. `{"error": "no_results", "message": "No notes found for this query."}` is better than a 500.

**Timeouts and latency budgets.** Each tool call extends your response time. Set strict timeouts on external calls. If a tool takes more than 2–3 seconds, users notice. Consider streaming to show progress while tools execute.

**Costs add up.** Tool calling means multiple completions per user message. Benchmark your average call depth and factor it into your unit economics. Good [LLM evals](/blog/how-to-write-llm-evals-for-your-ai-product) should track cost-per-response alongside quality.

**Limit the tool surface area.** Don't give the model 30 tools "just in case." Models perform better with 5–10 well-defined tools than with a sprawling menu. If you have a large tool library, route the right subset to the model based on context.

## When Tool Calling Breaks — And How to Catch It

The most common failure modes in production:

- **The model skips the tool** — usually a description problem. Make it clearer when to call.
- **The model calls with wrong parameters** — usually an ambiguous schema. Add examples or tighter constraints.
- **The model calls the wrong tool** — usually naming or description overlap. Sharpen the distinction.
- **Infinite loops** — the model keeps calling tools without producing a final response. Add a max-turn limit.

A well-crafted [system prompt](/blog/system-prompts-that-work-in-production) helps significantly here: tell the model explicitly how it should use tools, what to do when a tool fails, and when to stop and respond even without all the information it wants.

## The Shift From Generator to Agent

Tool calling is the foundation of agentic AI. Once your model can call tools and use the results, you're not just generating text — you're building software that reasons, acts, and iterates. That's a qualitatively different kind of product.

Start with one tool. Ship it. Measure it. Add the next one only once the first is reliable. The path from "AI chatbot" to "AI that does things" is built one dependable function call at a time — and the compounding effect once you have three or four solid tools is genuinely surprising.

The most important thing to internalize: write your tool descriptions like they're the most critical prompt in your system. Because for the model deciding what to do next, they are.
