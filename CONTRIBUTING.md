# Contributing to `solved`

This archive aims to be **accurate and well-cited** above all else. It is
better to say "unsolved" or "the author is uncertain" than to repeat an
unverified claim.

## Principles

1. **Cite the primary source.** When stating that a game is solved, cite the
   paper, thesis, or technical report that established the result — not a
   secondary summary. Add the citation to [`references.md`](references.md) with
   a stable anchor and link to it from the game entry.
2. **Distinguish levels of solving.** Use the precise terms — *ultra-weakly*,
   *weakly*, *strongly* solved (see [README](README.md#what-solved-means)).
   "Solved" without qualification is ambiguous.
3. **Separate result from strategy.** The *game-theoretic value* (who wins) and
   the *consensus on optimal play* (do experts agree how to play it well) are
   different questions. An unsolved game can still have strong consensus on
   good play (e.g. heads-up no-limit hold'em); a solved game's optimal lines
   may still be too large for humans to follow (e.g. checkers).
4. **Flag uncertainty.** If a claim is folklore, contested, or unverified, say
   so in the entry.
5. **Use local links.** All cross-references between files use relative
   Markdown links so the archive works as a static site without a server.

## Adding a game

1. Copy [`games/_template.md`](games/_template.md) to `games/<slug>.md`.
2. Fill in every infobox field. Use `Unknown` or `N/A` rather than leaving
   blanks.
3. Add any new references to [`references.md`](references.md).
4. Add the game to the table in [`index.md`](index.md).
5. Add `See also` cross-links to related games and relevant
   [lexicon](lexicon/README.md) terms.

## Adding a lexicon term

1. Create `lexicon/<term-slug>.md`.
2. Add it to the table in [`lexicon/README.md`](lexicon/README.md).
3. Link to it from game entries where the term is used.

## Style

- One game or one term per file.
- Keep the infobox table fields consistent with the template.
- Prefer SI-style powers of ten for complexity figures (e.g. `~10^20`), and
  cite the source of any complexity estimate.
- Dates: use the year the result was *established* (often a conference/thesis
  date), noting the journal publication year separately if it differs.
