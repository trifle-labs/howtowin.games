# Conway's Soldiers

> A one-player peg puzzle with a beautiful proof: you can reach the fourth row, but never the fifth.

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

On an endless checkerboard, a horizontal line divides it into a "lower" half
(where you can place as many soldiers as you like) and an empty "upper" half.
Soldiers move only by jumping like in peg solitaire — horizontally or
vertically over a neighboring soldier into an empty cell, removing the soldier
you jumped over. The goal is to move a soldier as far up into the empty half
as possible.

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

- **Row 4 is as far as you can go; row 5 is proven impossible** — no matter how many soldiers you start with or what sequence of jumps you try, you can never reach row 5 above the line. Do not waste time looking for a clever setup that reaches row 5.
- **Use the potential function to check if a target row is possible** — each cell has a weight that gets smaller the farther it is from the target row. If the total weight of your starting soldiers is less than 1, reaching that target is impossible. Any valid jump keeps the total weight the same.
- **For row 4: the smallest known setup uses exactly 20 soldiers in a 3-5-7-5 diamond shape** — this is the known optimal pattern. Solving it takes 19 jumps (10 moves if you group consecutive jumps by the same soldier). This sequence is known but not obvious.
- **For rows 1-3: much smaller setups work** — small, symmetrical formations can bring a soldier up 1, 2, or 3 rows. These are straightforward and well-documented.
- **If diagonal jumps are allowed, the reachable rows change** — the classic result only applies to the standard up/down/left/right jump rule.

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
