import json, re
layout = {
	"title": "Conscript Keyboard",
	"onScreen": {
		"main": []
	}
}
def char(stringInput):
	uni = {
		"d;": "\u00f0",
		"e;": "\u00e9",
		"i;": "\u00ed",
		"n;": "\u014b",
		"o;": "\u00f3",
		"s;": "\u015b",
		"t;": "\u00fe",
		"u;": "\u00fa",
		"u;;": "\u0171",
		"z;": "\u017a",
		"shift":"[SHIFT]",
		"del":"[DEL]",
		"up":"[UP]",
		"down":"[DOWN]",
		"left":"[LEFT]",
		"right":"[RIGHT]",
		"_A":"[ALL]",
		"_C":"[COPY]",
		"_V":"[PASTE]",
		"_Z":"[UNDO]",
		"_X":"[CUT]",
		"space":"[SPACE]",
		"enter":"[ENTER]"
	}
	stringOutput = uni[stringInput] if stringInput in uni else stringInput
	return stringOutput
def menu(arrayInput):
	for i in range(len(arrayInput)):
		arrayInput[i] = char(arrayInput[i])
	stringOutput = "".join(arrayInput)
	return f"[XC:{stringOutput}]"
def swipe(hashInput):
	arrayOutput = []
	for i in "C W N E S NE NW SW SE".split():
		if i not in hashInput:
			hashInput[i] = " "
		arrayOutput.append(char(hashInput[i]))
	stringOutput = "".join(arrayOutput).rstrip()
	return f"[4D:{stringOutput}]"
def multi(stringInput):
	return f"[MC:{char(stringInput)}]"
def key(stringInput, width = 1):
	stringOutput = f"{char(stringInput)}{'[]' * (width - 1)}"
	return stringOutput
def row(*arrayInput):
	stringOutput = "".join(arrayInput)
	layout["onScreen"]["main"].append(stringOutput)
	return
row(
	key("x"),
	key("a"),
	key(swipe({
		"C": "e",
		"N": "e;"
	})),
	key(swipe({
		"C": "i",
		"N": "i;"
	})),
	key(swipe({
		"C": "o",
		"N": "o;"
	})),
	key(swipe({
		"C": "u",
		"N": "u;",
		"S": "u;;"
	})),
	key("'")
)
row(
	key(swipe({
		"C": "c",
		"N": "j"
	})),
	key(swipe({
		"C": "f",
		"N": "v"
	})),
	key("h"),
	key(swipe({
		"C": "k",
		"N": "g"
	})),
	key("l"),
	key("m"),
	key("n")
)
row(
	key("n;"),
	key(swipe({
		"C": "p",
		"N": "b"
	})),
	key("r"),
	key(swipe({
		"C": "s",
		"N": "z"
	})),
	key(swipe({
		"C": "s;",
		"N": "z;"
	})),
	key(swipe({
		"C": "t",
		"N": "d"
	})),
	key(swipe({
		"C": "t;",
		"N": "d;"
	}))
)
row(
	key("shift",3),
	key("w"),
	key("y"),
	key("del",2)
)
row(
	key(swipe({
		"N": "up",
		"S": "down",
		"W": "left",
		"E": "right"
	}),2),
	key(swipe({
		"C": ".",
		"N": multi("...")
	}),2),
	key("-"),
	key(","),
	key("?")
)
row(
	key(swipe({
		"C": "_A",
		"N": "_C",
		"S": "_V",
		"E": "_Z",
		"W": "_X"
	}),2),
	key("space",3),
	key("enter",2)
)
with open("layout.json","w") as f:
	print("\n".join(layout["onScreen"]["main"]))
	json.dump(layout,f,indent="\t")