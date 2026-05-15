#!/bin/bash
# Fixed Save Page Now - process missing URLs from merged file
set -u
IN="_scripts/wiki-wayback-merged.tsv"
OUT="_scripts/wiki-wayback-saved.tsv"

: > "$OUT"

save_one() {
    local slug="$1" wiki="$2"
    local loc
    loc=$(curl -sI --max-time 60 "https://web.archive.org/save/${wiki}" 2>/dev/null | awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r\n' | head -1)
    if [ -z "$loc" ]; then
        # second-try availability lookup after a delay (in case someone else saved it)
        sleep 1
        loc=$(curl -s --max-time 15 "https://archive.org/wayback/available?url=${wiki}" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    s=d.get('archived_snapshots',{}).get('closest',{})
    print(s.get('url',''))
except Exception:
    print('')
")
    fi
    printf '%s\t%s\t%s\n' "$slug" "$wiki" "$loc"
}

export -f save_one

# Process serially with rate-limiting (SPN is rate-limited)
awk -F'\t' '$3==""{print $1"\t"$2}' "$IN" | \
    while IFS=$'\t' read -r slug wiki; do
        save_one "$slug" "$wiki" >> "$OUT"
        sleep 2
    done

echo "Done -> $OUT"
wc -l "$OUT"
