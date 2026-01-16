#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
ts() {
	jq -nc '.debug=$d' \
		--argjson d `flag local && echo true || echo false` \
		> config.json
	jq -n '[]' > data.json
	while read -r i; do
		i="${i#data/}"
		i="${i%.yml}"
		node build.js "$i"
	done < <(find data -type f -name "*.yml")
}
c++() {
	rm -rf bin logs
	mkdir -p bin logs/keyboard
	BIN=bin/main
	while read -r i
		do yq "$i" -o=json | jq -c '.' > "${i%.yml}.json"
	done < <(find . -name "*.yml" ! \( -path "*/node_modules/*" -o -path "*/.github/*" \))
	grep -rn "auto" src > logs/auto.log || true
	g++ \
		`find src -name "*.cpp"` \
		-o "$BIN" \
		-std=c++17 \
		&> logs/main.log
	chmod +x "$BIN"
	while read -r i; do
		export FILE="$i"
		i="${i#data/}"
		i="${i%.json}"
		log="logs/keyboard/$i.log"
		"./$BIN" &> "$log" \
		|| cp logs/main.log "$log"
	done < <(find data -name "*.json")
}
flag local || npm ci --no-audit --no-fund
tsc
flag local && c++ || ts
npx sass \
	page/style.scss \
	page/style.css \
	--no-source-map \
	--style=compressed
node page/pug.js
find . \
	\( \
		-empty \
		-o -name "*.js" \
		-o -path "*/data/*" -name "*.json" \
	\) \
	! -path "*/node_modules/*" \
	-delete
if [[ -f "logs/auto.log" ]]; then
	printf '\tUnrecommended type identifier "%s" used\n\n' "auto"
	cat logs/auto.log
	exit 1
fi
