# Ticket to Ride

> A board game where players collect train cards and claim railway routes. It is unsolved due to randomness in card draws.

| Field | Value |
|-------|-------|
| Also known as | Zug um Zug (German), Les Aventuriers du Rail (French) |
| Players | 2–5 |
| Type | Stochastic route-building card game |
| Perfect information | No (train card draw deck is hidden) |
| Chance element | Yes (random card draws, random ticket draws) |
| **Solution status** | Unsolved (no known solution framework for draw-dependent board games) |
| **Game-theoretic value** | Unknown |
| Year solved | — |
| Solved by | — |
| State-space complexity | Very large (cards × tickets × route combinations) |
| Game-tree complexity | Effectively infinite (stochastic draws × branching route choices) |

## Description

Ticket to Ride is a strategy board game designed by Alan R. Moon and published in 2004. Players collect colored train cards and claim railway routes on a map to connect cities shown on their destination tickets. On each turn, a player may draw two train cards, draw additional destination tickets, or claim a route by discarding matching colored cards. Shorter routes (1-3 segments) give modest points, while longer routes (4-6 segments) give much higher points. The game ends when a player's train pieces run low, and then each other player takes one final turn. The highest total score wins — points from routes plus completed ticket values minus any uncompleted ticket penalties, plus bonuses.

## Solution status

Ticket to Ride is **not solved** and is extremely unlikely to be solvable in
any formal sense. It combines **stochastic elements** (train card draws,
destination ticket draws), **hidden information** (opponents' cards and
tickets), and a **large branching factor** (many possible routes on each turn),
placing it well beyond known solving frameworks. Even simplified single-map
analysis is computationally prohibitive. What exists instead is strong
**heuristic play** guided by expert and engine analysis.

## Consensus on optimal play

- **Claim long routes early** — longer routes (4+ segments) give more points per card and also block opponents from using those paths. Claiming a 6-length route early is almost always the right move.
- **Collect cards of just one or two colors** — focusing your draws on a small set of colors makes it more likely you can complete your tickets. Spreading across many colors leaves you short of every route.
- **Draw face-up cards when the color helps, draw blind when it does not** — face-up cards give you a certain color, while blind draws might give you locomotives (wild cards). Taking a face-up locomotive costs both of your draws.
- **Keep some flexibility in your ticket hand** — holding 3-4 destination tickets gives you backup options if one route gets blocked. Do not discard tickets to the point where only one path to victory remains.
- **Watch what the opponent builds to guess their tickets** — when an opponent claims an otherwise unusual route, they are probably connecting two cities on one of their tickets. Use that information to block them.
- **The 10-point longest-road bonus shapes the whole game** — plan a continuous chain across the board. Even if you do not win the bonus, a connected network is usually the most efficient way to complete your tickets.

## References

- Moon, Alan R. (2004). *Ticket to Ride*. Days of Wonder.
- [Spiel des Jahres 2004 winner](https://www.spiel-des-jahres.de/en/games/ticket-to-ride/)
- [Wikipedia — Ticket to Ride](https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game))
- [BGG entry — Ticket to Ride (2004)](https://boardgamegeek.com/boardgame/9209/ticket-ride)

## See also

- [Bridge](bridge.md) · [Poker (heads-up no-limit hold'em)](heads-up-nolimit-holdem.md)
- Lexicon: [chance element](../lexicon/README.md#chance-element) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
