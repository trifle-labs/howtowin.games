# Mastermind

> A code-breaking game with colored pegs. The codebreaker can always win in 5 guesses or fewer.

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
| **Playable** | mastermind |

## Description

The codemaker secretly chooses a code of 4 pegs, each one of 6 colors (repeats allowed). The codebreaker makes guesses. After each guess, the codemaker reports how many pegs are the right color in the right position ("black" pegs) and how many are the right color in the wrong position ("white" pegs). The codebreaker tries to identify the code in as few guesses as possible.

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

- **Start with 1122** — Knuth's optimal first guess is 1122 (two distinct colors, each appearing twice). This guess gives the most information in the worst case and is the standard opening for the 5-guess strategy.
- **After each response, eliminate all codes that do not match the feedback** — maintain (mentally or on paper) the set of codes still possible. Your next guess should be chosen to minimize the size of the largest remaining group after the codemaker's response.
- **Pick the guess that minimizes the worst-case remaining codes** — at each step, for every candidate guess, calculate the worst-case number of possibilities that remain. Choose the guess with the smallest worst-case. This guarantees 5 guesses or fewer.
- **Your guess does not need to be a possible code** — a "non-code" guess (a pattern you already know is wrong) can still provide useful information. Do not restrict guesses to remaining possibilities if a non-code guess splits the remaining pool better.
- **Five guesses always work; four do not** — Knuth proved 5 is the worst-case minimum. No strategy can guarantee a win in 4 guesses or fewer for all codes in the standard 4-peg, 6-color game.
- **For minimum expected guesses (about 4.34), use a different strategy** — the worst-case and expected-case-optimal strategies differ. If you care about average performance rather than the worst case, use the expected-case table instead.

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
