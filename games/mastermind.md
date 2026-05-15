# Mastermind

> The code-breaking pegboard game — solved: the codebreaker can always win, and
> the worst-case optimal guess count is known exactly.

| Field | Value |
|-------|-------|
| Also known as | Mastermind, Bulls and Cows (related) |
| Players | 2 (asymmetric: codemaker vs. codebreaker) |
| Type | Deductive code-breaking game (one-sided hidden information) |
| Perfect information | No (the code is hidden) |
| Chance element | No |
| **Solution status** | Weakly solved (standard 4-peg, 6-colour game) |
| **Game-theoretic value** | Codebreaker wins; ≤5 guesses suffice (worst case) |
| Year solved | 1977 (Knuth); worst-case optima refined later |
| Solved by | Donald Knuth (5-guess strategy); later authors (expected-case optima) |
| State-space complexity | 6^4 = 1,296 possible codes |
| Game-tree complexity | Small |

## Description

The **codemaker** secretly chooses a code of 4 pegs, each one of 6 colours
(repeats allowed). The **codebreaker** makes guesses; after each, the codemaker
reports how many pegs are the right colour in the right position ("black" pegs)
and how many are the right colour in the wrong position ("white" pegs). The
codebreaker tries to identify the code in as few guesses as possible.

## Solution status

Mastermind is **weakly solved** for the standard 4-peg, 6-colour game.
[Knuth (1977)](../references.md#knuth1977) gave a strategy — the "minimax"
guessing rule, which always picks a guess minimising the worst-case number of
remaining possibilities — that **guarantees a solve within 5 guesses**, and
showed 5 is necessary in the worst case. Later authors computed the strategy
minimising the *expected* number of guesses (about 4.34 guesses), and exhaustive
search over all 1,296 codes confirms these optima. Because the codebreaker can
always force a win within the bound, the game is solved in the codebreaker's
favour.

## Consensus on optimal play

- **Start with 1122** — Knuth's optimal first guess is 1122 (two distinct colours, each appearing twice); this guess maximises the worst-case information gain and is the standard opening for the 5-guess strategy.
- **After each response, eliminate all codes inconsistent with the feedback** — maintain (mentally or on paper) the set of codes still possible; your next guess should be chosen to minimise the size of the largest remaining group after the codemaker's response.
- **Minimax: pick the guess that minimises the worst-case remaining codes** — at each step, for every candidate guess, compute the worst-case number of possibilities that remain; choose the guess with the smallest worst-case; this guarantees ≤5 guesses.
- **Your guess need not itself be a possible code** — a "non-code" guess (a pattern you already know is wrong) can still provide useful information; don't restrict guesses to remaining possibilities if a non-code guess splits the remaining pool better.
- **Five guesses suffice; four do not always** — Knuth proved 5 is the worst-case minimum; no strategy can guarantee a win in ≤4 guesses for all codes in the standard 4-peg, 6-colour game.
- **For minimum expected guesses (~4.34), use a different strategy** — the minimax (worst-case) and expected-case-optimal strategies differ; if you care about average performance rather than the worst case, use the expected-case lookup table instead.

## Engines & current best play

- **Strongest known program(s):** Any minimax or expected-case solver over the 1,296-code space; Knuth's 1977 algorithm is directly implementable and runs instantly.
- **Strength:** Perfect; the worst-case-optimal strategy (≤5 guesses) and expected-case-optimal strategy (~4.34 guesses) are both fully computed.
- **Where the proof / tablebase lives (if solved):** [Knuth (1977)](../references.md#knuth1977); complete strategy tables in subsequent exhaustive analyses.
- **Notes:** Only 1,296 possible codes; exhaustive search is trivial — the puzzle's interest is algorithmic and mathematical, not computational.

## Complexity

Only 1,296 possible codes, so the entire game is exhaustively searchable; the
"difficulty" is purely the elegance of the minimax argument, not computational
scale.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Mastermind_(board_game)) ([archive](http://web.archive.org/web/20260511072108/https://en.wikipedia.org/wiki/Mastermind_(board_game)))
- [Knuth (1977). *The Computer as Master Mind*.](../references.md#knuth1977)

## See also

- [Battleship](battleship.md) · [Liar's dice](liars-dice.md)
- Lexicon: [weakly solved](../lexicon/README.md#weakly-solved) · [minimax](../lexicon/README.md#minimax)
