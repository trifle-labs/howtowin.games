# m,n,k-games

> A whole family of tic-tac-toe-like games on an m x n board where you need k in a row to win. Partially classified.

| Field | Value |
|-------|-------|
| Also known as | m,n,k-games, generalised tic-tac-toe |
| Players | 2 |
| Type | Partisan k-in-a-row games (family) |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly classified (theory) |
| **Game-theoretic value** | Draw or first-player win, depending on (m, n, k) |
| Year solved | classical |
| Solved by | Many — Hales, Jewett, Beck, Berlekamp/Conway/Guy |
| State-space complexity | (m·n)-dependent |
| Game-tree complexity | (m·n)-dependent |
| **Playable** | mnk-games |

## Description

This is the big-picture view of all "tic-tac-toe-like" games. In an m,n,k-game you play
on an m by n grid, and the goal is to be the first to get k of your marks in a
row — horizontally, vertically, or diagonally.

## Rules

1. Board: an m by n grid, all cells empty at the start.
2. Players take turns placing their marks (X or O) on any empty cell.
3. The first player to get **k of their marks in a row** — horizontally, vertically, or diagonally — wins.
4. If the board fills up and nobody has k in a row, the game is a draw.

## Solution status

Strongly classified:

- **Strategy-stealing** shows that the second player **cannot win** any
  m,n,k-game — only first-player win or draw are possible.
- **Tic-tac-toe (3,3,3)** is a draw — [classic](tic-tac-toe.md).
- **Gomoku (15,15,5)** is a first-player win
  ([Allis 1993/1996](../references.md#allis-gomoku1996)).
- **Qubic (4,4,4,4)** (the 4-D version) and **(4,4,4)** are first-player wins;
  see [Qubic](qubic.md).
- For **k ≥ 8**, no m,n,k-game is a first-player win for any m,n —
  ([Hales–Jewett type pairing argument, classical](../references.md#bcg2001)).
- For **k = 6** and **k = 7**, full classification is known for many m,n.

The general "for which (m, n, k) is the game a first-player win?" question is
nontrivial; see *Winning Ways* and Beck's *Combinatorial Games: Tic-Tac-Toe
Theory* for the comprehensive treatment.

## Consensus on optimal play

- **The second player can never win** — a famous proof called "strategy-stealing" shows this is always true. Only the first player can win, or the game is a draw. If you are second player, aim for a draw.
- **If you need 8 or more in a row, the game is a draw** — no matter how big the board, if you need 8 or more marks to win, the first player cannot force a win. The game will always be a draw with perfect play.
- **For small k (3, 4, 5) on large boards, the first player wins by building threats** — the first player creates two near-complete lines at once (a fork), so the opponent cannot block both.
- **Take the centre first on small boards** — cells that lie on the most possible winning lines are the most valuable. In 3x3 tic-tac-toe the centre covers 4 lines, corners cover 2, and edges cover 2. The same idea works for larger boards.
- **Pairing strategies force a draw** — for games that are draws, you can pair up each cell with a "partner." Whenever the first player marks a cell, the second player immediately marks its partner. This stops the first player from ever completing a line.
- **For specific cases, follow-the-threat works** — the same technique used to solve Gomoku (Allis, 1993/1996) applies to any m,n,k-game: chain together forced moves to prove the first player wins.

## Engines & current best play

- **Strongest known program(s):** Game-specific solvers for each (m,n,k) instance — threat-space search engines, retrograde analysis; no single universal engine for the whole family.
- **Strength:** Exact for settled cases (3,3,3), (15,15,5), (4,4,4), etc.; heuristic for borderline unsettled cases.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001); [Allis, van den Herik & Huntjens (1996)](../references.md#allis-gomoku1996); case-by-case literature.
- **Notes:** The complete classification of m,n,k-game values (for all m,n,k) remains an open problem in combinatorial game theory; individual instances are often solved but the general boundary between "draw" and "first-player win" is not fully characterised.

## Complexity

m,n,k-games on growing boards are PSPACE-hard in general — the value problem
generalises the standard hardness of generalised tic-tac-toe.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/M,n,k-game) ([archive](http://web.archive.org/web/20260307135720/https://en.wikipedia.org/wiki/M,n,k-game))
- [Allis, van den Herik & Huntjens (1996). *Go-Moku Solved by New Search Techniques*.](../references.md#allis-gomoku1996)
- [Patashnik (1980). *Qubic*.](../references.md#patashnik1980)
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways*.](../references.md#bcg2001)

## See also

- [Tic-tac-toe](tic-tac-toe.md) · [Gomoku](gomoku.md) · [Qubic](qubic.md) · [Connect Four](connect-four.md)
- Lexicon: [pairing strategy](../lexicon/README.md#pairing-strategy) · [strategy-stealing argument](../lexicon/README.md#strategy-stealing-argument)
