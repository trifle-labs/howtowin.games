# Bao

> A four-row East African mancala game of legendary depth and complexity. Unsolved.

| Field | Value |
|-------|-------|
| Also known as | Bao la Kiswahili |
| Players | 2 |
| Type | Partisan sowing (mancala) game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Unsolved |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Large — far beyond two-row mancalas |
| Game-tree complexity | Large |
| **Playable** | bao |

## Description

Bao is played on **four** rows of eight pits (two rows per player), plus an
extra private store pit called the *nyumba* ("the house"). It has a complex set
of rules: a special opening phase called "namua" where reserve seeds are brought
into play one per turn, multi-lap sowing (a move can go around the board many
times), captures that feed seeds back into your own rows, and choices of sowing
direction. It is widely seen as the most strategically deep of all mancala
games.

## Solution status

Bao is **unsolved**. Its four-row board, multi-lap sowing (a single move can
cascade around the board many times), and the two-phase structure with reserve
seeds give it a state space and branching factor far beyond the two-row
mancalas. Where [Awari](awari.md) was strongly solved by enumerating ~10^12
positions, Bao's complexity has kept it out of reach; it has a competitive
human community and some playing programs, but no game-theoretic value has been
established and even strong computer play is comparatively undeveloped.

## Consensus on optimal play

- **Protect your nyumba (home pit) during the opening namua phase** — the nyumba collects seeds during the opening. A well-protected nyumba gives you a powerful resource later, while an exposed one lets the opponent capture your seeds.
- **Control the inner pits of your front row** — the two middle pits of your front row are where captures happen. Keeping seeds in these pits gives you more capture chances, while denying the opponent access to them limits their attacks.
- **Start multi-lap chains that end opposite enemy pits** — the power of Bao comes from relay sowing. A move that bounces through several pits and ends across from a loaded enemy pit can clear a big chunk of their row in one turn.
- **Where you enter during namua matters** — during the namua (reserve) phase, the pit where you place your seed determines what relay chain follows. Experienced players choose the entry pit to create immediate captures, not just passive placement.
- **Keep seeds stored in your back row** — back-row seeds are hard for the opponent to capture. Building up a reserve there lets you keep attacking from the front row even after your front pits are empty.
- **Choosing your direction is a major weapon** — at key moments when you can choose which direction to sow, picking the direction that keeps the relay going (instead of ending it in a dead end) is the most important high-level skill.

## Engines & current best play

- **Strongest known program(s):** No widely-available dedicated Bao engine known to the cataloguer. Playable in general-purpose abstract-game frameworks (e.g., [Ludii](https://ludii.games/)).
- **Strength:** Not benchmarked publicly.
- **Notes:** Bao has a strong human competitive tradition in East Africa (particularly Tanzania and Kenya); computational analysis lags far behind the human game's depth, and no game-theoretic value has been established.

## Complexity

Not well quantified in the solving literature, but clearly orders of magnitude
beyond Awari/Kalah owing to four rows and multi-lap sowing.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Bao_(game)) ([archive](http://web.archive.org/web/20260210162711/https://en.wikipedia.org/wiki/Bao_(game)))
- [van den Herik, Uiterwijk & van Rijswijck (2002). *Games solved: Now and in the future*.](../references.md#vandenherik2002) (general framework)

## See also

- [Awari (Oware)](awari.md) · [Kalah](kalah.md)
- Lexicon: [state-space complexity](../lexicon/README.md#state-space-complexity)
