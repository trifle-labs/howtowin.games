# Conway's Soldiers

> A one-player peg puzzle with a beautiful impossibility proof: you can reach
> the fourth row, but never the fifth.

| Field | Value |
|-------|-------|
| Also known as | Conway's Soldiers, the checker-jumping problem |
| Players | 1 (solitaire puzzle) |
| Type | One-player combinatorial puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | N/A — proven: rows 1–4 reachable, row 5 unreachable |
| Year solved | 1976 |
| Solved by | John H. Conway |
| State-space complexity | Infinite board, but the result is a closed theorem |
| Game-tree complexity | N/A |
| **Playable** | conways-soldiers |

## Description

On an infinite checkerboard, a horizontal line divides it into a "lower" half
(filled with as many soldiers as you like) and an empty "upper" half. Soldiers
move only by peg-solitaire jumps — horizontally or vertically over an adjacent
soldier into an empty cell, removing the jumped soldier. The goal is to advance
a soldier as far up into the empty half as possible.

## Solution status

Conway's Soldiers is **strongly solved** by a famous theorem. Using a
*potential-function* argument (assign each cell a weight that is a power of
1/φ where φ is the golden ratio, chosen so a jump never increases total
potential), [Conway (1976)](../references.md#conway1976) proved:

- a soldier can be brought to **row 1, 2, 3, or 4** above the line with finitely
  many soldiers, but
- **row 5 can never be reached** with any finite starting army.

The impossibility is exact, not empirical. (Variants relax the result:
diagonal moves, or an infinite limiting process, change which rows are
reachable — but the standard puzzle is completely settled.)

## Consensus on optimal play

- **Row 4 is the maximum reachable row; attempting row 5 is provably futile** — no matter how many soldiers you start with or which sequence of jumps you make, row 5 above the line is unreachable; do not waste time searching for a clever configuration.
- **Use the potential-function argument to check any candidate construction** — assign each cell weight φ^(−r) where r is the vertical distance from the target row; any valid jump sequence preserves total weight exactly; if your starting configuration's weight is less than 1, reaching that target is impossible.
- **For row 4 (our row 0): the minimum known construction requires exactly 20 soldiers in a 3‑5‑7‑5 diamond** — this is the established optimal pattern. The exact solution requires 19 jumps (only 10 moves if consecutive jumps by the same soldier are grouped). This specific sequence is known but non‑obvious — the playable solver uses beam search and generally reaches row 1 (three above the line) but may not find the full 19‑jump solution automatically.
- **For rows 1–3: constructions are much smaller and straightforward** — small symmetric formations bring a soldier up 1, 2, or 3 rows respectively; these are tractable and well-documented in the references.
- **Diagonal-jump variants change the reachability threshold** — if diagonal jumps are allowed, different rows become reachable; the classical result applies only to the standard orthogonal-jump rule.

## Engines & current best play

- **Strongest known program(s):** No game-playing engine is relevant — this is a one-player solitaire puzzle with a proven impossibility result.
- **Strength:** Perfect — the complete characterisation is a closed theorem, not a search result.
- **Where the proof / tablebase lives (if solved):** [Conway (1976)](../references.md#conway1976); see also [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001).
- **Notes:** Conway's Soldiers is one of the most elegant impossibility results in recreational mathematics; the golden-ratio potential function is the key insight and is non-obvious despite the simple rules.

## Complexity

Not a search problem — the answer is a theorem with a short proof.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Soldiers) ([archive](http://web.archive.org/web/20260418214622/https://en.wikipedia.org/wiki/Conway%27s_Soldiers))
- [Conway, J. H. (1976). *On Numbers and Games*.](../references.md#conway1976)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Peg solitaire](pegs-solitaire.md) · [Brussels Sprouts](brussels-sprouts.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved)
