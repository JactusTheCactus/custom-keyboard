#!/usr/bin/env bash
set -euo pipefail
flag() { for f in "$@"; do [[ -e ".flags/$f" ]] || return 1; done; }
flag local \
	|| npm ci \
		--no-audit \
		--no-fund
tsc
jq -nc '.debug=$d' \
	--argjson d "$(flag local && echo true || echo false)" \
	> config.json
jq -n '[]' > data.json
while read -r i; do
	i="${i#data/}"
	i="${i%.yml}"
	node build.js "$i"
done < <(find data -type f -name "*.yml")
npx sass \
	page/style.scss \
	page/style.css \
	--no-source-map \
	--style=compressed
node page/pug.js
