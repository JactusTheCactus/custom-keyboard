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
	for in in data/*.yml; do
		out=$in
		out=${out%.yml}.json
		out=layouts${out#data}
		python script.py $in $out
	done
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