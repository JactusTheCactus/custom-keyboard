#!/usr/bin/env bash
set -uo pipefail
flag() { 
	for f in "$@"; do
		if ! [[ -e ".flags/$f" ]]; then
			return 1
		fi
	done
}
rm -rf logs
mkdir -p logs
exec > logs/main.log
if ! flag local 
	then npm ci --no-audit --no-fund
fi
tsc
jq -nc '.debug=$d' \
	--argjson d "$(if flag local
		then echo true 
		else echo false
	fi)" \
	> config.json
jq -n '[]' > data.json
while read -r i; do
	i=${i#data/}
	i=${i%.yml}
	node build.js "$i"
done < <(find data -type f -name '*.yml')
npx sass \
	page/style.{s,}css \
	--no-source-map \
	--style=compressed
node page/pug.js
