# Chess960

> Chess with randomised back-rank setup (960 starting positions) — unsolved.

| Field | Value |
|-------|-------|
| Also known as | Fischer Random chess, FRC |
| Players | 2 |
| Type | Partisan chess variant |
| Perfect information | Yes |
| Chance element | No (initial position drawn once before play) |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Similar to chess (×960 start positions) |
| Game-tree complexity | Similar to chess |
| **Family** | chess |

## Description

Chess960 (Bobby Fischer, 1996) keeps every rule of chess intact but randomises
the back-rank pieces among the **960** legal starting positions (bishops on
opposite colours, king between the rooks). The goal is to defeat memorised
opening theory.

## Rules

1. Before play begins one of the 960 valid starting positions is chosen (the
   pawns always occupy the 2nd/7th ranks, the king lies between the rooks, and
   the two bishops sit on opposite colours).
2. Both players start with mirrored back ranks. After setup, play proceeds
   exactly as in orthodox chess.
3. **Castling** is generalised: the king and chosen rook end on the standard
   castled squares (c1/g1 or c8/g8 for king; d1/f1 or d8/f8 for rook),
   irrespective of their starting files; all squares the king passes through
   must be safe and unoccupied save for the castling rook.
4. All other rules — pawn double-step, en passant, promotion, stalemate, 50-move
   rule — are unchanged.

## Solution status

Chess960 is **not solved**. Each of 960 starting positions is its own opening
problem and engines play the game very strongly.

## Consensus on optimal play

- **Standard chess middlegame and endgame principles apply fully** — piece activity, king safety, pawn structure, and endgame technique carry over unchanged from orthodox chess; Chess960 only randomises the opening, not the underlying strategy.
- **Develop toward the centre quickly regardless of starting position** — without memorised opening theory to lean on, moving central pawns and developing minor pieces to active squares is even more important; reactive, passive development is more easily punished.
- **Understand castling rights before committing king or rook** — Chess960 castling rules can be counter-intuitive (e.g., a rook starting on g1 still castles to f1); confirm which pieces must stay in place before making commitments that forfeit castling.
- **Use engine analysis per starting position** — Stockfish, Leela Chess Zero, and Fairy-Stockfish all handle Chess960 natively; analysing your specific starting position beforehand gives opening guidance that substitutes for memorised theory.
- **Symmetric starts tend toward equality; asymmetric starts may offer sharper imbalances** — engine evaluation of the 960 positions shows most are roughly balanced but a few starting configurations give one side structurally superior piece placement; knowing which regime you are in calibrates risk tolerance.

## Engines & current best play

- **Strongest known program(s):** Stockfish ([https://stockfishchess.org/](https://stockfishchess.org/) ([archive](http://web.archive.org/web/20260512103017/https://stockfishchess.org/))) and Leela Chess Zero ([https://lczero.org/](https://lczero.org/) ([archive](http://web.archive.org/web/20260501191219/https://lczero.org/))) — both natively support Chess960; Lichess offers Chess960 play at [https://lichess.org/variant/chess960](https://lichess.org/variant/chess960) ([archive](http://web.archive.org/web/20260429091725/https://lichess.org/variant/chess960)).
- **Strength:** Super-human (same engines as for orthodox chess).
- **Where the proof / tablebase lives (if solved):** — (unsolved; no full tablebase; standard chess endgame tablebases apply for late-game positions)
- **Notes:** Chess960's main purpose is to eliminate opening preparation advantages; in practice, professional events (Chess960 World Championship) use it and top players treat it as equivalent in depth to classical chess from move 10 onward.

## Complexity

Similar to chess.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Chess960) ([archive](http://web.archive.org/web/20260501000739/https://en.wikipedia.org/wiki/Chess960))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Chess](chess.md) · [Capablanca chess](capablanca-chess.md) · [Courier chess](courier-chess.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
