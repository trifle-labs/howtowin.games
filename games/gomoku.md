# Gomoku

> Free-style five-in-a-row — weakly solved in 1993 as a first-player win.

| Field | Value |
|-------|-------|
| Also known as | Five in a Row, Gobang, Wuziqi, Omok |
| Players | 2 |
| Type | Partisan positional (k-in-a-row) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Weakly solved (free-style, 15×15) |
| **Game-theoretic value** | First-player win |
| Year solved | 1993 |
| Solved by | L. Victor Allis, H. Jaap van den Herik & M. P. H. Huntjens |
| State-space complexity | ~10^105 (15×15 board) |
| Game-tree complexity | ~10^70 |

## Description

Played on the intersections of a 15×15 board. Players alternately place a stone
of their colour; the winner is the first to make **five (or, in free-style,
five or more) in a row** — horizontally, vertically, or diagonally. "Free-style"
Gomoku imposes no restrictions on either player.

## Solution status

Free-style Gomoku on the standard 15×15 board is **weakly solved**.
[Allis, van den Herik & Huntjens (1996)](../references.md#allis-gomoku1996)
(workshop version 1993) proved it a **first-player win**, using
[proof-number search](../lexicon/README.md#proof-number-search) and
threat-space search — the latter a key innovation that exploits the way forcing
threats (open fours, double threats) chain together. The first player can force
a win against any defence.

The strong first-player advantage in free-style play is exactly why competitive
variants exist: [Renju](renju.md) adds restrictions on the first player, and
other rule sets (swap, swap2) re-balance the game. Allis's threat-space methods
remain foundational for solving k-in-a-row games.

## Consensus on optimal play

- **Play the centre first** — the exact centre of the 15×15 board connects to the most five-in-a-row lines; deviating from the centre as first player surrenders the strongest winning basis.
- **Build double threats** — a "double open four" (two directions each one stone from five) cannot both be blocked; creating such forks is the immediate goal of Black's winning strategy.
- **Respond to open threes immediately** — an unblocked open three becomes an open four on the opponent's next move, which then forces a block; respond before the forcing chain escalates.
- **Avoid clustering all stones on one diagonal** — spreading threats across horizontal, vertical, and both diagonals makes your position harder to address with a single response.
- **White must complicate and avoid open board** — White has no path to a forced win; the best defence creates a blocked, tactical fight where Black's forcing advantage is hardest to convert.
- **Threat-space search wins games** — strong players calculate sequences of "urgent" threat moves (open fours, forks) many steps ahead; a player who sees one more forcing move in the chain will prevail.

## Engines & current best play

- **Strongest known program(s):** Renju/Gomoku engines such as Yixin and Rapfi — Monte Carlo / threat-space hybrid engines used in online competition.
- **Strength:** Super-human; top engines find the forced winning lines that humans miss.
- **Where the proof / tablebase lives (if solved):** [Allis, van den Herik & Huntjens (1996)](../references.md#allis-gomoku1996) — proof of first-player win via threat-space search; no exhaustive tablebase.
- **Notes:** Competitive play uses swap or swap2 opening rules to neutralise the proven first-player advantage; free-style Gomoku is a formal first-player win.

## Complexity

State-space ~10^105, game-tree ~10^70
([van den Herik et al., 2002](../references.md#vandenherik2002)).

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Gomoku) ([archive](http://web.archive.org/web/20260506025335/https://en.wikipedia.org/wiki/Gomoku))
- [Allis, van den Herik & Huntjens (1996). *Go-Moku Solved by New Search Techniques*.](../references.md#allis-gomoku1996)
- [Allis, V. (1994). *Searching for Solutions in Games and Artificial Intelligence*.](../references.md#allis1994)

## See also

- [Renju](renju.md) · [Pente](pente.md) · [Connect6](connect6.md) · [Connect Four](connect-four.md) · [Qubic](qubic.md)
- Lexicon: [proof-number search](../lexicon/README.md#proof-number-search) · [weakly solved](../lexicon/README.md#weakly-solved)
