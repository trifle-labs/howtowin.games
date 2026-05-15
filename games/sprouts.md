# Sprouts

> A pencil-and-paper game with a deceptively deep structure; solved by computer
> only up to a modest number of starting spots.

| Field | Value |
|-------|-------|
| Also known as | Sprouts |
| Players | 2 |
| Type | Impartial combinatorial game (topological) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (small numbers of starting spots) |
| **Game-theoretic value** | Known for many starting spot counts; conjectured pattern unproven in general |
| Year solved | Partially; computer analysis since 1991 |
| Solved by | M. S. Paterson & J. H. Conway (inventors); D. Applegate, G. Jacobson & D. Sleator (computer analysis) |
| State-space complexity | Grows rapidly with starting spots |
| Game-tree complexity | Grows rapidly with starting spots |

## Description

Start with *n* spots on paper. On a turn a player draws a line (which may curve)
joining two spots or a spot to itself, not crossing any existing line, and then
places a new spot on that line. Each spot may have at most three lines meeting
it. The player unable to move loses ([normal play](../lexicon/README.md#normal-play-convention)).
A game lasts at most 3n − 1 moves.

## Solution status

Sprouts is **partially solved**. [Applegate, Jacobson & Sleator (1991)](../references.md#applegate-sprouts1991)
analysed it by computer up to 11 starting spots; later distributed computations
(the Sprouts project) have pushed verified results considerably further. The
empirical pattern is the **"Sprouts conjecture"**: the first player wins exactly
when *n* mod 6 is 3, 4, or 5. The conjecture matches every computed value but
**has not been proven** for all *n*, so the standard game is not solved in
general.

The related game **[Brussels Sprouts](brussels-sprouts.md)** — superficially
similar but using crosses instead of spots — is, by contrast, completely solved
and is essentially a joke: its outcome is fixed in advance.

## Consensus on optimal play

- **Parity (the Sprouts conjecture) is the strategic compass** — if the starting count n mod 6 is 3, 4, or 5, the first player wins with correct play; otherwise the second player wins. Use this to decide whether to "waste" a move early on.
- **Degree-2 spots are almost as flexible as free spots** — a spot with two lines can still absorb exactly one more connection; treat them as near-live resources and plan around when they become exhausted.
- **Prevent large connected surviving regions** — isolated sub-regions of live spots each generate their own continuation; confining the game to fewer, smaller regions reduces your opponent's options.
- **Closing loops traps spots** — drawing a closed curve around one or more spots renders them unreachable (no line may cross existing lines); deliberately trap your opponent's live spots to deny moves.
- **Count the surviving moves** — at any point the maximum remaining moves is bounded by live spot count; track whether you or your opponent will exhaust moves first.

## Engines & current best play

- **Strongest known program(s):** The Sprouts Project (distributed computation) — exhaustive game-tree search using canonical topological representations.
- **Strength:** Solves all positions up to ~40+ starting spots; humans cannot match it on larger starting counts.
- **Where the proof / tablebase lives (if solved):** Partially; computed values available from the Sprouts Project archives. See also [../references.md#applegate-sprouts1991](../references.md#applegate-sprouts1991).
- **Notes:** The Sprouts conjecture (first player wins iff n mod 6 ∈ {3,4,5}) is unproven in general; every computed case confirms it.

## Complexity

The topological move structure makes naive enumeration explode; specialised
canonical-form representations are needed even to reach the analysed values.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Sprouts_(game)) ([archive](http://web.archive.org/web/20260511093257/https://en.wikipedia.org/wiki/Sprouts_(game)))
- [Applegate, D., Jacobson, G. & Sleator, D. (1991). *Computer Analysis of Sprouts*.](../references.md#applegate-sprouts1991)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Brussels Sprouts](brussels-sprouts.md) · [Chomp](chomp.md) · [Hackenbush](hackenbush.md)
- Lexicon: [impartial game](../lexicon/README.md#impartial-game) · [normal play convention](../lexicon/README.md#normal-play-convention)
