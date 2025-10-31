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
	./index.sh
}
WATCH=(
	*.yml
	*.json
)
build
if flag local; then
	while inotifywait -e close_write "${WATCH[@]}"; do
		build
	done
fi