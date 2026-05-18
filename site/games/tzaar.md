# TZAAR

> A GIPF-project game where each player has three types of pieces and can win by eliminating one of the opponent's piece types. It has not been solved.

| Field | Value |
|-------|-------|
| Also known as | TZAAR |
| Players | 2 |
| Type | Partisan capture game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | tzaar |

## Description

TZAAR (Kris Burm, 2007) is the sixth game in the GIPF project and is considered by many to be the deepest. Each player has three types of pieces: TZAARs, TZARRAs, and TOTTs. You must protect all three types from being eliminated while trying to eliminate one of the opponent's piece types.

## Rules

1. Board: a hexagonal grid of 30 cells, already filled at the start with all 30 pieces (15 per player: 6 TZAARs, 9 TZARRAs, and 15 TOTTs).
2. On each normal turn, a player makes two actions in order:
   1. Capture: move one of your stacks along a straight line of empty cells to a cell occupied by an opponent's stack of equal or smaller total height. Remove the opponent's stack and place yours on that cell.
   2. Either capture again (same rule) or stack one of your stacks onto one of your other stacks to combine them.
3. The first player's very first move is a single capture only (no second action).
4. A player loses if at the start of their turn they have zero pieces left of any one type (TZAAR, TZARRA, or TOTT), or if they cannot make a capture.

## Solution status

TZAAR is **not solved**. It is widely regarded by abstract-game enthusiasts as
one of the deepest two-player games of the past quarter-century, with strong
engines (including neural-network players) but no published solution.

## Consensus on optimal play

- **Never let any piece type drop to zero** — losing all of one type (TZAARs, TZARRAs, or TOTTs) is an instant loss, no matter how many other pieces you have. Protecting your rarest piece type is always your top priority.
- **Target the opponent's rarest piece type** — if the opponent has many TOTTs but only a few TZAARs, keep capturing their TZAARs. This attacks their loss condition more directly than going after their strongest pieces.
- **Stack pieces to make them invulnerable** — tall stacks can only be captured by stacks of equal or greater height. Stack your smallest or most-threatened piece type to protect it from capture.
- **Use your two actions to attack and consolidate** — a strong pattern is to capture an opponent piece with your first action, then stack two of your pieces together with your second action to build a tall defensive stack. This attacks the opponent while strengthening your own position.
- **Control the center of the hex board** — pieces in the center can attack in six different directions, while edge pieces have fewer options. Central stacks are both more threatening and harder to surround.
- **Count piece types before every turn** — the game can go from winning to losing in a single turn. Track each player's count of all three piece types to avoid surprises and spot the opponent's weaknesses.

## Engines & current best play

- **Strongest known program(s):** Neural-network-based and MCTS programs have been developed by the abstract-games community; no single well-known open-source engine dominates.
- **Strength:** Competitive with strong human club players; top engines likely exceed the best human performance.
- **Where the proof / tablebase lives (if solved):** —
- **Notes:** TZAAR succeeded ZERTZ in the GIPF project series and is widely considered the most tactically deep entry; the two-action turn structure creates exceptional combinatorial breadth per ply.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/TZAAR) ([archive](http://web.archive.org/web/20260113143313/https://en.wikipedia.org/wiki/TZAAR))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [GIPF](gipf.md) · [DVONN](dvonn.md) · [YINSH](yinsh.md) · [LYNGK](lyngk.md)
- Lexicon: [game-tree complexity](../lexicon/README.md#game-tree-complexity)
