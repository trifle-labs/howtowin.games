# Hive

> A game with no board, played with hexagonal insect tiles. The goal is to surround the opponent's queen bee.

| Field | Value |
|-------|-------|
| Also known as | Hive |
| Players | 2 |
| Type | Partisan boardless placement-and-movement game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large |
| Game-tree complexity | Large |
| **Playable** | hive |

## Description

Hive (John Yianni, 2001) is a 2-player abstract game played without a board: hexagonal insect tiles are placed and moved to surround the opposing queen. The lack of a board means the playing area expands as pieces are added to the "hive."

## Rules

1. No board: pieces are hexagonal tiles placed in a connected cluster.
2. Each player has 11 tiles: 1 Queen Bee, 2 Spiders, 2 Beetles, 3 Grasshoppers, 3 Soldier Ants (plus expansion pieces in extensions, not used here).
3. On each turn a player either places a new tile from their reserve next to a friendly tile (and not next to any opposing tile after the first move), or moves one tile already in play.
4. The Queen Bee must be placed by each player's fourth move.
5. Piece movement:
   - Queen: 1 step around the hive edge.
   - Spider: exactly 3 steps around the hive edge.
   - Beetle: 1 step, including the option of climbing on top of any stack, blocking the covered piece.
   - Grasshopper: leaps in a straight line over a continuous row of pieces, landing on the empty cell beyond.
   - Soldier Ant: any number of steps around the hive edge.
6. The "one-hive" rule: no move may disconnect the hive, and at no point during a slide may the moving tile lose contact with the hive.
7. A player wins when the opposing Queen Bee is completely surrounded by six tiles of either color.

## Solution status

Hive is **not solved**. Strong engines exist (Mzinga, Nokamute) but no
game-theoretic value is published.

## Consensus on optimal play

- **Place your queen early but not first** — delaying queen placement to the fourth move is the latest allowed. Placing it on move 2 or 3 is generally stronger than waiting, as it unlocks movement options. But never place it as the very first tile or it is immediately targetable.
- **Ants are the most mobile attackers** — soldier ants can reach any position on the hive perimeter in one move. Getting ants into attacking positions around the opponent's queen while keeping your own queen shielded is the main mid-game goal.
- **Beetles pin queens** — a beetle climbing onto the queen immobilizes it and begins surrounding it. Threatening a beetle pin forces the opponent to keep escape spaces open.
- **Grasshoppers threaten gaps** — a grasshopper can jump over a continuous line and land in a gap next to the queen. Keep at least one grasshopper ready for a queen-surrounding jump.
- **One-hive rule creates tactical constraints** — identify "pillars" (pieces whose removal would disconnect the hive). These pieces cannot move, which limits your options. Force the opponent into positions where their key pieces become pillars.
- **Surround your queen with your own pieces** — a queen surrounded by two of your own soldiers on her flanks is harder to completely surround. Keeping friendly blocking tiles next to your queen buys time while you attack.

## Engines & current best play

- **Strongest known program(s):** Mzinga and Nokamute — dedicated Hive engines using MCTS or alpha-beta search.
- **Strength:** Strong amateur; engines exceed casual human play but the gap is smaller than in solved games.
- **Where the proof / tablebase lives (if solved):** Not solved; no tablebase or published game-theoretic value.
- **Notes:** A small first-player advantage is suspected from engine self-play but not proven; opening theory for the base game is well developed in the competitive community.

## Complexity

Large.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Hive_(game)) ([archive](http://web.archive.org/web/20260421231217/https://en.wikipedia.org/wiki/Hive_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Hex](hex.md) · [Onyx](onyx.md) · [Cathedral](cathedral.md)
- Lexicon: [perfect information](../lexicon/README.md#perfect-information)
