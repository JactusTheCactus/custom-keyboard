#!/usr/bin/env bash
WATCH=( \
	*.json
	script.py
)
make
while inotifywait -e close_write "${WATCH[@]}"; do
	make
done