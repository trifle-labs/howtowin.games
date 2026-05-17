# TZAAR

> The combat-focused GIPF-project game with three piece types — widely held
> to be the "deepest" abstract game of the family.

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

## Description

TZAAR (Kris Burm, 2007) is the sixth and arguably deepest GIPF-project game.
Each player has three types of pieces (TZAARs, TZARRAs, TOTTs) and must protect
*all three* types from being captured below a threshold while attacking the
opponent's pieces.

## Rules

1. Board: hexagonal grid of 30 cells, pre-filled at game start with all 30
   pieces (15 per player: 6 TZAARs, 9 TZARRAs, 15 TOTTs **[verify]** the exact
   counts).
2. On each turn (after the first), a player makes **two** actions in order:
   1. **Capture**: move one of your stacks along a straight line of empty
      cells to a cell occupied by an opposing stack of **equal or smaller
      total height**, removing the opposing stack and stacking yours on its
      cell.
   2. Either **capture again** (same rule) **or** **stack on a friendly
      piece** (move a stack onto a friendly stack to consolidate).
3. The first player's first move is a single capture only.
4. A player **loses** if at the start of their turn they have **zero pieces
   left of any one type** (TZAAR, TZARRA, or TOTT) — *or* if they cannot
   capture.

## Solution status

TZAAR is **not solved**. It is widely regarded by abstract-game enthusiasts as
one of the deepest two-player games of the past quarter-century, with strong
engines (including neural-network players) but no published solution.

## Consensus on optimal play

- **Never let any piece type drop to zero** — losing all TZAARs, TZARRAs, or TOTTs is an immediate loss regardless of total piece count; guarding your minority piece type is always the highest priority.
- **Target the opponent's rarest piece type** — if the opponent has many TOTTs but few TZAARs, relentlessly capture TZAARs; this exploits the loss condition more directly than capturing by strength.
- **Use stacking to make pieces invulnerable** — tall stacks can only be captured by equally or taller stacks; stack your smallest or most-threatened piece type to price it out of capture range.
- **Two actions per turn means you can both attack and consolidate** — a strong pattern is to capture an opponent piece on action 1 and then stack two friendly pieces on action 2 to grow a tall defensive stack; this simultaneously reduces the opponent and strengthens your position.
- **Control the central hexes** — pieces in the centre of the board can threaten in six straight lines, while edge pieces threaten in fewer; central stacks are both more threatening and harder to isolate.
- **Count piece-type totals before every turn** — the game can flip from winning to lost in a single turn; tracking each player's count of all three types prevents surprises and reveals the opponent's vulnerabilities.

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
