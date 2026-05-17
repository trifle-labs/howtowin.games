# Ticket to Ride

> The modern railway-route board game — unsolved due to card randomness and mapping complexity.

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

Ticket to Ride is a turn-based strategy railway game designed by Alan R. Moon
and published by Days of Wonder in 2004. Players collect coloured train-car
cards and claim routes on a map to connect cities shown on their destination
tickets. On each turn, a player may draw two train cards, draw additional
destination tickets, or claim a route by discarding matching coloured cards.
Shorter routes (1–3 segments) score modestly; longer routes (4–6 segments)
score disproportionately higher. The game ends when a player's train pieces
run low, after which all other players take one final turn. The highest total
score — route points plus completed-ticket values minus uncompleted-ticket
penalties, plus bonuses — wins.

## Solution status

Ticket to Ride is **not solved** and is extremely unlikely to be solvable in
any formal sense. It combines **stochastic elements** (train card draws,
destination ticket draws), **hidden information** (opponents' cards and
tickets), and a **large branching factor** (many possible routes on each turn),
placing it well beyond known solving frameworks. Even simplified single-map
analysis is computationally prohibitive. What exists instead is strong
**heuristic play** guided by expert and engine analysis.

## Consensus on optimal play

- **Claim long routes early** — longer routes (4+ segments) score more points
  per card and also block opponents from using those paths; claiming a 6-length
  route early is almost always correct.
- **Collect cards of one or two colours** — focusing your draw on a small
  palette increases the probability of completing your tickets; spreading across
  many colours leaves you short of every route.
- **Draw face-up cards when the colour helps, draw blind when it doesn't** —
  face-up cards give colour certainty, but blind draws offer a chance at
  locomotives (wilds). Snapping a face-up locomotive costs your second draw.
- **Keep some flexibility in your ticket hand** — holding 3–4 destination
  tickets gives fallback options if one route is blocked; don't discard tickets
  to the point where only one path to victory remains.
- **Watch opponents' builds to infer their tickets** — when an opponent claims
  an otherwise-odd route, they are almost certainly connecting two cities on
  one of their tickets; use that information to block them.
- **The 10-point longest-road bonus shapes the whole game** — plan a continuous
  chain across the board; even if you don't win the bonus, a connected network
  is usually the most efficient way to complete tickets.

## References

- Moon, Alan R. (2004). *Ticket to Ride*. Days of Wonder.
- [Spiel des Jahres 2004 winner](https://www.spiel-des-jahres.de/en/games/ticket-to-ride/)
- [Wikipedia — Ticket to Ride](https://en.wikipedia.org/wiki/Ticket_to_Ride_(board_game))
- [BGG entry — Ticket to Ride (2004)](https://boardgamegeek.com/boardgame/9209/ticket-ride)

## See also

- [Bridge](bridge.md) · [Poker (heads-up no-limit hold'em)](heads-up-nolimit-holdem.md)
- Lexicon: [chance element](../lexicon/README.md#chance-element) · [solving vs. strong play](../lexicon/README.md#solving-vs-strong-play)
