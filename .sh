#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
ts() {
	flag local || npm ci --no-audit --no-fund
	jq -nc '.debug=$d' \
		--argjson d `flag local && echo true || echo false` \
		> config.json
	jq -n '[]' > data.json
	while read -r i
		do node build.js "`perl -pe 's|data/(.*?)\.yml|$1|g' <<< "$i"`"
	done < <(find data -type f)
}
c++() {
	rm -rf bin
	mkdir -p bin
}
tsc
flag local && c++ || ts
npx sass \
	page/style.scss \
	page/style.css \
	--no-source-map \
	--style=compressed
node page/pug.js
find . \( -name "*.js" -o -empty \) ! -path "*/node_modules/*" -delete