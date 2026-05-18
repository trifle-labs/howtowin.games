# Northcott's game

> A checkers-like game on rows that is really just Nim in disguise.

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
| **Playable** | northcotts-game |

## Description

On each row of the board there are two checkers, one for each player. On your turn you slide **your own** checker along its row any number of empty squares, left or right, **without jumping over or going past** the opponent's checker. Under normal play, the player who cannot move loses.

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

- **Treat each gap as a Nim pile** — on each row, count the empty squares between the two checkers. That number is like a pile of objects in Nim.
- **XOR all gaps** — compute the XOR of the gaps across all rows. If the result is not zero, you are in a winning position and should make a move that makes it 0.
- **If the opponent retreats, shrink it back** — if your opponent moves backward (increasing a gap), immediately reduce that same row's gap to bring the XOR back to 0. Retreats cannot save a losing player.
- **In a losing position, any move loses** — if the XOR is already 0, any move you make will break the balance. All you can do is hope for the opponent to make a mistake.
- **Focus on the row with the biggest gap** — the standard Nim trick of finding the one row whose gap is larger than the XOR target works the same way here.

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
