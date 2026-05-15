# m,n,k-games

> The general family of "tic-tac-toe on an m × n board with k-in-a-row to
> win" — partially classified, with a Hales–Jewett-style monotone structure.

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

## Description

The unified theory of "tic-tac-toe family" games. An m,n,k-game is played on an
m × n grid; the goal is to be the first player to form an unbroken line of k
of your marks in any straight direction.

## Rules

1. Board: m × n grid, empty initially.
2. Players alternate placing one of their marks (X or O) on any empty cell.
3. The first player to **align k of their marks** in a single horizontal,
   vertical, or diagonal line wins.
4. If the board fills with no winning line, the game is a draw.

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

- **The second player can never win** — strategy-stealing proves this universally; only first-player wins or draws occur; if you are second player, aim for a draw.
- **For k ≥ 8, any board is a draw** — pairing/strategy arguments prove no m,n,k-game with k ≥ 8 is a first-player win regardless of board size; if the winning-line length is 8 or more, the first player cannot force a win.
- **For small k (k = 3, 4, 5) on large boards, threat-tree attacks win for first player** — the first player builds double open-k−1 threats (two simultaneous nearly-complete lines); forcing sequences that create unblockable forks are the winning mechanism.
- **Centre cells dominate for small boards** — cells that lie on the most k-length winning lines should be taken first; in (3,3,3) the centre is on 4 lines, corners on 2, edges on 2; in larger boards, central cells are similarly privileged.
- **Pairing strategies give drawing algorithms** — for draw-valued games, a pairing argument assigns each cell a unique "partner"; whenever first player plays in a cell, second player responds in the partner; this ensures first player never completes a line.
- **For specific cases, threat-space search gives exact results** — the Allis (1993/1996) technique for Gomoku applies to any m,n,k-game: chain compulsory threat sequences to prove a first-player win.

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
