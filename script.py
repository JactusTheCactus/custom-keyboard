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
def multi(stringInput):
	return f"[MC:{char(stringInput)}]"
def menu(arrayInput):
	for i in range(len(arrayInput)):
		arrayInput[i] = char(arrayInput[i])
	stringOutput = "".join(arrayInput)
	return f"[XC:{stringOutput}]"
def swipeVerbose(hashInput):
	for k, v in hashInput.items():
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
	newArray = arrayInput[1:]
	length = len(newArray)
	match length:
		case 1:
			stringOutput = newArray[0]
		case 2:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1]
			}).value
		case 3:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"NW": newArray[1],
				"NE": newArray[2]
			}).value
		case 5:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1],
				"S": newArray[2],
				"E": newArray[3],
				"W": newArray[4]
			}).value
		case _:
			stringOutput = f"<{newArray}>"
	arrayOutput = [
		stringOutput,
		arrayInput[0]
	]
	return arrayOutput
def key(arrayInput):
	width = arrayInput[0]
	stringOutput = f"{
		swipe(
			list(
				map(
					lambda i: char(i),
					arrayInput
				)
			)
		)[0]
	}{'[]' * (width - 1)}"
	return Key(stringOutput,width)
def row(arrayInput):
	map(lambda i: key([i]),arrayInput)
	print(sum([i.length for i in arrayInput]))
	stringOutput = "".join(map(lambda i: i.value,arrayInput))
	layout["onScreen"]["main"].append(stringOutput)
	return
row([
	key([1,"x"]),
	key([1,"a"]),
	key([1,"e","e;"]),
	key([1,"i","i;"]),
	key([1,"o","o;"]),
	key([1,"u","u;","u;;"]),
	key([1,"'"])
])
row([
	key([1,"c","j"]),
	key([1,"f","v"]),
	key([1,"h"]),
	key([1,"k","g"]),
	key([1,"l"]),
	key([1,"m"]),
	key([1,"n"])
])
row([
	key([1,"n;"]),
	key([1,"p","b"]),
	key([1,"r"]),
	key([1,"s","z"]),
	key([1,"s;","z;"]),
	key([1,"t","d"]),
	key([1,"t;","d;"])
])
row([
	key([2,"tab","up","down","right","left"]),
	key([1,"w"]),
	key([1,"y"]),
	key([1,".","..."]),
	key([2,"del"])
])
row([
	key([4,"shift"]),
	key([1,","]),
	key([1,"?"]),
	key([1,"-"])
])
row([
	key([2,"_A","_C","_X","_V","_Z"]),
	key([3,"space"]),
	key([2,"enter"])
])
with open("layout.json","w") as f:
	print("\n".join(layout["onScreen"]["main"]))
	json.dump(layout,f,indent="\t")