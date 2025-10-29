#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
rm -rf layouts
mkdir -p layouts
if ! [[ -d "vEnv" ]]; then
	python3 -m venv vEnv
fi
source vEnv/bin/activate
for in in data/*.yml; do
	out=$in
	out=${out%.yml}.json
	out=layouts${out#data}
	python3 script.py $in $out
done