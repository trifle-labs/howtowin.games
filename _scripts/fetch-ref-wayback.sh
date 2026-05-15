#!/bin/bash
# Fetch wayback URLs for references
set -u
IN="_scripts/ref-urls.tsv"
OUT="_scripts/ref-wayback.tsv"

: > "$OUT"

fetch_one() {
    local key="$1" url="$2"
    local resp wb
    resp=$(curl -s --max-time 12 "https://archive.org/wayback/available?url=${url}")
    wb=$(printf '%s' "$resp" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    s=d.get('archived_snapshots',{}).get('closest',{})
    print(s.get('url',''))
except Exception:
    print('')
")
    if [ -z "$wb" ]; then
        # try save now
        wb=$(curl -sI --max-time 60 "https://web.archive.org/save/${url}" 2>/dev/null | awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r\n' | head -1)
    fi
    printf '%s\t%s\t%s\n' "$key" "$url" "$wb"
}

export -f fetch_one

while IFS=$'\t' read -r key url; do
    [ -z "$key" ] && continue
    printf '%s\t%s\n' "$key" "$url"
done < "$IN" | xargs -P 4 -L 1 bash -c 'fetch_one "$0" "$1"' >> "$OUT"

echo "Done -> $OUT"
wc -l "$OUT"
