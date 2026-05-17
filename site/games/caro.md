# Caro

> The Vietnamese five-in-a-row variant — like Gomoku but with a "blocked" rule
> that closes the standard first-player win.

| Field | Value |
|-------|-------|
| Also known as | Caro, Vietnamese five-in-a-row, "5-in-a-row" |
| Players | 2 |
| Type | Partisan k-in-a-row game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large (Go-sized boards) |
| Game-tree complexity | Large |
| **Playable** | caro |

## Description

Caro is the Vietnamese form of five-in-a-row. It differs from
[Gomoku](gomoku.md) in one key respect: a five-in-a-row is **not a win if it is
blocked at both ends** by opposing stones. This single rule neutralises many of
Gomoku's standard "double threat" forcing sequences and gives Caro a more
defensive flavour.

## Rules

1. A Go-style board (commonly 15×15 or 19×19), initially empty.
2. Players alternate placing one stone of their colour on any empty
   intersection.
3. The first player to form an **uninterrupted line** of five or more stones
   horizontally, vertically, or diagonally — **with at least one end of the
   line not blocked by an opposing stone** — wins.
4. If the board fills with no such line, the game is a draw (very rare).

## Solution status

Caro is **not solved**. The "blocked-at-both-ends doesn't count" rule
substantially weakens Gomoku's first-player advantage, but a formal value (and
proof) is not published. Engines and competitive play exist and there is
practical consensus that the first player is favoured but not decisively so.

## Consensus on optimal play

- **Build unblocked fours and threes** — because a five-in-a-row blocked at both ends does not win, always orient your attack so that at least one end of your forming line is open; a "four with two open ends" (live four) is the most dangerous threat.
- **Create double-open-three threats** — simultaneously threatening two different lines of three stones, each with both ends open (so both will become winning live fours), forces the opponent to defend both at once and is usually decisive.
- **Block opponent threes at the earliest open end** — blocking a live three at one end converts it to a half-blocked three, severely reducing its threat value; waiting until it becomes a four is too late.
- **Centre play opens the most attack lines** — central stones sit on more diagonals, horizontals, and verticals than edge stones; early central placement gives more directions from which to form a live five.
- **Unlike Gomoku, direct first-player forcing wins are rarer** — the blocked rule prevents many classic Gomoku sequences; Caro rewards patient positional build-up over sharp tactical sequences, and second-player defensive resources are stronger.

## Engines & current best play

- **Strongest known program(s):** Various Gomoku/five-in-a-row engines adapted for Caro rules (e.g., Yixin with Caro rule support); no single canonical public engine is prominently documented for Caro specifically.
- **Strength:** Super-human for well-tuned engines; Vietnamese competitive community plays at high human level.
- **Where the proof / tablebase lives (if solved):** — (unsolved)
- **Notes:** Caro's blocked rule makes it significantly harder than Gomoku to solve; it has a large competitive following in Vietnam and online but limited academic-solving attention.

## Complexity

Large — comparable to or harder than Gomoku because the blocked rule prevents
many cheap forcing wins, increasing search depth.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Gomoku) ([archive](http://web.archive.org/web/20260506025335/https://en.wikipedia.org/wiki/Gomoku))
- [Allis, van den Herik & Huntjens (1996). *Go-Moku Solved by New Search Techniques*.](../references.md#allis-gomoku1996) (related)

## See also

- [Gomoku](gomoku.md) · [Renju](renju.md) · [Pente](pente.md) · [Ninuki-renju](ninuki-renju.md)
- Lexicon: [first-player advantage](../lexicon/README.md#first-player-advantage)
