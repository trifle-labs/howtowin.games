# Shogi

> Japanese chess — captured pieces change sides and re-enter play, making it
> larger and harder to solve than Western chess.

| Field | Value |
|-------|-------|
| Also known as | Japanese chess |
| Players | 2 |
| Type | Partisan board game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | ~10^71 |
| Game-tree complexity | ~10^226 |
| **Playable** | shogi |

## Description

Played on a 9×9 board, each side with 20 pieces. Shogi's defining rule is the
**drop**: a captured piece is kept "in hand" and may later be placed back onto
the board as one's own. This recycling means material never leaves play, which
keeps the branching factor high throughout and rules out the endgame
simplification that chess enjoys.

## Solution status

Shogi is **unsolved**. Its state-space (~10^71) and especially its game-tree
complexity (~10^226) exceed even chess's, and the drop rule means there is no
"few pieces left" regime in which [retrograde
analysis](../lexicon/README.md#retrograde-analysis) tablebases can take hold the
way they do in chess. Shogi engines surpassed top human professionals in the
2010s, and [AlphaZero](../references.md#silver-alphazero2018) reached
superhuman shogi from self-play — but, as always, that is
[strong play, not solving](../lexicon/README.md#solving-vs-strong-play).

The closely related miniature [Dōbutsu shōgi](dobutsu-shogi.md), by contrast, *is*
solved — illustrating how drastically board size changes tractability.

## Consensus on optimal play

- **Drops change the whole tempo calculus** — a piece in hand can threaten a devastating drop on any legal square; calculating whether a drop-check or drop-fork is available after a trade is mandatory before initiating any exchange.
- **The king must stay mobile** — with drop-attacks possible on any square, a king kept in the back corner behind gold generals and a bishop is the standard defensive formation; learn the "castling" structures (mino, yagura, anaguma).
- **Attack castled kings with "floating" pieces** — lance, rook, and bishop promotions near the opponent's king create relentless drop threats; the offensive side typically sacrifices pieces to earn drop hands.
- **Promoted pieces stay in the enemy territory** — a promoted rook (Dragon King) or promoted bishop (Dragon Horse) in or near the opponent's camp is extremely powerful; trading it back early is almost always a mistake.
- **Material is almost never "lost"** — every captured piece is added to your hand; being behind in material only means your opponent has more drop options; evaluate hand pieces as future threats, not losses.

## Engines & current best play

- **Strongest known program(s):** YaneuraOu / Stockfish NNUE (shogi variant) and Gikou — deep neural-network evaluation + alpha-beta; super-human since ~2013.
- **Strength:** Far super-human; engines defeat top 9-dan professionals with large winning rates.
- **Where the proof / tablebase lives (if solved):** Not solved; no tablebase.
- **Notes:** The drop rule eliminates endgame simplification, making tablebases impractical; all strength comes from deep search and learned evaluation.

## Complexity

State-space ~10^71; game-tree ~10^226
([van den Herik et al., 2002](../references.md#vandenherik2002)). Generalised
shogi is EXPTIME-complete.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shogi) ([archive](http://web.archive.org/web/20260511040918/https://en.wikipedia.org/wiki/Shogi))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)
- [Silver et al. (2018). *AlphaZero*.](../references.md#silver-alphazero2018)

## See also

- [Dōbutsu shōgi](dobutsu-shogi.md) · [Chess](chess.md) · [Xiangqi](xiangqi.md) · [Janggi](janggi.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
