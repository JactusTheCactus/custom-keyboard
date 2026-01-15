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
		do node build.js "`echo "$i" | perl -pe 's|data/(.*?)\.yml|$1|g'`"
	done < <(find data -type f)
}
c++() {
	BIN=bin/main
	rm -rf bin
	mkdir -p bin
	while read -r i
		do yq "$i" -o=json | jq -c '.' > "${i%.yml}.json"
	done < <(find . -name "*.yml" ! \( -path "*/node_modules/*" -o -path "*/.github/*" \))
	g++ `find src -name "*.[ch]pp"` -o "$BIN" -std=c++14
	chmod +x "$BIN"
	"./$BIN"
}
npm install -D @types/node
tsc
flag local && c++ || ts
npx sass \
	page/style.scss \
	page/style.css \
	--no-source-map \
	--style=compressed
node page/pug.js
find . \( -name "*.js" -o -empty \) ! -path "*/node_modules/*" -delete