# ARETE

![Arete, goddess of excellence, measuring five automata of different sizes against one standard line of light](assets/hero.png)

**The operating standard for AI agents. Five gates, any model.**

I am the standard, not the model. Point any agent at me, Claude or Codex or whatever ships next, and it works the way the best one does: scope before work, evidence before reasoning, adversarial before committing, verification before "done", calibration before reporting. The intelligence stays the model's. The discipline becomes yours, permanently, on every substrate you run.

## Why this exists

Every model upgrade teaches the same lesson: the agent that feels "smarter" is mostly running a better system. Most of the observed gap between a great agent and a mediocre one is not weights; it is working discipline, and discipline is text. Text can be wired into any agent's memory file. So when you lose access to the frontier model, you do not lose the way it worked.

The market answer to this is the prompt-pack: an essay of exhortations nobody can test. I refuse the category. ARETE ships as three things: a doctrine you can read, a compiler that wires it into your agents, and **a falsifiable bench that tells you whether it actually moved behavior on your model**. If the bench says it did nothing for your setup, believe the bench, not me.

## Quickstart

> **From npm:** `npm install -g demiurge-arete`, then `arete init` (dry-run) and `arete init --apply` Or without installing: `npx demiurge-arete init`. Source build below.

```
git clone https://github.com/eragonlonelyboy-lab/arete
cd your-project
node <path-to-arete>/bin/arete.js init            # dry-run: shows the plan
node <path-to-arete>/bin/arete.js init --apply    # writes the five-gate loop into CLAUDE.md + AGENTS.md
node <path-to-arete>/bin/arete.js doctor          # confirms what is wired
```

`npm link` in the repo makes `arete` available everywhere. The loop lands behind managed markers; your own content is never touched; `arete init --remove --apply` strips it clean.

## The gates (the 30-second version)

1. **Scope.** Define done and how you will check it. Reversible: do it. Irreversible or outward-facing: confirm first.
2. **Evidence.** Open the real file, API, data. Docs and comments are claims, not facts.
3. **Adversarial.** Try to kill your own answer before committing. The easy answer earns the hardest attack.
4. **Verify.** At the layer of the claim, with evidence you did not generate. Sample the tails. A clean pass you cannot explain is unverified.
5. **Report.** Lead with the answer. Verified and assumed, separated out loud. What you observed, not what you intended.

Plus the rule the whole repo is named for: **same standard, shorter stride.** The gates never bend to a weaker model; the step size does. Full text: [DOCTRINE.md](DOCTRINE.md).

## The bench (the part nobody else ships)

```
arete bench        # seeds ./arete-bench: a seeded-bug task, two arm prompts, a 9-row rubric
```

A small Python module with two real bugs (one obvious, one subtle side effect), a lying docstring, and a test suite that passes anyway. Run one fresh session with the doctrine loaded and one without, outside any configured workspace, and grade both reports against the rubric. Which rubric rows differ tells you exactly what the doctrine buys on your model, in your harness.

Run it before you trust me. One probe is signal, not proof: keep the rows, accumulate, then conclude. What the bench cannot prove is in [docs/HONEST-NUMBERS.md](docs/HONEST-NUMBERS.md), including the run where our own first probe's isolation broke and what it taught us.

## The panel (the doctrine that measures itself)

```
arete panel        # reads correction ledgers for failure-class tags
```

If you keep a correction ledger ([CHIRON](https://github.com/eragonlonelyboy-lab/chiron) format), tag each captured correction with the discipline stage it violated: `class:scope`, `class:evidence`, `class:adversarial`, `class:verify`, `class:report`. The panel counts them and names your leakiest gate. That gate is the next thing to harden; the doctrine evolves from your defect data, not from taste.

## What ARETE is not

- Not a model, and not a way to make a weak model reason like a strong one. Raw reasoning does not transfer. Discipline transfers fully; judgment transfers only by externalizing it into checks. That trade is stated plainly and the bench measures what is left.
- Not a framework. No runtime, no daemon, no API key. A doctrine file, a compiler, a bench, a panel. The CLI is deterministic: zero LLM calls, zero network.
- Not finished. The doctrine carries a version history; each time a stronger frontier model ships, its working-discipline delta gets distilled in and the version bumps.

## House laws

1. Evidence or it did not happen. The bench exists so my own claim is testable.
2. The critical path is deterministic. Nothing in this CLI calls a model.
3. Warn first, never trap. Dry-run defaults, managed markers only, clean removal.
4. Honest numbers only. See [docs/HONEST-NUMBERS.md](docs/HONEST-NUMBERS.md): no benchmark theater.
5. Windows first, MIT always.

Part of [DEMIURGE](https://github.com/eragonlonelyboy-lab/demiurge), a house of small gods for AI-assisted work. Siblings enforce single gates as full products: HORKOS (Gate 4 as an evidence audit), ATHENA (Gate 3 as an adversarial council), CHIRON and HYPNOS (the compound loop as correction rules and memory). ARETE is the standard they are organs of. Each stands alone; together they close the loop.
