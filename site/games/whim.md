# Whim

> A version of Nim where each player may, once per game, switch the ending rule from normal to misere (last player to move loses instead of wins). It is fully solved.

| Field | Value |
|-------|-------|
| Also known as | Whim |
| Players | 2 |
| Type | Impartial game with a convention-switch |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | First-player win except on a sparse P-set |
| Year solved | 1996 (treatment in *Winning Ways*) |
| Solved by | Berlekamp, Conway, Guy |
| State-space complexity | Same as Nim plus two binary flags |
| Game-tree complexity | Same as Nim |
| **Playable** | whim |

## Description

Whim is like Nim, but each player has a special power they can use once per game: instead of removing tokens, they can switch the ending rule. Normally the player who takes the last token wins. After the switch, the player who takes the last token loses instead. This switch can be toggled back by the other player's whim move.

## Rules

1. Several piles of tokens, as in Nim.
2. On your turn, either:
   - Make an ordinary Nim move (remove any positive number of tokens from one pile); or
   - If you have not yet used your whim power, switch the ending rule. (Each player may do this at most once.)
3. Whichever ending rule is active when the last token is taken determines whether that player wins or loses.

## Solution status

Strongly solved by [Berlekamp, Conway & Guy](../references.md#bcg2001). Whim's
P-positions are essentially those of Nim, but with a careful endgame correction
when only heaps of size 1 remain — exactly the difference between Nim and
Misère Nim. The analysis adds two state flags (whether each player still has a
"whim" available) and proceeds by ordinary Grundy bookkeeping.

## Consensus on optimal play

- **Play ordinary Nim while piles are large** — when all piles have 2 or more tokens, the ending-switch power is not useful yet. Play standard Nim (aim to make the XOR of all pile sizes zero) and save your whim switch for the endgame.
- **Use your whim when piles become all 1s** — the critical moment comes when only piles of size 1 remain. At that point, the active ending rule decides the winner. Using your whim to switch to the favorable rule (or stopping the opponent from doing so) is the whole endgame.
- **Whoever uses their whim last in the all-1s endgame wins** — when only piles of 1 remain, the player who switches the ending rule last decides the final rule. The player with a whim move still available has the decisive move.
- **Do not waste your whim early** — using the switch while large piles remain is usually a waste. The opponent can just adapt their strategy to the new rule. Save your whim for when it matters most.
- **Keep track of both players' whim status** — there are four possible combinations (you have your whim or not, the opponent has theirs or not). Know which state you are in to apply the right strategy.

## Engines & current best play

- **Strongest known program(s):** No game-specific public engine; the strategy is an extension of standard Nim computed in the same O(n log n) time as the Sprague–Grundy XOR table.
- **Strength:** Perfectly solved; any correct implementation wins from all N-positions.
- **Where the proof / tablebase lives (if solved):** *Winning Ways* ([../references.md#bcg2001](../references.md#bcg2001)).
- **Notes:** Whim is included in *Winning Ways* as the canonical example of how a single rule-change token can be incorporated into Sprague–Grundy theory without abandoning the XOR framework.

## Complexity

Same as Nim — the whim flags add a factor of 4 to the state space.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Combinatorial_game_theory) ([archive](http://web.archive.org/web/20260508023449/https://en.wikipedia.org/wiki/Combinatorial_game_theory))
- [Berlekamp, Conway & Guy (2001–2004). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Nim](nim.md) · [Misère Nim](misere-nim.md) · [Poker Nim](poker-nim.md)
- Lexicon: [misère play](../lexicon/README.md#misere-play) · [Sprague–Grundy theorem](../lexicon/README.md#sprague-grundy-theorem)
