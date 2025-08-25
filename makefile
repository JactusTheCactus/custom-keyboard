.PHONY build

build: data/AbugidaR.json data/AlphabetD.json script.py
	python3 script.py
