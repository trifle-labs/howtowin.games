# Sprouts

> A pencil-and-paper game where players draw lines between dots. Only partially solved — the winning strategy is known for small numbers of starting dots but not proven for all cases.

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
| **Playable** | sprouts |

## Description

Start with some number of dots on paper. On a turn, a player draws a line (which may curve) connecting two dots or a dot to itself. The line cannot cross any existing line. Then the player places a new dot somewhere on that line. Each dot can have at most three lines meeting it. The player who cannot move loses. A game lasts at most 3 times the starting number of dots minus 1 moves.

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

- **Use the Sprouts conjecture as a guide** — based on computer analysis, it is believed that the first player wins when the starting number of dots divided by 6 leaves a remainder of 3, 4, or 5. Otherwise the second player wins. Use this to decide whether to make a "waste" move early on.
- **Dots with two lines still matter** — a dot that already has two lines can still accept exactly one more connection. Treat these as nearly-live resources and plan around when they run out.
- **Keep the game contained** — dividing the board into many separate areas gives the opponent more options. Try to keep the game in fewer, smaller regions.
- **Trap the opponent's dots with closed loops** — drawing a closed curve around one or more dots makes them unreachable (no line can cross existing lines). Deliberately trap the opponent's live dots to deny them moves.
- **Count how many moves are left** — at any point, the maximum remaining moves is limited by the number of live dots. Track whether you or the opponent will run out of moves first.

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
