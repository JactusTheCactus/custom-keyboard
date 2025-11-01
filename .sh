#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
chmod +x init.sh
if ! flag local; then
	./init.sh
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
if ! flag local; then
	npm ci
fi
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