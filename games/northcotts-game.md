# Northcott's game

> A checkers-like game on strips that is, once again, Nim wearing a costume.

| Field | Value |
|-------|-------|
| Also known as | Northcott's Nim |
| Players | 2 |
| Type | Impartial combinatorial game (in effect; see note) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Second-player win iff the nim-sum of the gaps is 0 |
| Year solved | Folklore (classic Nim-equivalence) |
| Solved by | Folklore; treated in *Winning Ways* |
| State-space complexity | Depends on board dimensions |
| Game-tree complexity | Depends on board dimensions |

## Description

On each row of a board sit two checkers, one belonging to each player. On a turn
a player slides **their own** checker along its row any number of empty squares,
left or right, **without jumping or passing** the opponent's checker. Under
[normal play](../lexicon/README.md#normal-play-convention) the player who cannot
move loses.

> Note: Northcott's game is nominally [partisan](../lexicon/README.md#partisan-game)
> — each player moves only their own pieces — but its analysis reduces exactly
> to an impartial game, which is the point of the example.

## Solution status

Northcott's game is **strongly solved**: it is **[Nim](nim.md) in disguise**.
The only thing that matters on each row is the *gap* — the number of empty
squares between the two checkers — and a move changes one gap to any smaller or
(crucially) *larger* value, since a player can also retreat. Because retreats
can be mirrored by the opponent, the game is equivalent to Nim with heap sizes
equal to the gaps: the position is a second-player win exactly when the
[nim-sum](../lexicon/README.md#nim-sum) of the gaps is 0.

It is a favourite teaching example because it looks like a positional board game
yet is solved by one line of Nim theory — and it illustrates how "you can also
move backwards" need not change the game value.

## Consensus on optimal play

- **Map gaps to heaps** — on each row, count the empty squares between the two checkers; that number is your "heap" for Nim purposes.
- **XOR all gaps** — compute the nim-sum of the gaps across all rows; if it is non-zero you are in a winning position and must move to make it 0.
- **Mirror retreats** — if your opponent retreats (increases a gap), immediately re-shrink that same row's gap to restore nim-sum 0; retreats cannot help the losing player.
- **Never increase your losing row's gap needlessly** — in a losing position (nim-sum 0), any move breaks the balance; all you can do is hope for an opponent error.
- **Reduce the dominating row** — the standard Nim technique of isolating the single row whose gap exceeds the XOR target applies directly.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine needed — the strategy is a closed-form nim-sum formula.
- **Strength:** Perfect play by any program correctly computing the nim-sum of gaps.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** Northcott's game is isomorphic to Nim; the equivalence is a standard Combinatorial Game Theory exercise.

## Complexity

Linear in the number of rows to evaluate a position.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Northcott%27s_game)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Bouton, C. L. (1901). *Nim, A Game with a Complete Mathematical Theory*.](../references.md#bouton1901)

## See also

- [Nim](nim.md) · [Turning Turtles](turning-turtles.md) · [Mock Turtles](mock-turtles.md)
- Lexicon: [nim-sum](../lexicon/README.md#nim-sum) · [impartial game](../lexicon/README.md#impartial-game)
