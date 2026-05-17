# Bao la Kujifunza

> A simpler version of Bao used for learning. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Bao for learners |
| Players | 2 |
| Type | Partisan mancala |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Smaller than full Bao |
| Game-tree complexity | Smaller than full Bao |

## Description

Bao la Kujifunza ("Bao for learning") is a simplified version of
[Bao](bao.md) used to teach the full game. It has the same 4×8 board but
leaves out the complicated "namua" reserve phase and the special "nyumba"
home-square rules. The result is a simpler relay-sowing capture game that
is easier to learn.

## Rules

1. The board has 4 rows of 8 pits (32 pits total). Each player controls the two rows closest to them.
2. All 64 seeds start spread evenly (usually 2 seeds per pit). There is no off-board reserve pile.
3. On your turn, you pick up all the seeds from one of your pits and sow them one by one counter-clockwise (within your two rows).
4. If the last seed lands in a pit that already has seeds, you pick up all the seeds from that pit and keep sowing (**relay sowing**). If it lands in an empty pit, your turn ends.
5. **Capture**: When the relay ends in a front-row pit and the enemy pit directly across from it (on the other side of the board) is not empty, you capture those seeds and sow them into your own back row starting from one end.
6. A player who cannot move loses.

## Solution status

Bao la Kujifunza is **not solved**. It is smaller than the full Bao game but
no game-theoretic value has been computed.

## Consensus on optimal play

- **Start relay chains from your front row** — relay sowing only captures if it ends in a front-row pit across from a non-empty enemy pit. Seeds in your back row set up future attacks but do not capture right away.
- **Go after enemy front-row pits that have lots of seeds** — look for enemy front-row pits with many seeds. Ending your relay there takes those seeds and puts them into your own back row.
- **Keep relay chains going as long as possible** — a relay that bounces through several pits in one turn is much more powerful than a simple drop. Always pick up when you land in a non-empty pit to keep the chain going.
- **Leave the opponent with thin or empty pits** — a player with no legal move loses. Emptying the opponent's front row takes away their capture options and pushes them toward not being able to move.
- **Save seeds in your back row** — back-row seeds are harder for the opponent to capture. Building up a seed reserve there gives you material for future relays even when your front row is empty.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked.
- **Notes:** Bao la Kujifunza is primarily a pedagogical stepping stone to full Bao; no dedicated computational analysis or competitive engine has been published.

## Complexity

Smaller than full Bao but still substantial.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Bao_(game)) ([archive](http://web.archive.org/web/20260210162711/https://en.wikipedia.org/wiki/Bao_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002)

## See also

- [Bao](bao.md) · [Awari](awari.md) · [Kalah](kalah.md) · [Toguz Kumalak](toguz-kumalak.md)
- Lexicon: [partisan game](../lexicon/README.md#partisan-game)
