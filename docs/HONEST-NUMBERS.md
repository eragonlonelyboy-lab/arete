# Honest numbers

Every Demiurge repo states what its numbers cannot prove, when the tool is the wrong tool, and the one honest test. ARETE's version, plainly.

## What ARETE cannot prove

- **No effect size is claimed.** You will find no "+34% task success" here. Agent-discipline gains depend on the model, the harness, and the task mix; a universal number would be theater. The bench exists precisely so you can measure the delta on YOUR setup instead of trusting mine.
- **Judgment does not transfer.** Wiring the doctrine into a weak model does not make it reason like a strong one. What transfers is discipline (fully) and judgment (only where a checklist or an independent check can carry it). If your task fails on raw reasoning, ARETE routes you to a stronger model; it does not fake one.
- **Doctrine obedience is unmeasured by default.** `arete init` proves the text is in the file, not that the agent follows it. Only the bench observes behavior.

## Our own first probe, disclosed

The first A/B probe of this doctrine (2026-07-10, Sonnet-class model, seeded-bug task) had **broken isolation**: the "bare" arm ran inside a workspace whose agent files already carried the doctrine, so both arms were loaded. Near-tie result, one behavioral delta (the explicitly-loaded arm added regression tests; n=1, could be noise). We kept the row, fixed the kit so arms run outside any configured workspace, and state it here instead of quietly rerunning until the chart looked good. That is the standard this repo holds itself to.

## When ARETE is the wrong tool

- Your agent runs one-shot prompts with no tools and no file access: there is nothing for the gates to gate.
- You need a guaranteed outcome on a weak model for a judgment-heavy task: no doctrine delivers that; buy the stronger model.
- You want a number to put on a slide: the bench gives you rows for your setup, not a marketing figure.

## The one honest test

```
arete bench
```

Seed the kit, run one bare arm and one loaded arm on the same model in fresh folders outside any configured workspace, grade both against the 9-row rubric, and diff the rows. Repeat across a few tasks and models before concluding anything. If the loaded arm shows no delta on your setup, ARETE is not earning its context window there, and you should believe your rows over this README.
