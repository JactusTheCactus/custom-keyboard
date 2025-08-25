.PHONY: build
DATA := $(wildcard data/*.json)
build: $(DATA) script.py
	python3 script.py
