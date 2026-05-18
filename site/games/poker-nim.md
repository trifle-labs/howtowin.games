# Poker Nim

> Like Nim, but you can also put tokens back. It still works out to be the same as ordinary Nim.

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
| **Playable** | poker-nim |

## Description

Poker Nim is a classic example of a game that seems tricky (you can put tokens back!) but actually works exactly like ordinary Nim. Each player has their own private stash of tokens they have removed. You can *add* tokens back to a pile from your stash, but the opponent can always undo this by immediately taking the same number back.

## Rules

1. Set up several piles of tokens, like in [Nim](nim.md). Each player has a private stash of tokens, starting with some set number.
2. On your turn, you can do one of these:
   - Take any number of tokens from one pile (a regular Nim move) and put them in your stash; **or**
   - Put any number of tokens from your stash back into a single pile.
3. The player who cannot move loses (normal play). Since the stash is finite, the game cannot go on forever.

## Solution status

Strongly solved by [Berlekamp, Conway & Guy](../references.md#bcg2001). The key
insight is the **reversibility argument**: if your opponent adds k tokens to a
heap, you can immediately remove k tokens from that heap, undoing the move at
the cost of one round; this keeps you in the winning P-positions of ordinary
Nim. Hence the game's P-positions and winning strategy are *exactly those of
Nim*: nim-sum equals 0 iff the position is a P-position.

## Consensus on optimal play

- **Play ordinary Nim** — calculate the XOR of all pile sizes and keep it at 0 after every move. The option to add from your stash does not change the winning strategy.
- **Undo any additions the opponent makes** — if the opponent adds k tokens to a pile, immediately remove exactly k tokens from that same pile. This cancels their move and keeps the XOR where you want it.
- **Adding tokens never helps** — putting tokens back into a pile is a move the opponent can always undo. It cannot help the player who makes it.
- **If you are second player and the XOR starts at 0, keep it there** — maintain it at 0; the first player will inevitably break it and you can restore it.
- **The limited stash keeps the game finite** — tokens can only come from previous takes, so the game cannot cycle forever. The total number of tokens limits how long the game can last.

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
