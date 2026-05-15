#!/usr/bin/env python3
"""Append canonical URL + Wayback link to each ### entry in references.md.

Reads _scripts/ref-wayback.tsv (key, url, wayback) and rewrites
references.md so each `### key` entry ends with a line:

  Link: <url> ([archive](wayback))

If the entry already has a "Link:" or the URL appears in the entry body, the
update is skipped.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, "references.md")
TSV = os.path.join(ROOT, "_scripts", "ref-wayback.tsv")

def load_map(path):
    m = {}
    with open(path) as f:
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 2: continue
            k, u = parts[0], parts[1]
            wb = parts[2] if len(parts) > 2 else ""
            m[k] = (u, wb)
    return m

def main():
    mp = load_map(TSV)
    with open(REF) as f:
        text = f.read()
    # Split into header + entries
    entries = re.split(r"\n### ", text)
    head = entries[0]
    new_entries = [head]
    for blk in entries[1:]:
        # first line = key, rest = body
        nl = blk.find("\n")
        key = blk[:nl].strip()
        body = blk[nl+1:]
        if key in mp:
            url, wb = mp[key]
            if url and "Link:" not in body and url not in body:
                # append link line at end of entry (before blank or next ###)
                body_s = body.rstrip()
                archive = f" ([archive]({wb}))" if wb else ""
                body_s += f"\n\nLink: <{url}>{archive}"
                # preserve trailing newlines
                trail = body[len(body.rstrip()):]
                body = body_s + (trail if trail else "\n\n")
        new_entries.append(f"### {key}\n{body}")
    out = new_entries[0] + "".join(new_entries[1:]) if len(new_entries) > 1 else head
    # rejoin: need to handle the original split — re.split removed "### "
    # Rebuild properly:
    rebuilt = head
    for blk in entries[1:]:
        nl = blk.find("\n")
        key = blk[:nl].strip()
        body = blk[nl+1:]
        if key in mp:
            url, wb = mp[key]
            if url and "Link:" not in body and url not in body:
                body_s = body.rstrip()
                archive = f" ([archive]({wb}))" if wb else ""
                body_s += f"\n\nLink: <{url}>{archive}"
                trail = body[len(body.rstrip()):]
                if not trail.endswith("\n\n"):
                    trail = "\n\n"
                body = body_s + trail
        rebuilt += f"### {key}\n{body}"
    with open(REF, "w") as f:
        f.write(rebuilt)
    print(f"Updated references.md ({len(entries)-1} entries processed)", file=sys.stderr)

if __name__ == "__main__":
    main()
