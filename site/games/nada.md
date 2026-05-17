# Nada!

> A real-time pattern-recognition dice game — unsolved as a competitive speed game.

| Field | Value |
|-------|-------|
| Also known as | Nada |
| Players | 2–4 |
| Type | Real-time stochastic dice game |
| Perfect information | Yes (all dice are visible) |
| Chance element | Yes (dice rolls) |
| **Solution status** | Unsolved (real-time speed element precludes any known solution framework) |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Tractable per roll (6 face values × up to 12 dice) |
| Game-tree complexity | N/A (real-time simultaneous play) |

## Description

Nada! is a fast-paced dice game for 2–4 players designed by Thierry Denoual and
first published in 2013 by Blue Orange Games. Players simultaneously race to
match symbols across a pool of 12 dice (6 white and 6 orange). On each turn,
all dice are rolled in the centre. Every player searches for a symbol that
appears on at least one white die and one orange die; the first to spot a match
calls it out and collects all dice showing that symbol. If no match exists at
all, the first player to shout "Nada!" collects the entire pool. The player
with the most dice after three rounds wins.

## Solution status

Nada! is **not solved** and does not fit any standard combinatorial-game
framework. It is a **real-time simultaneous-action game** in which outcomes
depend on perceptual speed and reaction time, not on a game tree that can be
searched. The probabilistic distribution of symbols across dice is trivial to
compute, but that is only a small sub-component of the game. There is no known
formal framework for solving a real-time pattern-matching speed game.

## Consensus on optimal play

- **Scan systematically** — train your eyes to sweep the dice in a consistent
  pattern (e.g., left-to-right across whites, then left-to-right across oranges,
  or focus on a single symbol at a time) rather than randomly glancing.
- **Know the symbols** — memorise the set of symbols so recognition becomes
  automatic; hesitation costs a beat.
- **Use the Nada call aggressively** — if a quick scan shows no obvious match,
  call Nada immediately rather than verifying exhaustively; a wrong call sits
  you out but a successful Nada wins the whole pool.
- **Watch opponents' gaze** — if another player looks ready to call, treat that
  as a cue to check whether they might be right or whether you can beat them to
  a different match.

## References

- [Blue Orange Games — Nada! product page](https://www.blueorangegames.com/index.php/games/nada)
- [Rules on UltraBoardGames](https://www.ultraboardgames.com/nada/game-rules.php)
- [BGG entry — Nada! (2013)](https://boardgamegeek.com/boardgame/36946/nada)

## See also

- [Yahtzee](yahtzee.md) · [Liar's dice](liars-dice.md) · [Backgammon](backgammon.md)
- Lexicon: [chance element](../lexicon/README.md#chance-element)
