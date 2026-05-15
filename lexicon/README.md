# Lexicon

The vocabulary of the study of solved games — combinatorial game theory,
game-solving techniques, and the language used to describe results. Game
entries link here by anchor (e.g. `../lexicon/README.md#zugzwang`).

Terms are grouped by theme. Within the archive, a **bold** term on first use in
an entry usually points back here.

---

## Solving and solution strength

### solved game
A game is *solved* when its game-theoretic outcome under perfect play is known.
Solving comes in three strengths ([Allis, 1994](../references.md#allis1994)):
*ultra-weakly*, *weakly*, and *strongly* solved (below). "Solved" without
qualification is ambiguous and best avoided.

### ultra-weakly solved
The [game-theoretic value](#game-theoretic-value) of the initial position is
known, but no strategy to achieve it is necessarily known. Often proved
non-constructively — e.g. [Hex](../games/hex.md) is an ultra-weak first-player
win by the [strategy-stealing argument](#strategy-stealing), which proves a
winning strategy *exists* without exhibiting one.

### weakly solved
A strategy is known that achieves the game-theoretic value from the *initial
position* against any opposition. The strategy need not handle arbitrary
positions. Most "Game X is solved" headlines (Connect Four, Checkers, Othello)
mean weakly solved.

### strongly solved
A strategy (typically a complete lookup table) is known that plays optimally
from *every* legal position, not just the start. [Awari](../games/awari.md) and
[Nim](../games/nim.md) are strongly solved.

### game-theoretic value
The outcome of a game from a given position assuming perfect play by both
sides: a first-player win, a second-player win, or a draw. By
[Zermelo's theorem](#zermelos-theorem) this value is well-defined for finite
perfect-information games without chance.

### Zermelo's theorem
In a finite two-player game of [perfect information](#perfect-information)
without chance, either one player has a forced win or both can force at least a
draw ([Zermelo, 1913](../references.md#zermelo1913)). It guarantees a
game-theoretic value exists — it does not tell you what that value is.

### solving vs. strong play
Solving establishes the *provable* outcome under perfect play. Strong play
(a top engine or human) may be empirically excellent without proving anything.
A game can have superhuman engines yet be unsolved (chess, Go), and a solved
game's optimal lines may be far too large for a human to memorise (checkers).

---

## Combinatorial game theory (CGT)

### combinatorial game theory
The mathematical theory of [perfect-information](#perfect-information) games
with no chance, usually two players moving alternately, where the last move
decides the result. Founded by [Conway (1976)](../references.md#conway1976) and
[Berlekamp, Conway & Guy](../references.md#bcg2001).

### impartial game
A game in which the moves available depend only on the position, not on whose
turn it is — both players have the same options. [Nim](../games/nim.md) is the
canonical example. Contrast [partisan game](#partisan-game).

### partisan game
A game in which the two players may have different moves available from the
same position — e.g. [Domineering](../games/domineering.md) (one player places
vertical tiles, the other horizontal) or chess.

### normal play convention
The rule that the player who *cannot* move *loses* (equivalently, the player
making the last move wins). The default in CGT.

<a id="misere-play"></a>
### misère play
The opposite convention: the player who makes the last move *loses*. Misère
games are usually far harder to analyse than their normal-play counterparts —
see [Misère Nim](../games/misere-nim.md) and [Notakto](../games/notakto.md).

<a id="sprague-grundy-theorem"></a>
### Sprague–Grundy theorem
Every [impartial game](#impartial-game) under the [normal play
convention](#normal-play-convention) is equivalent to a single
[Nim heap](#nim-value) of some size. That size is the position's
[Grundy value](#nim-value). Proved independently by
[Sprague (1935)](../references.md#sprague1935) and
[Grundy (1939)](../references.md#grundy1939).

### nim-value
Also *Grundy value* or *nimber*. The size of the Nim heap equivalent to an
impartial position, computed as the *mex* (minimum excludant) of the nim-values
of all positions reachable in one move. A position is a loss for the player to
move if and only if its nim-value is 0.

### nim-sum
The bitwise exclusive-OR (XOR) of heap sizes. In [Nim](../games/nim.md), a
position is a second-player win exactly when the nim-sum of all heaps is 0.
Nim-values of independent games add by nim-sum.

### mex
"Minimum excludant": the smallest non-negative integer not present in a set.
Used to compute [nim-values](#nim-value).

### octal game
A take-and-break impartial game (remove tokens from a heap, possibly splitting
it) encoded by an octal string. [Kayles](../games/kayles.md),
[Dawson's chess](../games/dawsons-chess.md), and many others are octal games;
[Guy & Smith (1956)](../references.md#guy-smith1956) tabulated their
[nim-values](#nim-value).

### surreal number
The number system Conway built from games; partisan game positions can have
values that are numbers, and CGT extends arithmetic to them. Relevant to
endgame analysis of [Hackenbush](../games/hackenbush.md) and
[Domineering](../games/domineering.md).

<a id="temperature--hot-game"></a>
### temperature / hot game
A game is *hot* when both players are eager to move in it (moving gains value).
*Temperature* measures that urgency; *cooling* and *thermography* are tools for
analysing sums of hot games, notably in [Dots and
Boxes](../games/dots-and-boxes.md) and [Amazons](../games/amazons.md).

---

## Solving techniques

### minimax
The basic algorithm for perfect-information games: assume each player picks the
move best for themselves, and back the values up the game tree.

### alpha-beta pruning
An optimisation of minimax that skips branches provably irrelevant to the
result. With good move ordering it roughly square-roots the search effort.

### retrograde analysis
Solving *backwards* from terminal positions: label all won/lost/drawn end
positions, then repeatedly label any position all of whose successors are
labelled. The standard route to [strongly solving](#strongly-solved) a game and
to building [endgame tablebases](#endgame-tablebase). Used for
[Awari](../games/awari.md), [Nine Men's Morris](../games/nine-mens-morris.md),
and chess endgames ([Thompson, 1986](../references.md#thompson1986)).

### endgame tablebase
A precomputed database giving the [game-theoretic value](#game-theoretic-value)
(and often distance-to-mate) of every position with few pieces. Chess
tablebases are complete for ≤7 pieces
([Lomonosov, 2012](../references.md#lomonosov2012)).

### proof-number search
A best-first search that targets the most "proof-efficient" node, well suited
to proving game values with uneven branching. Introduced by [Allis, van der
Meulen & van den Herik (1994)](../references.md#allis-pns1994); central to many
weak solutions (Gomoku, Checkers, Fanorona, Breakthrough).

### opening book
A stored set of analysed opening lines. A [weak solution](#weakly-solved) can be
viewed as a perfect opening book that always steers toward the game's value.

### God's number
The maximum, over all positions, of the optimal solution length — the diameter
of the puzzle's state graph. For the [Rubik's Cube](../games/rubiks-cube.md) it
is 20; for the [15 puzzle](../games/fifteen-puzzle.md), 80.

---

## Complexity measures

### state-space complexity
The number of legal positions reachable from the initial position. An upper
bound on the size of a [strong solution](#strongly-solved).

### game-tree complexity
The number of leaf nodes in the smallest full-width search tree that solves the
initial position — roughly (branching factor)^(game length). The famous
~10^120 "Shannon number" for chess
([Shannon, 1950](../references.md#shannon1950)) is a game-tree estimate.

### perfect information
Every player knows the complete game state at all times — no hidden cards, no
simultaneous moves. Chess and Go have perfect information; poker and
Battleship do not.

<a id="pspace-complete--exptime-complete"></a>
### PSPACE-complete / EXPTIME-complete
Computational-complexity classifications for *generalised* (n×n) versions of
games. Generalized Geography is PSPACE-complete
([Schaefer, 1978](../references.md#schaefer1978)); generalized chess, Go, and
checkers are EXPTIME-complete. These results concern asymptotic hardness, not
the fixed-size standard games.

---

## Playing terms

### first-player advantage
The common (not universal) phenomenon that moving first is beneficial. Many
solved games are first-player wins (Connect Four, Gomoku, Hex, Qubic); some are
draws (checkers, Nine Men's Morris, Othello); a few favour the second player
(Sim, Hexapawn, Dōbutsu shōgi).

### zugzwang
A position in which any move worsens the mover's outcome — the obligation to
move is itself the disadvantage. Central to chess and checkers endgame theory.

### opposition
A specific [zugzwang](#zugzwang) relationship between kings in chess endgames;
more broadly, a parity/tempo concept in many endgames.

### strategy-stealing argument
A non-constructive proof that the second player cannot have a winning strategy:
if they did, the first player could "steal" it by making an arbitrary first
move and then following it, with the extra move never a handicap. Proves
first-player-cannot-lose for [Hex](../games/hex.md), [Y](../games/y.md),
[Chomp](../games/chomp.md), and others — without revealing the strategy.

### pairing strategy
A drawing or blocking strategy in which the defender pre-pairs the cells/threats
so that answering the opponent's move in its partner cell neutralises it. Used
to prove draws in many [k-in-a-row](../games/gomoku.md) and Maker-Breaker games.

### draw
A game-theoretic value in which neither player can force a win. Under
[normal play](#normal-play-convention) impartial games never draw; many
partisan board games (checkers, Othello, Nine Men's Morris) do.

### maker-breaker game
A game in which one player ("Maker") tries to claim a winning set and the other
("Breaker") only tries to prevent it — Breaker has no winning sets of their own.
A common reformulation that simplifies analysis of k-in-a-row games.

---

## Chance and imperfect-information games

### chance element
A rule-level source of randomness — dice, a shuffled deck, a drawn tile. Games
with a chance element fall outside [Zermelo's theorem](#zermelos-theorem): they
have no win/draw/loss [game-theoretic value](#game-theoretic-value), only
*expected* outcomes. [Backgammon](../games/backgammon.md),
[Yahtzee](../games/yahtzee.md) and
[EinStein würfelt nicht!](../games/einstein-wurfelt-nicht.md) have a chance
element but no hidden information.

### zero-sum game
A game in which one player's gain exactly equals the others' loss — there are no
outcomes that are jointly good or jointly bad. Almost every game in this archive
is zero-sum; the term matters mainly because the [minimax](#minimax) /
[Nash-equilibrium](#nash-equilibrium) theory is cleanest in the two-player
zero-sum case.

### Nash equilibrium
A strategy profile in which no player can do better by unilaterally changing
strategy. For finite two-player [zero-sum games](#zero-sum-game) a Nash
equilibrium always exists (von Neumann's minimax theorem) and its value is *the*
value of the game — but it may require a **mixed strategy** (randomising), as in
[rock-paper-scissors](../games/rock-paper-scissors.md). "Solving" an
imperfect-information game such as [heads-up limit hold'em](../games/heads-up-limit-holdem.md)
means computing (an approximation of) a Nash equilibrium rather than a
win/draw/loss value.

### hunt game
A class of asymmetric two-player games in which one side commands many weak
pieces (e.g. hounds, geese) trying to corner or stalemate the other's single
strong piece (the fox, the hare). Classical examples include
[Fox and Geese](../games/fox-and-geese.md), [Halatafl](../games/halatafl.md)
and [Catch the Hare](../games/catch-the-hare.md). Hunt games are typically
small enough to be exhaustively solved on their canonical boards.

### imperfect information
A game in which at least one player lacks complete knowledge of the game state
— private cards, hidden bids, hidden mine positions, etc. "Solving" an
imperfect-information game generally means finding a [Nash
equilibrium](#nash-equilibrium) of a sequential game (often via
[CFR](#) or its variants), not a single-line win/draw/loss value.
[Bridge](../games/bridge.md), [Hanabi](../games/hanabi.md),
[Skat](../games/skat.md), and [heads-up hold'em](../games/heads-up-limit-holdem.md)
are core examples.

### NP-completeness
Complexity class of problems for which a candidate solution can be verified in
polynomial time and to which every other NP problem reduces. In games this
arises mostly for puzzle decision problems — *given this instance, is there a
solution?* — including [Sudoku](../games/sudoku.md),
[Minesweeper](../games/minesweeper.md), [Slitherlink](../games/slitherlink.md),
[Hashiwokakero](../games/hashiwokakero.md), and [Nonograms](../games/nonograms.md).

### PSPACE
The class of problems solvable using polynomial space. Many two-player
perfect-information games of unbounded depth are PSPACE-complete or harder —
see [PSPACE-complete / EXPTIME-complete](#pspace-complete--exptime-complete).
Sliding-block puzzles ([Sokoban](../games/sokoban.md),
[Rush Hour](../games/rush-hour.md), [Klotski](../games/klotski.md)) are
canonical PSPACE-complete examples.

### strategy stealing
An alias for the [strategy-stealing argument](#strategy-stealing-argument)
— in games where an extra move cannot hurt, the first player must have at
least a draw (otherwise the second player could "steal" the would-be winning
strategy).
