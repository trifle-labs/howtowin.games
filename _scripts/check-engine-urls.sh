#!/bin/bash
set -u

check_one() {
    local url="$1"
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
    printf '%s\t%s\n' "$url" "$loc"
}
export -f check_one

cat <<'URLS' | xargs -P 8 -I{} bash -c 'check_one "$@"' _ {}
https://github.com/ianfab/Fairy-Stockfish
https://github.com/leela-zero/leela-zero
https://github.com/lightvector/KataGo
https://kociemba.org/cube.htm
https://lczero.org/
https://lichess.org/@/JannLee
https://lichess.org/variant/antichess
https://lichess.org/variant/atomic
https://lichess.org/variant/chess960
https://lichess.org/variant/horde
https://lichess.org/variant/kingOfTheHill
https://lichess.org/variant/threeCheck
https://ludii.games/
https://stockfishchess.org/
https://syzygy-tables.info/
https://webdocs.cs.ualberta.ca/~chinook/
https://www.computerchess.org.uk/ccrl/
https://www.gnu.org/software/gnubg/
https://www.sjeng.org/indexold.html
URLS
