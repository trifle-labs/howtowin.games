# Klondike solitaire

> The default Windows card game — its exact win rate under perfect play is still
> unknown, though "thoughtful" Klondike has been estimated to be winnable ~82%
> of the time.

| Field | Value |
|-------|-------|
| Also known as | Klondike, Patience, "Solitaire" (the Windows game) |
| Players | 1 (puzzle / solitaire) |
| Type | Single-player stochastic card game |
| Perfect information | No (face-down cards) — see "thoughtful" variant |
| Chance element | Yes (shuffled deal) |
| **Solution status** | Partially solved (per-deal solvers exist; overall win rate estimated, not exact) |
| **Game-theoretic value** | N/A (solitaire) — fraction of solvable deals not known exactly |
| Year solved | 2009 (large-scale estimate) |
| Solved by | Bjarnason, Fern & Tadepalli (estimate for "thoughtful" Klondike) |
| State-space complexity | 52! deal space ≈ 8 × 10^67 |
| Game-tree complexity | Large per deal |

## Description

A standard 52-card deck is dealt into seven tableau piles (with face-down cards),
a stock, and four empty foundations. The player builds the foundations up by suit
from Ace to King, moving cards among the tableau in alternating colours. Standard
Klondike has **hidden information** (face-down tableau cards) and **chance** (the
shuffle), so it sits apart from the perfect-information games in this archive.

## Solution status

Klondike is **partially solved**. Two distinct questions matter:

- **"Thoughtful" Klondike** assumes the player knows the location of every card
  (perfect information). [Bjarnason, Fern & Tadepalli (2009)](../references.md#bjarnason-klondike2009)
  used Monte-Carlo planning to estimate that roughly **82%** of deals are
  winnable under thoughtful play — and individual deals can be settled exactly by
  a solver. This is an estimate with confidence bounds, not an exact enumeration.
- **Standard Klondike** (cards genuinely hidden) has no known optimal policy and
  a lower, not-exactly-known win rate; it is a game of imperfect information.

So: any *given* deal can be solved by computer, but the **overall** value — the
exact fraction of deals winnable — remains unknown, a situation sometimes called
"one of the embarrassments of applied mathematics."

## Consensus on optimal play

- **Expose face-down cards as the first priority** — uncovering buried face-down cards gives information and new options; always prefer a move that flips a new card over a move of equal apparent value that does not.
- **Delay sending cards to the foundation if they may be needed** — moving a card to the foundation is often irreversible in practice; a black 6 sent to the foundation cannot be used to unblock a red 5 later; only move foundations when it does not restrict future tableau moves.
- **Build tableau columns down in alternating colours** — this is mandatory, but strategically prefer keeping columns orderly so that longer ordered sequences can be moved as blocks.
- **Empty a short column to create a free space** — an empty tableau column is a temporary holding spot for a card or sequence; clearing the shortest pile first is usually faster.
- **When in doubt, play the move that gives the most options next turn** — in the hidden-information game, uncertainty about face-down cards means "maximise future options" is the best guide; avoid moves that commit the tableau to a dead-end arrangement.

## Engines & current best play

- **Strongest known program(s):** Various open-source Klondike solvers — exhaustive search or IDA* for "thoughtful" (fully-revealed) deals.
- **Strength:** Perfect for thoughtful Klondike (fully-revealed); strong heuristic play for standard hidden-information Klondike.
- **Where the proof / tablebase lives (if solved):** [Bjarnason, Fern & Tadepalli (2009)](../references.md#bjarnason-klondike2009) — ~82% win rate estimate for thoughtful Klondike.
- **Notes:** The exact fraction of winnable deals remains unknown; individual deals can be definitively solved or proved unsolvable by computer search.

## Complexity

The deal space is 52! ≈ 8 × 10^67; per-deal search trees are large but tractable
for modern solvers. The exact solvable fraction is the open quantity.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Klondike_(solitaire)) ([archive](http://web.archive.org/web/20260513195301/https://en.wikipedia.org/wiki/Klondike_(solitaire)))
- [Bjarnason, Fern & Tadepalli (2009). *Lower Bounding Klondike Solitaire with Monte-Carlo Planning*.](../references.md#bjarnason-klondike2009)

## See also

- [Yahtzee](yahtzee.md) · [Peg solitaire](pegs-solitaire.md)
- Lexicon: [perfect information](../lexicon/README.md#perfect-information) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
