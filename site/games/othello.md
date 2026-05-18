# Othello

> The classic disc-flipping game. Since 2023 it has been solved: the result is a draw.

| Field | Value |
|-------|-------|
| Also known as | Reversi |
| Players | 2 |
| Type | Partisan positional / capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (standard 8×8) |
| **Game-theoretic value** | Draw |
| Year solved | 2023 (8×8); 6×6 settled earlier |
| Solved by | Hiroki Takizawa (8×8); 6×6 attributed to Joel Feinstein (1993) |
| State-space complexity | ~10^28 |
| Game-tree complexity | ~10^58 |
| **Playable** | othello |

## Description

Played on an 8x8 board. Players take turns placing a disc of their own colour so that it traps one or more straight lines of the opponent's discs between the new disc and another of the player's own discs; all trapped discs flip over to the player's colour. If you have no legal move, you pass. When neither player can move, the player with more discs on the board wins.

## Solution status

Standard 8×8 Othello is **weakly solved**. [Takizawa (2023)](../references.md#takizawa2023)
demonstrated, with a large but feasible search supported by strong
evaluation/verification, that **with perfect play the game is a draw** — neither
player can force a win from the standard start. This resolved one of the most
prominent "small enough to solve, but not yet solved" board games; Othello had
long been expected to be a draw, and the 2023 result confirmed it.

The reduced **6×6** board was settled much earlier — reported by
[Feinstein (1993)](../references.md#feinstein-othello6x61993) as a **second-player
win** (by 4 discs) via exhaustive search.

## Consensus on optimal play

- **Corners are permanent** — a disc in a corner can never be flipped over. Getting corners is the single most valuable goal and drives almost all high-level play.
- **Be careful near corners** — placing a disc one step diagonally inward from a corner (the "C-square" or "X-square") gives the opponent a way to take the corner. Avoid these early.
- **Limit the opponent's options** — leaving the opponent with few legal moves is more important than having lots of discs in the middle of the game. A player with no moves has to pass and loses control.
- **Mid-game disc count can fool you** — having fewer discs in the middle often gives you better positional control. A small disc count with good access to edges tends to win in the endgame when many discs flip at once.
- **Calculate the endgame exactly** — in the last 15-20 moves, the position resolves into forced sequences. Strong players and computers calculate this phase completely.
- **Draw with perfect play** — the 2023 solution (Takizawa) confirms that neither side can force a win from the standard opening with perfect play. In practice, players try to steer away from balanced positions.

## Engines & current best play

- **Strongest known program(s):** Edax — alpha-beta search with highly tuned evaluation; consistently the strongest public Othello engine.
- **Strength:** Super-human; Edax defeats the strongest human players.
- **Where the proof / tablebase lives (if solved):** [Takizawa (2023)](../references.md#takizawa2023)
- **Notes:** The 2023 solution used a large cloud-compute search; Edax itself was central to validating many of the claimed lines.

## Complexity

State-space ~10^28, game-tree ~10^58
([van den Herik et al., 2002](../references.md#vandenherik2002)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Reversi)
- [Takizawa, H. (2023). *Othello is Solved*.](../references.md#takizawa2023)
- [Feinstein, J. (1993). *Amenor Wins World 6×6 Championships*.](../references.md#feinstein-othello6x61993)
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Quixo](quixo.md) · [Checkers](checkers.md) · [Awari](awari.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [draw](../lexicon/README.md#draw)
