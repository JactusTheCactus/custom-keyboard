.PHONY: build all
DATA := $(wildcard data/*.json)
LAYOUTS := $(patsubst data/%.json,layouts/%.json,$(DATA))
all:
	clear -x
	make build
build: $(LAYOUTS)
layouts/%.json: data/%.json script.py uni.json
	mkdir -p layouts
	python3 script.py $< $@