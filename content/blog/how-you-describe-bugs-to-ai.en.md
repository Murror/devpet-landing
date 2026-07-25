---
title: "How You Describe Bugs to AI Predicts Your Learning Stage"
description: "The way you frame an error when asking AI for help reveals more about your coding stage than almost anything else. Here's what Codepet's data shows."
date: "2026-07-25"
category: "user-insights"
author: "Nguyen"
authorTitle: "Codepet"
tags: ["debugging", "learning", "ai", "beginners", "user-research", "prompting"]
---

There's a tell in how someone describes a bug to an AI. Something in the phrasing, the scope, the amount of context — that signals, almost immediately, where they are in their journey as a developer.

We noticed this early in Codepet's data. Not from surveys. Not from self-reported skill levels. From watching the actual messages people typed into the prompt box when something broke.

Three patterns emerged clearly enough that we started using them internally as a loose taxonomy. They don't map perfectly onto "beginner / intermediate / advanced," but they come close. And understanding which pattern you're in changes how you should think about both your learning and your AI use.

## The three patterns

### Pattern one: "It doesn't work"

The most common pattern among people in their first few weeks. Something breaks, and the description of the break is general to the point of opacity.

```
"My code doesn't work. Can you fix it?"
"Nothing is showing up on the page."
"I ran it and something went wrong."
```

This isn't laziness. It's a knowledge gap about what information matters. When you don't yet have a mental model of what the system is doing, you can't narrow the description down — because you don't know where to look.

The cognitive move happening here is: "AI knows everything, so I'll describe the surface symptom and let it figure out the rest." That instinct makes sense, and sometimes it works. But it's slow, because the AI has to ask clarifying questions or make assumptions that turn out to be wrong. The loop extends. Frustration builds.

### Pattern two: "This line throws an error"

The second pattern shows up once people have spent enough time reading error messages that they trust them. The description of the problem narrows — now it's localized to something specific.

```
"Line 24 throws a TypeError: Cannot read property 'map' of undefined."
"The console says 'fetch is not defined' and I'm not sure why."
"This function returns undefined when I pass it a string."
```

This is a meaningful jump. The user has started to see the error message as information, not just noise. They're beginning to understand that the system is trying to tell them something — they just don't always know what.

At this stage, AI conversations become noticeably more efficient. The problem is scoped. The AI can hone in on the relevant code. Iterations go faster.

### Pattern three: "When I do X, Y happens, but I expected Z"

The third pattern is where debugging becomes a genuinely collaborative act. The user has a hypothesis. They've observed behavior. They understand the gap between what they expected and what they got.

```
"When the user clicks Submit, the form should clear — but it submits 
and immediately re-renders with the old data. I think the state 
isn't being reset after the POST request, but I'm not sure why."
```

This pattern changes everything about how AI helps. The AI isn't guessing at the problem — it's working with the user's understanding of the system and helping them test a hypothesis. The conversation becomes lateral rather than vertical.

> The difference between asking "why is this broken?" and "I think it's broken because of X, can you help me test that?" is not just a matter of precision. It's the difference between outsourcing thinking and using AI to amplify thinking you're already doing.

This is what we mean when we talk about AI as a thought partner rather than an answer machine. Pattern three is where that relationship actually becomes possible.

## Why describing errors well is a skill worth developing

Here's what's interesting: moving from pattern one to pattern three isn't just about learning more code. It's about building a more accurate mental model of what's happening when something breaks.

When you describe a bug clearly — when you can say "I expected X, I got Y, I think Z might be the reason" — you've already done most of the debugging work. You've located the symptom. You've formed a hypothesis. Sometimes you find the bug before the AI even responds.

This is the side effect of learning to give better prompts. It doesn't just help the AI help you faster. It makes you a better debugger.

We see this shift happen in Codepet users somewhere around their third or fourth project. Not because they took a class on debugging. Because they've had enough friction with vague prompts that they've learned, through experience, that specificity pays off.

If you're curious about how AI responds differently depending on what you give it, [How to Give AI Context](/blog/how-to-give-ai-context) breaks down the structural elements of a prompt that actually change the output.

## What each pattern asks of the AI

The three patterns also produce fundamentally different AI behaviors — worth knowing if you're building something on top of an LLM, or if you're trying to understand your own usage.

**Pattern one prompts** invite the AI to do everything: interpret the problem, locate the relevant code, diagnose the root cause, produce the fix. This is fine for simple bugs and expensive for complex ones. It also tends to produce answers that are hard to evaluate, because you didn't participate in forming them.

**Pattern two prompts** give the AI a starting point. Conversations are shorter. Answers are easier to understand because they're anchored to something the user already identified.

**Pattern three prompts** turn the AI into a reviewer of your thinking. The AI is checking your logic, testing your hypothesis, and occasionally redirecting you when your mental model is wrong. This is where AI is most genuinely useful as a learning tool.

```
# Pattern one   → average conversation length: ~6-8 exchanges
# Pattern two   → average conversation length: ~3-4 exchanges
# Pattern three → average conversation length: ~1-2 exchanges
```

This ratio has held up consistently in what we've observed. The more work the user does before asking, the faster the conversation resolves — and the more the user retains from it.

## How to move up the curve

The honest answer is: by writing more bugs. Pattern recognition comes from having described enough broken things that you develop an intuition for where to look.

But you can accelerate it. The next time something breaks, before you ask AI anything, write down:

1. What you expected to happen
2. What actually happened
3. Your best guess for why

Even if your guess is wrong, this exercise forces you to form a hypothesis — and hypothesis-formation is the core skill pattern three requires. Start with that, then take it to the AI. The conversation will be shorter, the fix will be clearer, and — more importantly — you'll retain it better because you were part of figuring it out.

The gap between "it doesn't work" and "when I do X, Y happens" is not as wide as it might seem. It's a shift in what you pay attention to, not a shift in how much you know. And once you make it, you stop needing AI to do your debugging for you — and start using it to go faster on the debugging you're already doing.

For more patterns from watching real learners build with AI, the [User Insights](/blog/category/user-insights) category covers what we've found. And if you want to see this dynamic from the review side, [Ask AI to Review Your Code](/blog/ask-ai-to-review-your-code) looks at what happens when you bring AI into the loop on code you've already written — the same collaboration, different angle.
