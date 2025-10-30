#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
py(){
	pyVer="3.12"
	alias python="python$pyVer"
	alias pip="pip$pyVer"
	rm -rf layouts
	mkdir -p layouts
	if ! [[ -d "vEnv" ]]; then
		python -m venv vEnv
	fi
	source vEnv/bin/activate
	dependencies=(
		pyyaml
	)
	for i in "${dependencies[@]}"; do
		pip install $i
	done
	build() {
		./index.sh
	}
	WATCH=(
		*.yml
		*.json
		script.py
	)
	build
	if flag local; then
		while inotifywait -e close_write "${WATCH[@]}"; do
			build
		done
	fi
}
for data in WIP/data/*; do
	i="${data#WIP/data/}"
	i="${i%.yml}"
	./.js "$i"
	o="${data#WIP/data/}"
	o="${i%.yml}"
	jq -r ".layout[]" "WIP/layouts/$o.json"
done