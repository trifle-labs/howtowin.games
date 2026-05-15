# Dōbutsu shōgi

> "Animal chess" — a 3×4 shogi for children that has been completely solved.

| Field | Value |
|-------|-------|
| Also known as | Animal Shogi, Let's Catch the Lion! |
| Players | 2 |
| Type | Partisan board game (shogi variant) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (in practice strongly solved — full search) |
| **Game-theoretic value** | Second-player win |
| Year solved | 2009 |
| Solved by | Computational solution reported by researchers in Japan (see note) |
| State-space complexity | ~1.6 × 10^9 reachable positions |
| Game-tree complexity | Fully enumerated |

## Description

Played on a 3-column × 4-row board. Each side has four pieces — Lion (the king),
Giraffe, Elephant, and Chick — with simple movement. As in [shogi](shogi.md),
captured pieces are kept in hand and may be **dropped** back into play; the
Chick promotes to a Hen. You win by capturing the enemy Lion or by marching your
own Lion safely to the far rank.

## Solution status

Dōbutsu shōgi is **completely solved**. The reachable state space is only about
1.6 billion positions — small enough to enumerate exhaustively — and a full
solution was computed in 2009. The result: **with perfect play the second
player (Gote) wins**; equivalently, the game is a loss for the first player. The
solution is, in effect, a strong one: a value is known for every reachable
position.

It is the standard example of a genuine shogi-family game (drops and all) being
solved, precisely because shrinking the board to 3×4 collapses the otherwise
explosive complexity of [shogi](shogi.md).

> **[verify]** — The 2009 computational solution and the second-player-win
> verdict are widely reported; this archive should pin the primary publication
> (and confirm the exact reachable-position count) in
> [references.md](../references.md).

## Consensus on optimal play

- **Second player (Gote) wins with perfect play** — first player is in a losing position from move 1; as Sente, your only hope is opponent error; as Gote, follow the solved database and you cannot lose.
- **Lion advancement is the decisive threat** — the game ends when a Lion reaches the far rank safely OR when a Lion is captured; controlling whether YOUR Lion can advance safely to the goal rank while preventing the opponent's is the central strategic calculation on the tiny 3×4 board.
- **Use drops to create immediate threats** — captured pieces can be dropped anywhere on your turn; a well-timed Giraffe or Elephant drop that attacks the enemy Lion immediately forces a defensive response and is often more powerful than advancing a piece already on the board.
- **The Chick → Hen promotion doubles its value** — getting a Chick to promote on the far rank converts it from a single-step-forward piece to a multi-direction Hen; promoting while also threatening the Lion is a strong combined goal.
- **On a 3-wide board, flanking is impossible** — the Lion has nowhere to hide; every piece threatens the central file; defensive play often means keeping your Lion near the back rank while advancing supported threats.

## Engines & current best play

- **Strongest known program(s):** 2009 computational solution — effectively a complete minimax database for all ~1.6 billion positions; any program querying this database plays perfectly.
- **Strength:** Perfect — the complete database gives the exact result and optimal move for every reachable position.
- **Where the proof / tablebase lives (if solved):** 2009 exhaustive search (primary publication to be confirmed, see [verify] note above); widely reproduced in the abstract-game community.
- **Notes:** Dōbutsu shōgi is the canonical example of a shogi-family game made tractable by board reduction; it demonstrates that shogi's drop mechanic does not inherently prevent solving — the board size is the bottleneck.

## Complexity

~1.6 × 10^9 reachable positions — fully enumerated.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/D%C5%8Dbutsu_sh%C5%8Dgi)
- 2009 computational solution of Dōbutsu shōgi (primary publication to be confirmed). **[verify]**
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Shogi](shogi.md) · [Chess](chess.md) · [Minichess](minichess.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [retrograde analysis](../lexicon/README.md#retrograde-analysis)
