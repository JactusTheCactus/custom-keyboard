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
	for i in range(len(arrayInput)):
		arrayInput[i] = key(arrayInput[i])
	print(sum([i.length for i in arrayInput]))
	stringOutput = "".join(map(lambda i: i.value,arrayInput))
	layout["onScreen"]["main"].append(stringOutput)
	return
for i in [
	[
		[1,"x"],
		[1,"a"],
		[1,"e","e;"],
		[1,"i","i;"],
		[1,"o","o;"],
		[1,"u","u;","u;;"],
		[1,"'"]
	],
	[
		[1,"c","j"],
		[1,"f","v"],
		[1,"h"],
		[1,"k","g"],
		[1,"l"],
		[1,"m"],
		[1,"n"]
	],
	[
		[1,"n;"],
		[1,"p","b"],
		[1,"r"],
		[1,"s","z"],
		[1,"s;","z;"],
		[1,"t","d"],
		[1,"t;","d;"]
	],
	[
		[2,"tab","up","down","right","left"],
		[1,"w"],
		[1,"y"],
		[1,".","..."],
		[2,"del"]
	],
	[
		[4,"shift"],
		[1,","],
		[1,"?"],
		[1,"-"]
	],
	[
		[2,"_A","_C","_X","_V","_Z"],
		[3,"space"],
		[2,"enter"]
	]
]:
	row(i)
with open("layout.json","w") as f:
	print("\n".join(layout["onScreen"]["main"]))
	json.dump(layout,f,indent="\t")