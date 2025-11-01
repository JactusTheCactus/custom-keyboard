#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
if ! flag local; then
	#for i in sass; do
		#npm -g install "$i"
	#done
	alias sass="npx sass"
fi
build() {
	if ! flag local; then
		npm ci
	fi
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