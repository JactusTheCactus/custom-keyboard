#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
build() {
	for data in data/*; do
		i="${data#data/}"
		i="${i%.yml}"
		./.js "$i"
		jq -r ".title" "layouts/$i.json"
		jq -r ".onScreen.main[]" "layouts/$i.json"
		echo
	done
	sass .scss _.css
	tsc .ts --outFile _.js
	./index.sh
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
		.scss
	)
	while inotifywait -e close_write "${watch[@]}"; do
		build || :
	done
fi