#!/bin/bash
# Re-query Wayback availability API in parallel for missing entries.
set -u

check_one() {
    local key="$1" url="$2"
    local loc
    loc=$(curl -s --max-time 12 "https://archive.org/wayback/available?url=${url}" 2>/dev/null | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    s=d.get('archived_snapshots',{}).get('closest',{})
    print(s.get('url','') if s.get('available') else '')
except Exception:
    print('')
")
    printf '%s\t%s\t%s\n' "$key" "$url" "$loc"
}
export -f check_one

# Wiki re-check
: > _scripts/wiki-wayback-saved.tsv
awk -F'\t' '$3==""{print $1"\t"$2}' _scripts/wiki-wayback-merged.tsv \
  | xargs -P 12 -L 1 bash -c 'check_one "$0" "$1"' \
  >> _scripts/wiki-wayback-saved.tsv

# Ref re-check
: > _scripts/ref-wayback-saved.tsv
awk -F'\t' '$3==""{print $1"\t"$2}' _scripts/ref-wayback.tsv \
  | xargs -P 12 -L 1 bash -c 'check_one "$0" "$1"' \
  >> _scripts/ref-wayback-saved.tsv

echo "Wiki recheck: $(awk -F'\t' '$3!=""' _scripts/wiki-wayback-saved.tsv | wc -l) found / $(wc -l < _scripts/wiki-wayback-saved.tsv) checked"
echo "Ref  recheck: $(awk -F'\t' '$3!=""' _scripts/ref-wayback-saved.tsv | wc -l) found / $(wc -l < _scripts/ref-wayback-saved.tsv) checked"
