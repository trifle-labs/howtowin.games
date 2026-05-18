# Minichess

> Chess on a smaller board. Several variants exist, and at least one (Gardner's 5x5) has been solved.

| Field | Value |
|-------|-------|
| Also known as | Small-board chess; specific variants: Gardner Minichess (5×5), Los Alamos chess (6×6), MicroChess (4×5), etc. |
| Players | 2 |
| Type | Partisan board game (chess variant) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially solved (Gardner 5×5 weakly solved; others unsolved) |
| **Game-theoretic value** | Gardner 5×5: draw. Larger minichess variants: unknown |
| Year solved | Gardner 5×5: 2013 |
| Solved by | Mehdi Mhalla & Frédéric Prost (Gardner 5×5) |
| State-space complexity | Varies by variant; far smaller than chess |
| Game-tree complexity | Varies by variant |
| **Playable** | minichess |

## Description

"Minichess" is a family of chess-like games played on smaller boards. The rules
and pieces are the same as regular chess, but because the board is smaller the
game is shorter and easier to analyze. The best-known version is **Gardner
Minichess**: a 5x5 board with all the usual chess pieces. Others include **Los
Alamos chess** (6x6, no bishops), **MicroChess** (4x5), and various other sizes.

## Solution status

Minichess is **partially solved** — it depends on the variant.

- **Gardner's 5×5 Minichess is weakly solved.** [Mhalla & Prost (2013)](../references.md#vandenherik2002)
  proved, by full game-tree search, that with perfect play it is a **draw**.
  *(Reference: M. Mhalla & F. Prost, "Gardner's Minichess Variant is Solved,"
  ICGA Journal, 2013 — **[verify]** and add to the bibliography.)*
- Larger variants (Los Alamos 6×6, 5×6 boards, etc.) are **not** solved,
  although they are far smaller than full chess and are plausible future
  targets.

Minichess variants are valuable as scaled-down testbeds: small enough that
exhaustive solving is feasible for the smallest, large enough to retain real
chess tactics.

## Consensus on optimal play

- **Gardner 5x5: perfect play leads to a draw** — both sides can avoid losing if they play correctly. If you know the basic tactics (forks, pins in a tiny space), aim for a draw against any opponent.
- **Every move matters immediately on a small board** — in Gardner 5x5 there is almost no quiet opening; pieces meet right away and you must calculate threats from move one. Quick thinking matters more than long-term strategy.
- **Knight forks are extra powerful on 5x5** — the knight's L-shaped jump can reach a big part of the board from almost anywhere. Keep your pieces out of range of the opponent's knight.
- **Pawns promote fast** — with only a few rows to travel, pawns can become queens very quickly. Always count who would win a pawn race before making other moves.
- **Los Alamos (6x6, no bishops): rooks rule** — without bishops, the diagonal game disappears. Rooks and queens control the straight lines, and knights cover diagonal gaps. Take control of open rows and columns early.
- **For larger unsolved variants, use normal chess strategy** — develop your pieces, keep your king safe, and control the center. Chess engines adapted for these variants play well even without a formal solution.

## Engines & current best play

- **Strongest known program(s):** For Gardner 5×5: the solver by Mhalla & Prost (2013) provides exact play; for larger variants, any strong chess engine (Stockfish, etc.) adapted for the specific piece rules plays well.
- **Strength:** Perfect for Gardner 5×5 (fully solved); strong for larger variants.
- **Where the proof / tablebase lives (if solved):** Gardner 5×5: Mhalla & Prost (2013), ICGA Journal — draw proven by full game-tree search.
- **Notes:** Minichess variants are valuable scaled-down research testbeds; Gardner 5×5 is the only chess-family game with all standard piece types that has been formally solved.

## Complexity

Variant-dependent; the 5×5 Gardner board is small enough for a complete search.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Minichess) ([archive](http://web.archive.org/web/20260210010246/https://en.wikipedia.org/wiki/Minichess))
- M. Mhalla & F. Prost (2013). *Gardner's Minichess Variant is Solved*. ICGA Journal. **[verify]**
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Losing chess](losing-chess.md) · [Hexapawn](hexapawn.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [draw](../lexicon/README.md#draw)
