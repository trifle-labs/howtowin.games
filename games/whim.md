# Whim

> Conway's whimsical variant of Nim: players may, *once each*, swap to the
> misère convention. The whole game is strongly solved.

| Field | Value |
|-------|-------|
| Also known as | Whim |
| Players | 2 |
| Type | Impartial game with a convention-switch |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win except on a sparse P-set |
| Year solved | 1996 (treatment in *Winning Ways*) |
| Solved by | Berlekamp, Conway, Guy |
| State-space complexity | Same as Nim plus two binary flags |
| Game-tree complexity | Same as Nim |

## Description

Whim is Nim plus a single "whim" move available once to each player: at any
turn, instead of removing tokens, a player may declare that the game's ending
convention is *reversed* (last-move-wins becomes last-move-loses, or vice
versa). Whim is the canonical example of how a slight extension of Nim can be
analysed without abandoning the Sprague–Grundy framework.

## Rules

1. Several heaps of tokens, as in Nim.
2. On your turn either:
   - Make an ordinary Nim move (remove any positive number from one heap), **or**
   - If you have not yet used your "whim," declare the **misère switch**:
     toggle the ending convention. (Each player may do this at most once.)
3. Under whatever ending convention is active when the last token is taken, that
   player wins or loses accordingly.

## Solution status

Strongly solved by [Berlekamp, Conway & Guy](../references.md#bcg2001). Whim's
P-positions are essentially those of Nim, but with a careful endgame correction
when only heaps of size 1 remain — exactly the difference between Nim and
Misère Nim. The analysis adds two state flags (whether each player still has a
"whim" available) and proceeds by ordinary Grundy bookkeeping.

## Consensus on optimal play

- **Play ordinary Nim (XOR to zero) while heaps are large** — when all heaps are of size ≥ 2, the whim flags are irrelevant to the immediate move; play standard Nim (XOR all heap sizes to zero) and save your whim for the endgame.
- **Use your whim when heaps shrink to all-1s** — the critical moment is when the position reduces to heaps of size 1 only; at that point the active ending convention determines the winner, so using the whim switch to flip to the favourable convention (or preventing the opponent from doing so) is the entire endgame.
- **Whoever uses their whim last in the all-1s endgame wins** — in the final all-1s phase, the last whim used sets the final convention; the player with a whim remaining has the decisive move.
- **Do not waste your whim prematurely** — using the whim switch while large heaps remain is usually wasted: the opponent can simply play the corrected strategy in whatever convention now applies; preserve the whim for maximum value.
- **Track both players' whim flags as part of the game state** — there are four possible (my-whim, opponent-whim) flag combinations; know which phase you are in to apply the correct strategy.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; the strategy is an extension of standard Nim computed in the same O(n log n) time as the Sprague–Grundy XOR table.
- **Strength:** Perfectly solved; any correct implementation wins from all N-positions.
- **Where the proof / tablebase lives (if solved):** *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** Whim is included in *Winning Ways* as the canonical example of how a single rule-change token can be incorporated into Sprague–Grundy theory without abandoning the XOR framework.

## Complexity

Same as Nim — the whim flags add a factor of 4 to the state space.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Combinatorial_game_theory) ([archive](http://web.archive.org/web/20260508023449/https://en.wikipedia.org/wiki/Combinatorial_game_theory))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Nim](nim.md) · [Misère Nim](misere-nim.md) · [Poker Nim](poker-nim.md)
- Lexicon: [misère play](../lexicon/README.md#misere-play) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)
