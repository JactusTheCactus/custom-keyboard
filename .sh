#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
pyVer="3.12"
alias python="python$pyVer"
alias pip="pip$pyVer"
rm -rf layouts/*
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
	for in in data/*; do
		out="layouts/${in#data/}"
		out="${out%.yml}.json"
		./script.py "$in" "$out"
	done
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
# for data in WIP/data/*; do
# 	i="${data#WIP/data/}"
# 	i="${i%.yml}"
# 	./.js "$i"
# 	o="${data#WIP/data/}"
# 	o="${i%.yml}"
# 	jq -r ".onScreen.main[]" "WIP/layouts/$o.json"
# done