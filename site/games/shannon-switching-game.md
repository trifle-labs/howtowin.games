# Shannon switching game

> An abstract game played on a network of points. Completely solved by mathematics — the winner is decided by the structure of the network before the game even starts.

| Field | Value |
|-------|-------|
| Also known as | The switching game |
| Players | 2 (asymmetric roles: "Short" and "Cut") |
| Type | Partisan connection game on a graph |
| Perfect information | Yes |
| Chance element | No |
| **Solution status** | Strongly solved |
| **Game-theoretic value** | Determined by the graph: Short wins, Cut wins, or it depends on who moves first |
| Year solved | 1964 |
| Solved by | Alfred Lehman |
| State-space complexity | Depends on the graph |
| Game-tree complexity | Depends on the graph |
| **Playable** | shannon-switching-game |

## Description

Played on a graph (a network of points connected by lines) with two special points, A and B. One player, **Short**, claims lines; the other, **Cut**, deletes lines. Short wins by claiming a path of lines that connects A to B. Cut wins by deleting enough lines so that no such path can exist. (Bridg-it is a special version where the network is a grid.)

## Solution status

The Shannon switching game is **strongly solved** by
[Lehman (1964)](../references.md#lehman1964), who gave a complete
characterisation in terms of **matroids / spanning trees**:

- **Short wins as second player** (i.e. whoever the graph favours, regardless of
  who moves) if and only if the graph contains **two edge-disjoint trees** each
  connecting A and B — equivalently, the relevant matroid has the right
  structure.
- **Cut wins as second player** if Short cannot even win going first.
- Otherwise the first player wins.

So the outcome is decided by a graph-theoretic property computable in
polynomial time, and an explicit optimal strategy follows from the two
edge-disjoint trees. This is one of the cleanest "completely solved by pure
mathematics" results in game theory.

## Consensus on optimal play

- **Check for two separate spanning trees between A and B** — before playing, check whether the graph contains two trees (branching networks) that each connect A to B and do not share any lines. If yes, Short wins even as second player.
- **Short: always protect at least one tree** — Short should always claim a line that "saves" one of their two target trees. Whenever Cut deletes a line from one tree, Short claims a line that fixes the other.
- **Cut: look for the bridge** — Cut wins by finding a single "bridge" line (one whose removal disconnects A from B) and deleting it. If no such bridge exists in the part Short has claimed, Cut must try to stop Short from completing any path.
- **The winner is decided before anyone moves** — the outcome depends purely on the graph's structure, which can be checked quickly. The real strategy is in the setup, not in the moves.
- **Bridg-it is the classic example** — the special case played on a grid (Bridg-it) is the most studied. Short wins as second player using a pairing strategy on the symmetric grid.

## Engines & current best play

- **Strongest known program(s):** No competitive engine needed — optimal play is determined by a polynomial-time matroid computation.
- **Strength:** Perfect play by any program that computes the two edge-disjoint spanning trees and executes the corresponding maintenance strategy.
- **Where the proof / tablebase lives (if solved):** [Lehman (1964)](../references.md#lehman1964); [Berlekamp, Conway & Guy (2001)](../references.md#bcg2001)
- **Notes:** One of the cleanest "solved by pure mathematics" results in combinatorial game theory; no search is needed.

## Complexity

The deciding condition and an optimal strategy are computable in polynomial time
in the size of the graph.

## References

- Rules: [Wikipedia](https://en.wikipedia.org/wiki/Shannon_switching_game) ([archive](http://web.archive.org/web/20260107194010/https://en.wikipedia.org/wiki/Shannon_switching_game))
- [Lehman, A. (1964). *A solution of the Shannon switching game*.](../references.md#lehman1964)
- [Berlekamp, Conway & Guy (2001). *Winning Ways for Your Mathematical Plays*.](../references.md#bcg2001)

## See also

- [Bridg-it](bridg-it.md) · [Hex](hex.md)
- Lexicon: [strongly solved](../lexicon/README.md#strongly-solved) · [pairing strategy](../lexicon/README.md#pairing-strategy)
