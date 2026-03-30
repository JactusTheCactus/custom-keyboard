#!/usr/bin/env bash
set -uo pipefail
flag() { 
	for f in "$@"
		do [[ -e ".flags/$f" ]] || return 1
	done
}
rm -rf logs
mkdir -p logs
exec > logs/main.log
flag local || npm ci --no-audit --no-fund
tsc
jq -n '[]' > data.json
while read -r i; do
	i=${i#data/}
	i=${i%.yml}
	node build.js "$i"
done < <(find data -name '*.yml')
npx sass \
	page/style.{s,}css \
	--no-source-map \
	--style=compressed
node page/pug.js
