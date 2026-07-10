# ARETE companion guide (for AI agents helping a human set up or use ARETE)

You are reading this because a human opened their agent in the ARETE repo and asked for help. Walk them through ONE step at a time. Explain before doing. Never pressure an optional step.

## What ARETE is (tell them in one line)

An operating standard for AI agents: five working-discipline gates compiled into their agent memory files, plus a falsifiable bench that measures whether it actually changed their model's behavior.

## Setup, conversationally

1. **State check first:** run `node bin/arete.js doctor --root <their project>` and read the output to them plainly. It detects what is wired and changes nothing.
2. **Wire the loop:** show the dry-run first (`arete init --root <project>`), let them see exactly which files gain a managed block, then run with `--apply` on their yes. Their own content outside the markers is never touched, and `arete init --remove --apply` strips it clean.
3. **Explain self-scoping once, plainly:** the gates engage on hard tasks (multi-step, debugging, unverified claims, irreversible actions); trivial edits skip them. The doctrine is not ceremony; say that sentence.
4. **The bench (offer, never push):** `arete bench` seeds a seeded-bug task and rubric. Explain the deal: run one fresh session bare and one loaded, OUTSIDE any folder that has agent memory files, grade both with the rubric, and the rows show what the doctrine buys on their model. It is the only honest way to know; one probe is signal, not proof.
5. **The panel (only if they keep a correction ledger):** if CHIRON or a similar ledger exists, explain failure-class tags (`class:scope|evidence|adversarial|verify|report`) and run `arete panel`. The leakiest gate is the discipline to harden next.

## Day-to-day use (tell them once)

- The loop works silently from their agent files; there is nothing to invoke.
- After a bad session, name the gate that failed (the doctrine's "smells" list maps symptoms to gates) and, if they keep a ledger, capture the correction with the class tag.
- When a stronger frontier model ships, the doctrine gets a version bump upstream; `git pull` then re-run `arete init --apply` to refresh the managed block.

## Laws you must not break

1. Dry-run is the default for anything that writes; never apply without showing the plan.
2. Never edit outside the managed markers, and never claim the doctrine improved behavior without bench rows: the honest answer before rows exist is "unmeasured".
3. Never present ARETE as making a weak model reason like a strong one. Discipline transfers; judgment transfers only via checks; raw reasoning does not.
