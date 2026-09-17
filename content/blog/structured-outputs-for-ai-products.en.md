---
title: "Structured Outputs: The Reliability Layer Your AI Product Is Missing"
description: "Free-form LLM text is fine for chat. The moment you parse AI responses in code, you need structured outputs — and a plan for when they slip."
date: "2026-06-26"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["structured-outputs", "llm", "ai-products", "json-mode", "reliability", "ship"]
---

"Ask the model a question; get a response." That's the mental model most people bring to building with AI. It works fine for a chatbot. It breaks down fast the moment you try to use the response in your code.

Picture this: you're building a feature that asks an LLM to analyze a user's code submission and return a difficulty score, a list of specific issues, and a suggested next step. Your first prompt produces clean-looking output — a paragraph with the score buried inside it, issues scattered across prose, the suggestion embedded somewhere in the last sentence. You write a parser. It handles 70% of responses. The other 30% break the feature in ways that are hard to explain to users.

That's the moment most builders discover they need structured outputs.

## What structured outputs actually are

Free-form text is what a language model produces by default — a response shaped like a paragraph or a conversation, not like a machine-readable object. Structured outputs are when you constrain that response into a predictable shape: typically JSON, but also Markdown with a specific schema, YAML, or even a single typed field.

Modern LLM APIs give you a few ways to get there:

- **JSON mode.** Tell the model to respond in valid JSON. Most major APIs support this — it prevents malformed JSON but doesn't enforce which fields are present.
- **Function calling / tool use.** You define a function schema with typed parameters, and the model "calls" it by returning values that match. The API validates the shape before it reaches you.
- **Constrained generation (grammar-based decoding).** Some open-source runtimes let you define a grammar or JSON Schema, then steer token sampling to guarantee conformance. Slower, but waterproof.
- **Structured output schemas.** Providers like Anthropic and OpenAI now let you pass a JSON Schema alongside your request and they guarantee the response matches it.

For most product builders, the practical choice is between JSON mode (simple, fast, not perfectly reliable) and schema-constrained outputs (slightly more overhead, significantly more reliable).

## When you actually need them

Not every AI call benefits from structured outputs. A feature that produces a free-form explanation for a beginner doesn't need JSON — the "output" is already what the user reads. Structure adds value when:

**You're parsing the output in code.** If your server-side code reads a field from the response, any deviation from the expected shape causes a runtime error or silent failure. Structure is mandatory here.

**You're chaining AI calls.** If the output of one call becomes the input context for another, a loose shape in round one cascades into garbage in round two. Define the schema early.

**You're rendering the response as UI components.** A list of issues is different from a paragraph *about* issues — your UI needs distinct items it can render as individual cards, badges, or checkboxes.

**You need to store and query the output.** If you're persisting AI-generated metadata to a database, you need fields you can reliably index and filter on.

## A minimal implementation pattern

Let's say you're building a feature that reviews a beginner's code snippet and returns:
- A difficulty rating (1–5)
- A list of up to three specific issues
- One actionable next step

Here's a clean way to request that structure using Anthropic's tool-use pattern:

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "code_review",
        "description": "Return a structured review of the user's code.",
        "input_schema": {
            "type": "object",
            "properties": {
                "difficulty": {
                    "type": "integer",
                    "description": "Difficulty rating from 1 (simple) to 5 (complex)",
                    "minimum": 1,
                    "maximum": 5
                },
                "issues": {
                    "type": "array",
                    "items": {"type": "string"},
                    "maxItems": 3,
                    "description": "Specific issues found in the code"
                },
                "next_step": {
                    "type": "string",
                    "description": "One concrete thing the user should try next"
                }
            },
            "required": ["difficulty", "issues", "next_step"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "tool", "name": "code_review"},
    messages=[
        {
            "role": "user",
            "content": f"Review this Python snippet:\n\n{user_code}"
        }
    ]
)

# The model is forced to call code_review — extract the structured input
review = response.content[0].input
print(review["difficulty"], review["issues"], review["next_step"])
```

The `tool_choice` parameter forces the model to use the tool, which guarantees the response shape. Your application code can trust the fields are there.

## The limits of structured outputs

Structured outputs solve the shape problem. They don't solve the quality problem.

A model can return perfectly valid JSON with a `difficulty` of 3, two plausible-sounding issues, and a next step — and still be wrong about all three. The schema validates the container, not the contents.

This is why structured outputs pair naturally with [LLM evals](/blog/how-to-write-llm-evals-for-your-ai-product): once you can reliably parse the output into structured fields, you can write automated checks against those fields. Does `difficulty` correlate with code complexity in your test set? Are the `issues` specific, or generic? Is the `next_step` actually something a beginner can act on?

The shape makes the content testable. Testing is still on you.

> Structured outputs are the difference between "my AI feature sometimes works" and "my AI feature works, and I know exactly what it returns every time."

## Validation: what to do when structure slips

Even with constraints in place, production will surprise you. A model that normally returns three fields occasionally returns two. An integer field becomes a string. A required field is null.

A few defensive patterns:

- **Always validate server-side, even with schema enforcement.** Treat AI output like user input — verify it before using it.
- **Define fallbacks for each field.** If `difficulty` is missing, default to null and show a generic message rather than crashing.
- **Log schema violations.** When a response doesn't match your schema, log the raw output. You'll spot patterns quickly: common edge cases, inputs that consistently trip the model.
- **Add a retrying wrapper.** For non-streaming calls, a retry on validation failure — with a gentle nudge in the follow-up message — catches a large fraction of slippage without user impact.

## Don't over-structure

There's a temptation to define enormous schemas: twenty fields for every possible piece of information the model might produce. Resist it.

The more fields you require, the more the model has to fill in, and the more likely it is to hallucinate values for fields it doesn't have confident signal on. Keep schemas tight: define only the fields you'll actually use in your application code. If you find yourself adding a field "just in case," that's a sign your schema is getting ahead of your product.

Start with three to five fields. Add more when your UI or downstream logic actually needs them.

---

Structured outputs turn AI responses from raw text into application data — something your code can rely on, your UI can render predictably, and your eval suite can check against written criteria. That reliability is often what separates an AI experiment from a shipped AI product.

For more on making AI features hold up under real load, [How to Write System Prompts That Actually Work in Production](/blog/system-prompts-that-work-in-production) is a natural companion to this piece. And if you're working through the full product-quality picture, the [Building AI Products](/blog/category/building-ai-products) category has a growing collection of patterns from real product work.
