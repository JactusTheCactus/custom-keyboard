#!/bin/bash
make
while inotifywait -e close_write data/*.json script.py *.json; do
	make
done