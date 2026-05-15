# Bao la Kujifunza

> Beginner's variant of Bao — a teaching mancala, unsolved.

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

Bao la Kujifunza ("Bao for learning") is the simplified variant of
[Bao](bao.md) used to teach the full game. It uses the same 4×8 board but
omits the complex "namua" reserve and the special "nyumba" home-square rules,
leaving a recognisably simpler relay-sow capture system.

## Rules

1. Board: 4×8, 32 pits. Each side controls the two rows closest to them.
2. All 64 seeds start distributed evenly (commonly 2 seeds per pit); there is
   no off-board reserve.
3. On a turn the player picks up all seeds from one of their pits and sows
   counterclockwise (within their two rows).
4. If the last seed lands in a non-empty pit, the player picks up its contents
   and continues sowing (**relay sowing**); if it lands in an empty pit, the
   turn ends.
5. **Capture**: when the relay ends in a front-row pit and the opposing
   front-row pit (across the board) is non-empty, the player captures those
   seeds and sows them into their own back row starting from a designated
   end.
6. A player who cannot move loses.

## Solution status

Bao la Kujifunza is **not solved**. It is smaller than the full Bao game but
no game-theoretic value has been computed.

## Consensus on optimal play

- **Initiate relay chains from your front row** — relay sowing only captures if it terminates in a front-row pit opposite a non-empty enemy pit; seeds in the back row set up future front-row attacks but do not threaten immediately.
- **Target loaded front-row pits** — look for opponent front-row pits with many seeds; terminating your relay there strips those seeds and sows them beneficially into your own back row.
- **Keep relay chains going** — a relay that continues through multiple pits in a single turn is much more powerful than a simple drop; pick up pits that land in non-empty squares to maximise the cascading effect.
- **Leave your opponent with thin or empty pits** — a player with no legal move loses; exhausting the opponent's front row denies them capture threats and moves them toward immobility.
- **Preserve seeds in your back row** — back-row seeds are harder for your opponent to capture; building a seed reserve in the back row gives you future relay material even when the front row is depleted.

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
