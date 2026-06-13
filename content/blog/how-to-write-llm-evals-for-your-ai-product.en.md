---
title: "How to Write LLM Evals for Your AI Product"
description: "Most teams ship AI features on vibes. A lightweight eval framework — 10 golden inputs, a clear rubric, one scoring pass — changes that in an afternoon."
date: "2026-06-13"
category: "building-ai-products"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["evals", "llm", "testing", "ai-products", "prompt-engineering", "ship"]
---

Shipping an AI feature feels different from shipping regular code. You demo it to three people, watch them smile, push it to production. The responses look coherent; the tone feels right. Two weeks later your users are confused, your support queue is growing, and you're squinting at outputs wondering what changed.

Usually nothing changed — you just didn't have a way to know what "good" meant in the first place.

That's the gap that evals close.

## What an eval actually is

An eval is a test suite for language model behavior. At its simplest, it's a list of inputs paired with expected outputs — or, more commonly, with *criteria* for what a good output looks like.

Traditional tests are binary: the function returns 42 or it doesn't. Evals measure fuzzier things: Is this response helpful? Does it stay on topic? Is the tone encouraging without being cloying? These aren't yes/no questions, which is why most teams push them off until "later" — and later never comes.

There are three patterns worth knowing:

- **Exact-match.** For constrained outputs — structured JSON, category labels, a specific format — check whether the output matches the expected value precisely.
- **Rubric-based.** Write down what a good response looks like, e.g. "mentions at least one specific next step" or "doesn't apologize more than once," then grade against that rubric, either by hand or with a second LLM call.
- **Regression.** You have a set of inputs that used to produce acceptable outputs. You run them after every prompt change to make sure nothing broke.

Most product teams need all three. But if you're starting from zero, start with rubric-based — it teaches you the most.

## Why teams skip evals

The honest reason is that they feel academic. Evals sound like something that belongs in a research paper or an ML platform, not in the sprint where you're also building the onboarding flow and fixing a push notification bug.

There's also no obvious owner. ML engineers think of evals as a model-quality problem. Product managers think of them as a QA problem. Designers aren't in the conversation at all. Nobody picks up the ticket.

And then there's the "I'll know a bad response when I see it" assumption. This is true when you're reading outputs manually. It doesn't scale to the second prompt change, the third parameter tweak, or the version that went out at 11pm on a Friday.

> The moment you have more than one person touching the prompt, you need written criteria. Otherwise "good" means something different to everyone on the team.

## The 10 golden inputs method

The simplest eval framework you can build in an afternoon:

**1. Write 10 representative inputs.** Think about the real range of what your feature will see — a beginner asking something naive, an expert asking something sharp, a user who's frustrated, a user who's vague. Write actual examples, not categories.

**2. For each input, write a passing criterion.** Not "good response" — something checkable. "Includes a code example." "Doesn't suggest the user is wrong." "Answers in under 100 words." "Ends with a question to help the user go deeper." Get specific.

**3. Add 2–3 edge cases.** An empty input. An input that's completely off-topic. An input that's three times longer than the typical message. These surface graceful degradation — or the lack of it.

**4. Run them on every prompt change.** Not just before launch — before every change. A prompt regression is as bad as a code regression, and nearly as common.

Here's a minimal implementation pattern:

```python
evals = [
    {
        "input": "I don't know where to start with my project",
        "criteria": [
            "suggests a concrete first step",
            "doesn't overwhelm with options"
        ]
    },
    {
        "input": "",
        "criteria": [
            "handles gracefully",
            "doesn't return empty string or crash"
        ]
    },
]

for case in evals:
    response = call_your_llm(case["input"])
    # score against criteria — manually first, then automate
    print(response)
```

The scoring step — manual or automated — is up to you. Start manual. The discipline of reading every output against a written rubric teaches you more than any dashboard.

## LLM-as-judge: when it helps, when it misleads

Once you have more than around 50 eval cases, manual scoring becomes a real bottleneck. LLM-as-judge is the natural solution: you pass the input, the output, and your rubric to a separate model call, and ask it to score on a simple scale.

It works well for catching obvious failures — off-topic responses, broken formatting, responses that violate a style rule you've written down. It's also useful for grading tone at scale: whether something sounds encouraging, whether it's too verbose, whether it avoids unnecessary jargon.

It misleads on subtle quality. An LLM judge tends to rate fluent, confident responses highly even when they're subtly wrong. It also has a well-documented position bias: given two options, it favors the first one more than chance would predict. And it has a classic sycophancy problem — ask it to grade its own outputs and it scores them generously.

The rule of thumb: use LLM-as-judge for formatting and style checks. Stay hands-on for anything where factual accuracy or pedagogical quality really matters.

## Regression: the part that actually compounds

The real payoff from evals isn't catching failures before launch — it's knowing when a prompt change broke something that was working.

Keep a simple log: after every prompt deploy, run your golden set and record pass/fail for each criterion. The moment a previously-passing test fails, you have a concrete regression to investigate. No more "it seemed fine in testing" — you have a diff.

At Codepet, we run a small eval set before every change that touches feedback quality. It's fewer than twenty cases, mostly rubric-based, and it's caught more regressions than we expected — including one where a prompt change we were confident about quietly started truncating answers mid-thought on short context windows.

## Your first five evals — start here today

If you're not sure where to begin, here's a minimal list to get something running:

- **Happy path.** A typical, well-formed input. Does the output do what it's supposed to?
- **Underspecified input.** The user barely explained what they need. Does the output ask a clarifying question rather than guessing wildly?
- **Off-topic input.** Something completely outside your feature's scope. Does the output redirect gracefully?
- **Long input.** Three times the typical length. Does the output stay coherent, or does it start cutting corners?
- **Sensitive input.** Something that could go badly — frustration, a hint of self-doubt, a loaded topic. Does the output handle it with appropriate care?

That's a start. Add five more next week. By the time you have thirty, you'll wonder how you shipped without them.

---

Building consistent AI products means knowing what "good" looks like *before* your users tell you it's bad. Evals are how you formalize that knowledge and make it durable. They don't have to be sophisticated — they just have to exist.

For more on the feedback loop between real users and product quality, [What 500 Beginners Taught Us About Learning to Code with AI](/blog/what-beginners-taught-us-learning-to-code-with-ai) is a good follow-up. And if you're deep in an existing feature, the story in [Measure Before You Optimize](/blog/measure-before-you-optimize) is a useful reminder of what happens when you trust intuition over measurement — and also when the measurement surprises you.
