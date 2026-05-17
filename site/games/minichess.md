# Minichess

> Chess on a smaller board — several variants exist, and at least one (Gardner's
> 5×5) is weakly solved.

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

"Minichess" covers a family of chess variants on reduced boards, designed to
keep chess's pieces and rules while shrinking the search space. The best-known
solving target is **Gardner Minichess**: a 5×5 board with a full set of chess
piece types per side. Others include **Los Alamos chess** (6×6, no bishops),
**MicroChess** (4×5), and various 5×6 and 4×8 layouts.

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

- **Gardner 5×5: perfect play is a draw** — both sides can avoid losing with correct play; humans who know the basic tactical patterns (forks, pins in a tiny space) should aim to draw against any opponent.
- **The small board amplifies tactical immediacy** — in Gardner 5×5, there is almost no "quiet" development phase; pieces come into contact immediately and threats must be calculated from move one; tactical alertness matters more than strategic manoeuvring.
- **Knight forks are especially powerful on a 5×5 board** — the knight's L-shaped jump covers a significant fraction of the entire board; a misplaced piece can be forked from many squares; keep pieces out of knight-fork range of the opponent's knight.
- **Pawns promote very quickly** — with only a few ranks to traverse, pawn races to promotion are a constant danger; count pawn-race outcomes before making other moves.
- **Los Alamos (6×6, no bishops): open files and rooks dominate** — without bishops, the open diagonal game disappears; rooks and queens control open files, and knights cover diagonal weaknesses; seize open files early.
- **For larger unsolved variants, use standard chess heuristics** — development, king safety, and control of the centre apply; engines based on standard chess evaluation functions play these variants well despite the absence of a formal solution.

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
