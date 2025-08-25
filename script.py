import json, re
layout = {
	"title": "Conscript Keyboard",
	"onScreen": {
		"main": []
	}
}
class Key:
	def __init__(self,value):
		self.value = value
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
		"tab":"[TAB]",
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
def swipeVerbose(hashInput):
	for k, v in hashInput.items():
		if all([
			type(hashInput[k]) == str,
			len(v) > 1,
			not any([
				bool(re.search(r"\[\w+\]",char(v))),
				bool(re.search(r"[^\u0000-\u007f]",char(v)))
			])
		]):
			hashInput[k] = multi(hashInput[k])
	arrayOutput = []
	for i in "C W N E S NW NE SE SW".split():
		if i not in hashInput:
			hashInput[i] = " "
		arrayOutput.append(char(hashInput[i]))
	stringOutput = "".join(arrayOutput).rstrip()
	return Key(f"[4D:{stringOutput}]")
def swipe(*arrayInput):
	match len(arrayInput):
		case 1:
			return swipeVerbose({
				"C": arrayInput[0]
			}).value
		case 2:
			return swipeVerbose({
				"C": arrayInput[0],
				"N": arrayInput[1]
			}).value
		case 3:
			return swipeVerbose({
				"C": arrayInput[0],
				"NW": arrayInput[1],
				"NE": arrayInput[2]
			}).value
		case 4:
			return swipeVerbose({
				"C": arrayInput[0],
				"NW": arrayInput[1],
				"NE": arrayInput[2],
				"S": arrayInput[3]
			}).value
		case 5:
			return swipeVerbose({
				"C": arrayInput[0],
				"NW": arrayInput[1],
				"NE": arrayInput[2],
				"SE": arrayInput[3],
				"SW": arrayInput[4]
			}).value
		case _:
			print(len(arrayInput))
			return f"<{len(arrayInput)}>"
	return
def multi(stringInput):
	return f"[MC:{char(stringInput)}]"
def key(stringInput, width = 1):
	stringOutput = f"{char(stringInput)}{'[]' * (width - 1)}"
	key = swipe(stringOutput) if type(stringOutput) == Key else stringOutput
	return Key(key)
def row(*arrayInput):
	map(lambda i: key(i),arrayInput)
	stringOutput = "".join(map(lambda i: i.value,arrayInput))
	layout["onScreen"]["main"].append(stringOutput)
	return
row(
	key("x"),
	key("a"),
	key(swipe("e","e;")),
	key(swipe("i","i;")),
	key(swipe("o","o;")),
	key(swipe("u","u;","u;;")),
	key("'")
)
row(
	key(swipe("c","j")),
	key(swipe("f","v")),
	key("h"),
	key(swipe("k","g")),
	key("l"),
	key("m"),
	key("n")
)
row(
	key("n;"),
	key(swipe("p","b")),
	key("r"),
	key(swipe("s","z")),
	key(swipe("s;","z;")),
	key(swipe("t","d")),
	key(swipe("t;","d;"))
)
row(
	key("shift",3),
	key("w"),
	key("y"),
	key("del",2)
)
row(
	key(swipeVerbose({
		"C":"tab",
		"N":"up",
		"S":"down",
		"W":"left",
		"E":"right"
	}).value,2),
	key(swipe(".","..."),2),
	key("-"),
	key(","),
	key("?")
)
row(
	key(swipe("_A","_C","_V","_Z","_X"),2),
	key("space",3),
	key("enter",2)
)
with open("layout.json","w") as f:
	print("\n".join(layout["onScreen"]["main"]))
	json.dump(layout,f,indent="\t")