.PHONY: build all
DATA := $(wildcard data/*.json)
LAYOUTS := $(patsubst data/%.json,layouts/%.json,$(DATA))
all:
	clear
	make build
build: $(LAYOUTS)
layouts/%.json: data/%.json script.py $(wildcard *.json)
	mkdir -p layouts
	python3 script.py $< $@