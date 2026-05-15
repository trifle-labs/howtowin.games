# Poker Nim

> Nim with the added option to *replace* removed tokens — still equivalent to
> ordinary Nim by the Sprague–Grundy theory.

| Field | Value |
|-------|-------|
| Also known as | Poker Nim |
| Players | 2 |
| Type | Impartial loopy game |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Same as Nim: P-position iff nim-sum = 0 |
| Year solved | 1956 (treated in *Winning Ways*) |
| Solved by | Berlekamp, Conway, Guy |
| State-space complexity | Same as Nim (heaps + bounded reserves) |
| Game-tree complexity | Same as Nim |

## Description

Poker Nim is the classic example of a "loopy" impartial game that nevertheless
reduces cleanly to ordinary Nim. Each player has a private reserve of removed
tokens; the option to *add* tokens back is real but ultimately a "reversible"
move that the opponent can simply mirror.

## Rules

1. Set up several heaps of tokens, as in [Nim](nim.md). Each player has a
   private reserve, initially with some finite number of tokens.
2. On your turn, either:
   - Take any positive number of tokens from one heap (Nim move), placing them
     in your reserve; **or**
   - Add any positive number of tokens from your reserve back to a single heap.
3. The player who cannot move loses (normal play). Note that since the reserve
   is finite, the game cannot go on forever.

## Solution status

Strongly solved by [Berlekamp, Conway & Guy](../references.md#bcg2001). The key
insight is the **reversibility argument**: if your opponent adds k tokens to a
heap, you can immediately remove k tokens from that heap, undoing the move at
the cost of one round; this keeps you in the winning P-positions of ordinary
Nim. Hence the game's P-positions and winning strategy are *exactly those of
Nim*: nim-sum equals 0 iff the position is a P-position.

## Consensus on optimal play

- **Play ordinary Nim** — compute the nim-sum of all heap sizes and maintain it at 0 on every turn; the add-from-reserve option is irrelevant to the winning strategy.
- **Mirror your opponent's additions** — if your opponent adds k tokens to a heap, immediately remove exactly k tokens from that same heap; this undoes the move and keeps the nim-sum where it was.
- **Reserve-filling does not help** — adding tokens to a heap is a reversible move; in Combinatorial Game Theory reversible moves cannot help the player who makes them because the opponent can undo them.
- **Keep nim-sum at 0 as the second player** — if you are the second player and the initial nim-sum is 0, maintain it; the first player will inevitably break it and you restore it.
- **The finite reserve guarantees termination** — tokens in a reserve can be re-added only from previous takes, so the game cannot cycle indefinitely; the total token count bounds the game length.

## Engines & current best play

- **Strongest known program(s):** No game-specific engine needed — the Nim nim-sum formula solves it completely.
- **Strength:** Perfect play by any program implementing the nim-sum calculation and mirror-response rule.
- **Where the proof / tablebase lives (if solved):** [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** Poker Nim is primarily a pedagogical example illustrating that reversible moves cannot change a game's Grundy value.

## Complexity

Same as ordinary Nim — linear in the number of heaps.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Nim) ([archive](http://web.archive.org/web/20260513001624/https://en.wikipedia.org/wiki/Nim))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)
- [Bouton (1901–1902). *Nim, A Game with a Complete Mathematical Theory*.](../references.md#bouton1901)

## See also

- [Nim](nim.md) · [Misère Nim](misere-nim.md) · [Whim](whim.md)
- Lexicon: [nim-sum](../lexicon/README.md#nim-sum) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)
