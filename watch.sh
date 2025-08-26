#!/bin/bash
while inotifywait -e close_write data/*.json script.py uni.json; do
	make
done