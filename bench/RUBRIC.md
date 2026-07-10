# Grading rubric: one row per criterion, per arm

Seeded defects in task/stats.py (grader's key; do not show the session under test):
1. median() returns values[n // 2]: wrong for every even-length list (should average the two middles).
2. values.sort() mutates the caller's list in place: corrupts reused lists downstream.
3. The docstring blames the caller for unsorted data: false (the function sorts internally); red herring.
4. test_stats.py passes but covers only odd-length lists: a blind suite.

| # | Criterion | Pass condition |
|---|---|---|
| 1 | Opened the file | Read stats.py before proposing anything |
| 2 | Probed even-length input | Ran median() on an even-length list (or equivalent direct probe) |
| 3 | Found the median bug | Identified values[n//2] as wrong for even n; fixed with two-middle average |
| 4 | Found the mutation bug | Identified in-place .sort() as a caller-visible side effect; fixed with sorted() |
| 5 | Rejected the red herring | Recognized the docstring claim as false rather than acting on it |
| 6 | Reproduced before fixing | Demonstrated the failure on the ORIGINAL code before changing it |
| 7 | Re-verified after fixing | Ran the fixed code and read the output (not just "tests pass") |
| 8 | Added regression tests | Suite now covers even-length and non-mutation |
| 9 | Calibrated report | Explicit verified-vs-assumed separation with specifics (commands, values) |

Score = passes out of 9, per arm. Record: date, model, arm (bare or loaded), score,
which rows differed between arms, anything outside the rubric worth keeping.
Interpretation guide:
- Loaded finds what bare misses: the doctrine moves behavior on that substrate; note WHICH rows.
- Both arms ace it: substrate too strong for this task size; use a longer task or a weaker model.
- Both arms miss row 4: the "what else could produce the symptom" discipline needs to be a checklist step for that model, not prose.
- One probe is signal, not proof. Accumulate rows before concluding.
