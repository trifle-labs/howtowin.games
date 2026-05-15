#!/bin/bash
# Submit missing Wikipedia URLs to Save Page Now, write results to TSV
set -u
IN="_scripts/wiki-wayback.tsv"
OUT="_scripts/wiki-wayback-2.tsv"

: > "$OUT"

save_one() {
    local slug="$1" wiki="$2"
    local loc
    loc=$(curl -sI --max-time 60 "https://web.archive.org/save/${wiki}" 2>/dev/null | awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r\n' | head -1)
    if [ -z "$loc" ]; then
        # try a head fetch on /web/2*
        loc=$(curl -sI --max-time 30 "https://archive.org/wayback/available?url=${wiki}" 2>/dev/null)
        loc=""
    fi
    printf '%s\t%s\t%s\n' "$slug" "$wiki" "$loc"
}

export -f save_one

awk -F'\t' '$3==""{print $1"\t"$2}' "$IN" | \
    while IFS=$'\t' read -r slug wiki; do
        printf '%s\t%s\n' "$slug" "$wiki"
        sleep 1
    done | xargs -P 3 -L 1 bash -c 'save_one "$0" "$1"' >> "$OUT"

echo "Done -> $OUT"
wc -l "$OUT"
