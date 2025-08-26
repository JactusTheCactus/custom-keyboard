.PHONY: build
DATA := $(wildcard data/*.json)
LAYOUTS := $(patsubst data/%.json,layouts/%.json,$(DATA))
build: $(LAYOUTS)
layouts/%.json: data/%.json script.py uni.json
	mkdir -p layouts
	python3 script.py $< $@