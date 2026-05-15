#!/bin/bash
# Save Page Now for missing reference URLs
set -u
IN="_scripts/ref-wayback.tsv"
OUT="_scripts/ref-wayback-saved.tsv"

: > "$OUT"

save_one() {
    local key="$1" url="$2"
    local loc
    loc=$(curl -sI --max-time 60 "https://web.archive.org/save/${url}" 2>/dev/null | awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r\n' | head -1)
    if [ -z "$loc" ]; then
        sleep 1
        loc=$(curl -s --max-time 15 "https://archive.org/wayback/available?url=${url}" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    s=d.get('archived_snapshots',{}).get('closest',{})
    print(s.get('url',''))
except Exception:
    print('')
")
    fi
    printf '%s\t%s\t%s\n' "$key" "$url" "$loc"
}

awk -F'\t' '$3==""{print $1"\t"$2}' "$IN" | \
    while IFS=$'\t' read -r key url; do
        save_one "$key" "$url" >> "$OUT"
        sleep 3
    done

echo "Done -> $OUT"
wc -l "$OUT"
