.PHONY build

build: $(wildcard data/*.json) script.py
	python3 script.py
