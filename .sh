#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
if ! flag local
	then npm ci \
		--no-audit \
		--no-fund
fi
jq \
	-nc '.debug=$d' \
	--argjson d \
		`flag local && echo true || echo false` \
	> config.json
echo "[]" > data.json
tsc
for data in data/*; do
	i="${data#data/}"
	i="${i%.yml}"
	node build.js "$i"
done
npx sass \
	page/style.scss \
	page/style.css \
	--no-source-map \
	--style=compressed
node page/pug.js