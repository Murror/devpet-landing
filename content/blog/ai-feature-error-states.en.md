---
title: "Designing Error States for AI Features: What to Show When the Model Fails"
description: "Most AI products break trust in the error moment. Here's how to design fallback states that keep users coming back when your LLM gives a bad answer."
date: "2026-07-20"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["ai product design", "error states", "ux", "llm", "product engineering", "building with ai"]
---

When a regular piece of software fails, it's usually traceable: a missing file, a bad network call, a null pointer. Fix the bug, the thing works again.

AI failures don't work that way. Your model might return a completely confident wrong answer. It might refuse a perfectly reasonable request. It might produce a paragraph of plausible-sounding text that doesn't address the user's question at all. And unlike a database error, the model will do this unpredictably, at scale, to real users — often without you knowing until they've already quietly churned.

Most AI products treat error states as an afterthought: a generic "Something went wrong," maybe a retry button. That's a missed opportunity. How your product behaves in a failure moment tells users more about your judgment as a builder than any new feature you could ship.

## The Three Kinds of AI Failure

Before you design the response, you need to know what you're responding to. AI failures cluster into three types:

### 1. Wrong or hallucinated output

The model returns something confident but factually wrong, logically inconsistent, or simply unhelpful. This is the most dangerous failure — there's no error to catch, no exception to surface. The user reads the output, trusts it, acts on it, and discovers the problem later.

### 2. Refused or off-topic response

The model declines the request, goes on a tangent, or wraps a non-answer in excessive caveats. This is frustrating but at least visible — the user knows they didn't get what they wanted.

### 3. Infrastructure failure

A timeout, a rate limit, a 500 from the API, or a response truncated mid-sentence. This maps closely to traditional software failures and is the easiest to handle — but still commonly handled badly.

## What Users Actually Experience

Here's what we observed building Codepet: when a new learner encounters an AI failure, their first instinct is to blame themselves. They think they asked the question wrong, or that they aren't smart enough to understand the answer. Confidence drops. Engagement drops. They close the app.

This is the deeper problem with AI errors. Regular software errors feel like *the machine broke*. AI errors feel personal.

> "I didn't realize the AI gave me wrong code until I'd spent two hours trying to fix what was already wrong." — a Codepet user, early beta

That quote lives in our error-handling design doc as a standing reminder. The goal isn't to prevent all AI failures — you can't. The goal is to make sure users leave an error moment with their confidence intact.

## Design Patterns for Graceful AI Errors

### Signal uncertainty rather than project false confidence

The worst pattern is a model that says "Here's your answer" when it's actually guessing. The best pattern requires prompt engineering, not just UI design — instruct the model to express uncertainty when it arises:

```
When you are not certain about a technical detail, say "I'm not sure, but I think..."
or "You may want to verify this, but..." rather than presenting guesses as facts.
```

This turns low-confidence outputs into something the user can triage. They know to check. That's far better than a confident wrong answer delivered with a smile.

### Always give the user an exit route

When the AI fails — for any reason — offer a concrete next step:

- **Wrong or refused response:** something like "That didn't land — try rephrasing, or browse the [Building AI Products](/blog/category/building-ai-products) category for related guides."
- **Infrastructure failure:** a retry button with honest language ("The model timed out — want to try again?") rather than the vague "Something went wrong."
- **Suspected hallucination caught in post-processing:** a soft flag ("Double-check this before using it") so the user can verify rather than blindly trusting.

The exit route matters because a user who knows their next move doesn't feel stuck. A user who hits a dead end either bounces — or worse, acts on bad information.

### Demonstrate accountability instead of apologizing

"I'm sorry for the confusion" is a reflex, not a solution. Users don't want the product to feel sorry — they want evidence that it understood what happened and is actively trying to help.

Compare these two responses to a failed answer:

- ❌ "I apologize for any confusion. Please try again."
- ✅ "That answer missed the mark. Want to try a different angle? Here are some prompts that work well for this type of question."

The second version signals that the product is paying attention. It implies learning, not helplessness.

### Log failure patterns, not just raw errors

For production AI products, your observability setup matters as much as your copy. Capture:

- What the user's input was (with appropriate privacy handling)
- What the model returned
- What the user did next — did they retry, rephrase, or leave?

This is your eval dataset. A week of failure logs will surface patterns you'd never find in aggregate metrics: prompt shapes that reliably produce bad output, user intents the model consistently misunderstands. See [how to write LLM evals for your AI product](/blog/how-to-write-llm-evals-for-your-ai-product) and [measuring before you optimize](/blog/measure-before-you-optimize) for how to turn that data into improvements.

## Building the Failure → Recovery Loop

The best-designed AI products treat failure moments as part of the expected flow, not edge cases. A user who hits a failure state and recovers cleanly is often *more* engaged afterward than one who never encountered a problem — because the recovery built trust.

**Error design is retention design.** Users remember how you treated them when things went wrong.

A few specific things worth building:

- **Graceful partial results.** If you can give the user *something* useful even when the full answer fails, do it. "I couldn't generate the full solution, but here's the key concept you'd need" beats a blank screen.
- **Regeneration with context.** A retry that sends exactly the same prompt will likely produce the same bad result. Design your retry to automatically append context ("The previous response didn't address X") or let the user refine before retrying.
- **A human escalation path.** For high-stakes products, always offer a way to reach human help or authoritative external resources. AI should augment human judgment, not replace the need for it.

## What to Ship First

If you haven't thought about error states yet, here's the minimal viable set that covers most failure cases:

1. **A timeout handler.** Retry once automatically, then surface a friendly message with a manual retry option.
2. **A refusal handler.** Detect "I'm sorry" / "I can't" responses in post-processing and replace the raw model output with a custom message that offers alternatives.
3. **A confidence signal in your system prompt.** Even a single instruction — "flag when you're not fully certain" — gives users the information they need to decide how much to trust the output.

None of these require a major engineering lift. Together they handle the vast majority of failure moments your users will encounter.

## The Takeaway

Shipping a great AI feature is only half the job. The other half is designing what happens when it doesn't work — because it will, and your users are paying close attention. The products that earn long-term trust aren't the ones that never fail. They're the ones that fail gracefully, recover quickly, and leave the user feeling capable rather than confused.

Start with three things: signal uncertainty in your prompts, offer a clear exit route in your UI, and log failure patterns so you can learn. Everything else builds from there.
