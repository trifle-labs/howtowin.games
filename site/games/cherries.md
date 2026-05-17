# Cherries

> A small partisan game on coloured stones — illustrates how a tiny rule
> change yields switches and infinitesimals.

| Field | Value |
|-------|-------|
| Also known as | Cherries |
| Players | 2 |
| Type | Partisan combinatorial game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Partially analysed (specific positions have known CGT values) |
| **Game-theoretic value** | Position-dependent |
| Year solved | — |
| Solved by | — |
| State-space complexity | Small per position |
| Game-tree complexity | Small |
| **Playable** | cherries |

## Description

Cherries is one of several small partisan games developed in the CGT teaching
tradition: a row of "cherries" coloured for Left or Right, with simple removal
rules. Its purpose is to give a hands-on example of partisan value computation
without the combinatorial weight of full board games.

## Rules

1. A row (or set) of cherries, each coloured blue (Left) or red (Right). Specific
   variants attach cherries in pairs or singletons. **[verify]** the canonical
   rule set, which differs slightly between sources.
2. **Left** moves: remove a blue cherry (and possibly its attached partner,
   depending on the variant).
3. **Right** moves: remove a red cherry similarly.
4. The player unable to move loses (normal play).

## Solution status

Partial. Specific Cherry positions have published CGT values, and the game is
used to illustrate **mean value** and **temperature** in introductory CGT
material. A comprehensive theory for arbitrary configurations exists only via
direct recursive evaluation; we treat the game as partial pending a canonical
rule set. **[verify]**

## Consensus on optimal play

- **Compute the CGT value of each isolated component first** — Cherries typically decomposes into independent sub-games (individual cherry pairs or singletons); compute the game value of each component separately, then sum them to find the overall value.
- **Play the hottest component first** — in CGT terms the "temperature" of a component measures how much it is worth to move there next; always play in the highest-temperature component to maximise your advantage per move.
- **A position with value > 0 is a Left (first player) win; < 0 a Right win; = 0 a second-player win** — reading the computed CGT sum directly gives the winner under optimal play; no heuristic reasoning is needed once the values are known.
- **Use mean-value estimates to guide play when exact temperatures are complex** — the mean value of a game tells you roughly what each player will score from a position; comparing means across components identifies where your moves have the biggest impact.
- **Cherries is a teaching example, not a competitive game** — its primary purpose is to illustrate partisan CGT concepts (switches, infinitesimals, temperature); in practice you compute the value analytically rather than searching a game tree.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine known to the cataloguer. CGT values for specific positions are computed analytically (by hand or symbolic CGT tools).
- **Strength:** Exact solutions for any specific position are achievable via direct CGT analysis; no game-playing engine is needed or meaningful.
- **Notes:** Cherries is primarily a pedagogical vehicle for Berlekamp-Conway-Guy combinatorial game theory; optimal play for any well-defined configuration follows directly from the CGT value computation.

## Complexity

Small.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Cherries_(game))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Toppling Dominoes](toppling-dominoes.md) · [Toads and Frogs](toads-and-frogs.md) · [Domineering](domineering.md)
- Lexicon: [temperature / hot game](../lexicon/README.md#temperature--hot-game) · [partisan game](../lexicon/README.md#partisan-game)
