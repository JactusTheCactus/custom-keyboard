#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
if ! flag local; then
	npm ci --no-audit --no-fund
fi
cat << EOF > debug.json
{
	"debug": $(flag local && echo "true" || echo "false")
}
EOF
style() {
	in="$1"
	out="$2"
	if flag local; then
		CMD="sass"
	else
		CMD="npx sass"
	fi
	$CMD "$in" "$out"
}
build() {
	echo "[]" > data.json
	for data in data/*; do
		i="${data#data/}"
		i="${i%.yml}"
		./.js "$i"
	done
	style page/_.scss page/_.css
	tsc
	./page/pug.js
}
build
if flag local; then
	watch=()
	watch+=(.js)
	li=(layouts data)
	for i in "${li[@]}"; do
		watch+=($i/*)
	done
	li=(pug ts scss)
	for i in "${li[@]}"; do
		watch+=(page/*.$i)
	done
	while inotifywait -e close_write "${watch[@]}"; do
		build || :
	done
fi