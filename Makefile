.PHONY build

build: $(wildcards data/*.json) script.py
	python3 script.py
