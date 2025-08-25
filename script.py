import json, re
layout = {
	"title": "Conscript Keyboard",
	"onScreen": {
		"main": []
	}
}
class Key:
	def __init__(self,value="",length=1):
		self.value = value
		self.length = length
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
		print(v)
		if type(v) != int:
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
	stringOutput = "".join(filter(bool,list(map(lambda i: i if type(i) != int else "",arrayOutput)))).rstrip()
	return Key(f"[4D:{stringOutput}]")
def swipe(arrayInput):
	newArray = arrayInput[:-1] if type(arrayInput[-1]) == int else arrayInput
	length = len(newArray)
	match length:
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
		case 5:
			return swipeVerbose({
				"C": arrayInput[0],
				"N": arrayInput[1],
				"S": arrayInput[2],
				"E": arrayInput[3],
				"W": arrayInput[4]
			}).value
		case _:
			return f"<{newArray}>"
def multi(stringInput):
	return f"[MC:{char(stringInput)}]"
def key(stringInput):
	width = stringInput[-1] if type(stringInput[:-1]) == int else 1
	stringOutput = f"{swipe(list(map(lambda i: char(i),stringInput)))}{'[]' * (width - 1)}"
	key = swipe(stringOutput) if type(stringOutput) == Key else stringOutput
	return Key(key,width)
def row(*arrayInput):
	map(lambda i: key([i]),arrayInput)
	print(sum([i.length for i in arrayInput]))
	stringOutput = "".join(map(lambda i: i.value,arrayInput))
	layout["onScreen"]["main"].append(stringOutput)
	return
row(
	key(["x",3]),
	key(["a"]),
	key(["e","e;"]),
	key(["i","i;"]),
	key(["o","o;"]),
	key(["u","u;","u;;"]),
	key(["'",3])
)
row(
	key(["c","j"]),
	key(["f","v"]),
	key(["h"]),
	key(["k","g"]),
	key(["l"]),
	key(["m"]),
	key(["n"])
)
row(
	key(["n;"]),
	key(["p","b"]),
	key(["r"]),
	key(["s","z"]),
	key(["s;","z;"]),
	key(["t","d"]),
	key(["t;","d;"])
)
row(
	key(["shift",2]),
	key(["w"]),
	key(["y"]),
	key([".","..."]),
	key(["del",2])
)
row(
	key(["tab","up","down","right","left",2]),
	key([",",2]),
	key(["?",2]),
	key(["-"])
)
row(
	key(["_A","_C","_X","_V","_Z",2]),
	key(["space",3]),
	key(["enter",2])
)
with open("layout.json","w") as f:
	print("\n".join(layout["onScreen"]["main"]))
	json.dump(layout,f,indent="\t")