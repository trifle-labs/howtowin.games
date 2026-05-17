# Caro

> The Vietnamese version of five-in-a-row. Like Gomoku, but a five-in-a-row blocked at both ends does not count. Unsolved.

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

Caro is the Vietnamese version of five-in-a-row (like Gomoku). It differs in one
key way: a line of five stones **does not count as a win** if it has an
opponent's stone blocking it at both ends. This one rule stops many of the
forcing attacks that make Gomoku a first-player win, giving Caro a more
defensive style of play.

## Rules

1. Played on a Go-style board (usually 15×15 or 19×19), starting empty.
2. Players take turns placing one stone of their color on any empty intersection.
3. The first player to make a **continuous line** of five or more stones going across, up-down, or diagonally wins — **but only if at least one end of the line is not blocked by an opponent's stone**.
4. If the board fills up with no such line, the game is a draw (this is very rare).

## Solution status

Caro is **not solved**. The "blocked-at-both-ends doesn't count" rule
substantially weakens Gomoku's first-player advantage, but a formal value (and
proof) is not published. Engines and competitive play exist and there is
practical consensus that the first player is favoured but not decisively so.

## Consensus on optimal play

- **Build lines that are open at one end** — since a five-in-a-row blocked at both ends does not win, always attack so that at least one end of your forming line is open. A line of four stones with both ends open (a "live four") is the most dangerous threat.
- **Create two open-three threats at once** — threatening two different lines of three stones, each with both ends open, forces the opponent to defend both at the same time and is usually a winning move.
- **Block the opponent's threes early** — blocking a live three at one end makes it a half-blocked three, which is much less dangerous. Waiting until it becomes a four is too late.
- **Play in the center for more options** — central stones sit on more diagonals, horizontals, and verticals than edge stones. Playing in the center early gives you more directions to form a winning line.
- **Unlike Gomoku, the first player cannot force a win easily** — the blocked rule kills many classic Gomoku attacks. Caro rewards patient, positional play over sharp tactics, and the second player's defensive options are stronger.

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
