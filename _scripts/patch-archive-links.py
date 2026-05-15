#!/usr/bin/env python3
"""Patch game files and references.md to add [archive] links where missing.

Uses _scripts/wiki-wayback-saved.tsv and _scripts/ref-wayback-saved.tsv to
fill in [archive](...) links for any [Rules: Wikipedia](...) entries in game
files, and any "Link: <...>" entries in references.md that currently lack an
archive.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_tsv(path):
    m = {}
    if not os.path.exists(path):
        return m
    with open(path) as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            key, url, wb = parts[0], parts[1], parts[2]
            if wb:
                m[key] = (url, wb)
                m[url] = wb  # url-keyed for ref lookup
    return m

def patch_game(path, m_by_slug):
    slug = os.path.basename(path)[:-3]
    if slug not in m_by_slug:
        return False
    url, wb = m_by_slug[slug]
    with open(path) as f:
        text = f.read()
    line_re = re.compile(r"^- Rules: \[Wikipedia\]\([^)]+\)(?: \(\[archive\][^)]+\))?\s*$", re.MULTILINE)
    matches = line_re.findall(text)
    if not matches:
        return False
    if "([archive]" in matches[0]:
        return False  # already has archive
    new_line = f"- Rules: [Wikipedia]({url}) ([archive]({wb}))"
    new_text = line_re.sub(new_line, text, count=1)
    if new_text != text:
        with open(path, "w") as f:
            f.write(new_text)
        return True
    return False

def patch_references(refpath, m_by_url):
    with open(refpath) as f:
        text = f.read()
    # find "Link: <URL>" without archive
    line_re = re.compile(r"^Link: <([^>]+)>$", re.MULTILINE)
    def repl(m):
        url = m.group(1)
        if url in m_by_url and isinstance(m_by_url[url], str):
            return f"Link: <{url}> ([archive]({m_by_url[url]}))"
        return m.group(0)
    new_text = line_re.sub(repl, text)
    if new_text != text:
        with open(refpath, "w") as f:
            f.write(new_text)
        return True
    return False

def main():
    games_tsv = os.path.join(ROOT, "_scripts", "wiki-wayback-saved.tsv")
    refs_tsv = os.path.join(ROOT, "_scripts", "ref-wayback-saved.tsv")
    m_games = load_tsv(games_tsv)
    m_refs = load_tsv(refs_tsv)

    # Patch games
    n = 0
    games_dir = os.path.join(ROOT, "games")
    for fn in sorted(os.listdir(games_dir)):
        if not fn.endswith(".md") or fn == "_template.md":
            continue
        if patch_game(os.path.join(games_dir, fn), m_games):
            n += 1
    print(f"Patched {n} game files with archive links", file=sys.stderr)

    # Patch references
    if patch_references(os.path.join(ROOT, "references.md"), m_refs):
        print("Patched references.md", file=sys.stderr)
    else:
        print("No references.md changes", file=sys.stderr)

if __name__ == "__main__":
    main()
