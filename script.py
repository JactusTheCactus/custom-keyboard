import json
layout = {
	"title":"Conscript Keyboard",
	"onScreen": {
		"main":[]
	}
}
def uni(stringInput):
	uniDict = {
		"d;":"ð",
		"e;":"é",
		"i;":"í",
		"n;":"ŋ",
		"o;":"ó",
		"s;":"ś",
		"t;":"þ",
		"u;":"ú",
		"u;;":"ű",
		"z;":"ź"
	}
	stringInput = stringInput.lower()
	stringOutput = ""
	if stringInput in uniDict:
		stringOutput = uniDict[stringInput]
	else:
		stringOutput = stringInput
	return stringOutput
def menu(arrayInput):
	stringOutput = "".join(arrayInput)
	return f"[XC:{stringOutput}]"
def swipe(hashInput):
	arrayOutput = []
	for i in "C W N E S NE NW SW SE".split():
		if i not in hashInput:
			hashInput[i] = " "
		arrayOutput.append(hashInput[i])
	stringOutput = "".join(arrayOutput).rstrip()
	return f"[4D:{stringOutput}]"
def multi(arrayInput):
	stringOutput = "".join(arrayInput)
	return f"[MC:{stringOutput}]"
def key(stringInput, width = 0):
	stringOutput = f"{stringInput}{'[]'*(width-1)}"
	return stringOutput
def row(arrayInput):
	stringOutput = "".join(arrayInput)
	layout["onScreen"]["main"].append(stringOutput)
	return
row([key("x"),key("a"),key(swipe({"C":"e","N":uni("e;")})),key(swipe({"C":"i","N":uni("i;")})),key(swipe({"C":"o","N":uni("o;")})),key(swipe({"C":"u","N":uni("u;"),"S":uni("u;;")})),key("'")])
row([key(swipe({"C":"c","N":"j"})),key(swipe({"C":"f","N":"v"})),key("h"),key(swipe({"C":"k","N":"g"})),key("l"),key("m"),key("n")])
row([key(uni("n;")),key(swipe({"C":"p","N":"b"})),key("r"),key(swipe({"C":"s","N":"z"})),key(swipe({"C":uni("s;"),"N":uni("z;")})),key(swipe({"C":"t","N":"d"})),key(swipe({"C":uni("t;"),"N":uni("d;")}))])
row([key("[SHIFT]",3),key("w"),key("y"),key("[DEL]",2)])
row([key(swipe({"N":"[UP]","S":"[DOWN]","W":"[LEFT]","E":"[RIGHT]"}),2),key(swipe({"C":".","N":multi(". . .".split())}),2),key("-"),key(","),key("?")])
row([key(swipe({"C":"[ALL]","N":"[COPY]","S":"[PASTE]","E":"[UNDO]","W":"[CUT]"}),2),key("[SPACE]",3),key("[ENTER]",2)])
with open("layout.json","w") as f:
	json.dump(layout,f,indent="\t")
	print(json.dumps(layout,indent=4))