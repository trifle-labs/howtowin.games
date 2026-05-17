# Cherries

> A small teaching game with colored stones. Shows how small rule changes create interesting math results.

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

Cherries is a small teaching game used to explain combinatorial game theory. It
has a row of "cherries" colored for one player or the other, with simple rules
for removing them. Its purpose is to give a hands-on example of game value
calculation without the complexity of full board games.

## Rules

1. A row (or group) of cherries, each colored blue (one player) or red (the other). In some versions, cherries are attached in pairs or are alone.
2. **One player** can remove a blue cherry (and possibly its attached partner, depending on the version).
3. **The other player** can remove a red cherry the same way.
4. The player who cannot move loses (normal play).

## Solution status

Partial. Specific Cherry positions have published CGT values, and the game is
used to illustrate **mean value** and **temperature** in introductory CGT
material. A comprehensive theory for arbitrary configurations exists only via
direct recursive evaluation; we treat the game as partial pending a canonical
rule set. **[verify]**

## Consensus on optimal play

- **Work out the value of each separate part first** — Cherries usually splits into independent sub-games (each cherry pair or single cherry). Figure out the game value of each part separately, then add them up to get the overall value.
- **Play the "hottest" component first** — the "temperature" of a part tells you how much you gain by making a move there. Always play in the highest-temperature part to get the most advantage per move.
- **Positive value means one player wins, negative means the other wins, zero means the second player wins** — once you have the total game value, you know the winner directly. No guesswork needed.
- **Use average values when exact numbers are too complex** — the average value of a game tells you roughly what each player will get from that position. Comparing averages across parts shows you where your moves have the biggest impact.
- **Cherries is a teaching game, not a competitive one** — its purpose is to illustrate math concepts (switches, tiny values, temperature). You solve it by calculating values, not by searching through moves.

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
