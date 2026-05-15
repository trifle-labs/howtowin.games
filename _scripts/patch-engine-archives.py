#!/usr/bin/env python3
"""Append [archive](wb) after each engine-URL link in game files."""
import os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_archives(path):
    m = {}
    with open(path) as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) >= 2 and parts[1]:
                m[parts[0]] = parts[1]
    return m

def patch_file(path, archives):
    with open(path) as f:
        text = f.read()
    orig = text
    for live, wb in archives.items():
        # Find `](live_url)` not already followed by " ([archive]"
        pattern = re.compile(r"\]\(" + re.escape(live) + r"\)(?!\s*\(\[archive\])")
        replacement = f"]({live}) ([archive]({wb}))"
        text = pattern.sub(replacement, text)
    if text != orig:
        with open(path, "w") as f:
            f.write(text)
        return True
    return False

def main():
    archives = load_archives(os.path.join(ROOT, "_scripts", "engine-archives.tsv"))
    n = 0
    for f in sorted(glob.glob(os.path.join(ROOT, "games", "*.md"))):
        if f.endswith("_template.md"):
            continue
        if patch_file(f, archives):
            n += 1
    print(f"Patched {n} game files with engine archive links", file=sys.stderr)

if __name__ == "__main__":
    main()
