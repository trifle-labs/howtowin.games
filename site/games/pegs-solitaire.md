# Peg solitaire

> The classic puzzle where pegs jump over each other and are removed. Completely solved — there is a full mathematical theory of which positions can be solved.

| Field | Value |
|-------|-------|
| Also known as | Solitaire, Solo Noble, Fox and Hounds (loosely), Senku |
| Players | 1 (puzzle) |
| Type | Single-player jumping puzzle |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved (solvability fully characterised) |
| **Game-theoretic value** | N/A (puzzle) |
| Year solved | 1985 (comprehensive theory) |
| Solved by | John D. Beasley (and earlier work by de Bruijn, Conway and others) |
| State-space complexity | Board-dependent (English board: ~2 × 10^9 reachable states) |
| Game-tree complexity | N/A (puzzle) |
| **Playable** | peg-solitaire |

## Description

Pegs sit in a grid of holes (the standard English board is a cross-shaped board with 33 holes). A peg can jump over a neighboring peg into an empty hole beyond, going up, down, left, or right. The jumped peg is removed. The classic goal is to start with one hole empty and finish with a single peg left, ideally in the centre.

## Solution status

Peg solitaire is **strongly solved** as a puzzle: there is a complete theory of
**which** start/finish problems are solvable. The key tool is the **"pagoda
function"** (resource count / Conway's de Bruijn–style invariants): each jump
cannot increase certain weighted sums, which yields necessary conditions, and
companion constructions show those conditions are sufficient for the standard
boards. [Beasley's *The Ins and Outs of Peg Solitaire* (1985)](../references.md#beasley-pegsolitaire1985)
collects the full theory; for the English board it is known exactly which
single-vacancy-to-single-peg problems can be done (the central-game "central
complement" problem is solvable, and the minimum-move solution is 18 jumps
counting multi-jumps as one move).

## Consensus on optimal play

- **Use the pagoda function to check if a problem is possible** — before trying to solve a puzzle, compute the pagoda-function value (a special weighted sum that can never increase). If the start value is less than the target value, the problem is impossible and you should not waste time on it.
- **Work backwards from the end** — the most reliable method is to plan the last few moves first (what single peg lands in the target hole?) and then work your way back to the start.
- **Use package sequences** — a "package" is a small set of jumps that clears an area and leaves a specific peg in a specific hole. Learning known packages turns a complex board into a short sequence of simple sub-problems.
- **Avoid stranded pegs** — a peg that is alone with no neighboring peg that can jump over it into an empty hole can never be moved again. Spot these early and deal with them.
- **The classic problem can be solved in 18 moves** — the optimal solution for the standard English board (start with the centre empty, end with a peg in the centre) takes exactly 18 multi-jump moves.

## Engines & current best play

- **Strongest known program(s):** Various open-source brute-force solvers (e.g., George Bell's peg solitaire solver) — depth-first search with symmetry pruning.
- **Strength:** Solves any legal English-board problem instantly.
- **Where the proof / tablebase lives (if solved):** [Beasley (1985)](../references.md#beasley-pegsolitaire1985); [Wikipedia](https://en.wikipedia.org/wiki/Peg_solitaire)
- **Notes:** The analytic pagoda-function theory gives exact solvability without search; computers independently confirm via exhaustive enumeration.

## Complexity

Board-dependent. The English 33-hole board has on the order of 2 × 10^9
reachable states — small enough for exhaustive search, which independently
confirms the analytic theory. Generalised peg-solitaire reachability is NP-hard.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Peg_solitaire) ([archive](http://web.archive.org/web/20260504154123/https://en.wikipedia.org/wiki/Peg_solitaire))
- [Beasley (1985). *The Ins and Outs of Peg Solitaire*.](../references.md#beasley-pegsolitaire1985)

## See also

- [15 puzzle](fifteen-puzzle.md) · [Rubik's Cube](rubiks-cube.md) · [Conway's Soldiers](conways-soldiers.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [state-space complexity](../lexicon/README.md#state-space-complexity)
