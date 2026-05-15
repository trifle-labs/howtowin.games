#!/usr/bin/env python3
"""Add rule-source Wikipedia citation to every game file's References section.

Reads _scripts/wiki-wayback.tsv (slug, wiki, wayback) and the merged
_scripts/wiki-wayback-merged.tsv if present, then for each game file in
games/*.md inserts a "- Rules: [Wikipedia](wiki) ([archive](wayback))" entry
into the References section. If a similar entry already exists it is skipped.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAMES = os.path.join(ROOT, "games")

# Prefer merged file (has SPN-saved URLs) then fall back to initial
def load_map():
    m = {}
    for fn in ("wiki-wayback-merged.tsv", "wiki-wayback.tsv"):
        p = os.path.join(ROOT, "_scripts", fn)
        if not os.path.exists(p):
            continue
        with open(p) as f:
            for line in f:
                parts = line.rstrip("\n").split("\t")
                if len(parts) < 2: continue
                slug, wiki = parts[0], parts[1]
                wb = parts[2] if len(parts) > 2 else ""
                # later files win
                m[slug] = (wiki, wb)
    return m

def insert_citation(text, wiki, wb):
    if "Rules:" in text and wiki in text:
        return text  # already present
    # find References section
    ref_re = re.compile(r"(\n## References\n)", re.MULTILINE)
    m = ref_re.search(text)
    archive_str = f" ([archive]({wb}))" if wb else ""
    new_line = f"- Rules: [Wikipedia]({wiki}){archive_str}\n"
    if not m:
        # insert before See also or at end
        sa = re.search(r"(\n## See also\n)", text)
        block = f"\n## References\n\n{new_line}"
        if sa:
            return text[:sa.start()] + block + text[sa.start():]
        return text.rstrip() + "\n" + block
    # insert as first bullet after the heading
    insert_at = m.end()
    rest = text[insert_at:]
    # skip blank lines
    bl = re.match(r"(\n*)", rest)
    blanks = bl.group(1) if bl else ""
    return text[:insert_at] + blanks + new_line + rest[len(blanks):]

def main():
    mp = load_map()
    n_updated = 0
    n_missing = 0
    for fn in sorted(os.listdir(GAMES)):
        if not fn.endswith(".md") or fn == "_template.md":
            continue
        slug = fn[:-3]
        if slug not in mp:
            n_missing += 1
            print(f"  no wiki for {slug}", file=sys.stderr)
            continue
        wiki, wb = mp[slug]
        path = os.path.join(GAMES, fn)
        with open(path) as f:
            text = f.read()
        new = insert_citation(text, wiki, wb)
        if new != text:
            with open(path, "w") as f:
                f.write(new)
            n_updated += 1
    print(f"Updated {n_updated} game files; {n_missing} missing wiki map", file=sys.stderr)

if __name__ == "__main__":
    main()
