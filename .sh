#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
if ! flag local; then
	npm install
	sass() {
		in="$1"
		out="$2"
		npx sass "$in" "$out"
		echo "SCSS > $in"
		echo "CSS  > $out"
	}
fi
build() {
	echo "[]" > data.json
	for data in data/*; do
		i="${data#data/}"
		i="${i%.yml}"
		./.js "$i"
	done
	sass page/_.scss page/_.css
	tsc
	node page/pug.js
}
build
if flag local; then
	watch=(
		.js
		layouts/*
		data/*
		page/*
	)
	while inotifywait -e close_write "${watch[@]}"; do
		build || :
	done
fi