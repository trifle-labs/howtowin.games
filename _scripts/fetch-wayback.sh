#!/bin/bash
# Bulk Wayback Machine availability lookup
# Reads slug<TAB>wiki_path lines from _scripts/wiki-map.txt
# Writes slug<TAB>wiki_url<TAB>wayback_url to _scripts/wiki-wayback.tsv

set -u
IN="${1:-_scripts/wiki-map.txt}"
OUT="${2:-_scripts/wiki-wayback.tsv}"

: > "$OUT"

fetch_one() {
    local slug="$1" path="$2"
    local wiki="https://en.wikipedia.org/wiki/${path}"
    local resp wb
    resp=$(curl -s --max-time 12 "https://archive.org/wayback/available?url=${wiki}")
    wb=$(printf '%s' "$resp" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    s=d.get('archived_snapshots',{}).get('closest',{})
    print(s.get('url',''))
except Exception:
    print('')
")
    printf '%s\t%s\t%s\n' "$slug" "$wiki" "$wb"
}

export -f fetch_one

# Run with mild parallelism (8 at a time)
while IFS=$'\t' read -r slug path; do
    [ -z "$slug" ] && continue
    printf '%s\t%s\n' "$slug" "$path"
done < "$IN" | xargs -P 8 -L 1 bash -c 'fetch_one "$0" "$1"' >> "$OUT"

echo "Done -> $OUT"
wc -l "$OUT"
