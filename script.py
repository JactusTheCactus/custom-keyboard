import json, re, sys, yaml
with open("uni.yml","r") as f:
	uni = yaml.safe_load(f)
with open("diacritics.yml","r") as f:
	diacritics = yaml.safe_load(f)
args = [
	sys.argv[i]
	if len(sys.argv) > i
	else ""
	for i
	in (1, 2)
]
[inputData,outputData] = args
class Key:
	def __init__(self,value="",length=1):
		self.value = value
		self.length = length
def char(stringInput):
	for i in f"a ash b c d edh e f g h i j k l m n eng o p q r s t thorn u v w x y z".split():
		for k1, v1 in diacritics.items():
			c = uni[i] if i in uni else i
			for k2, v2 in diacritics.items():
				uni["_".join([i,k1,k2])] = multi("".join([c,v1,v2]),nested=True)
			uni[f"{i}_{k1}"] = multi(c+v1,nested=True)
	stringOutput = uni[stringInput] if stringInput in uni else stringInput
	return stringOutput
def multi(stringInput, nested=False):
	if nested:
		return f"[MC:{stringInput}]"
	else:
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
			else:
				hashInput[k] = f"{hashInput[k]}"
	arrayOutput = []
	for i in "C W N E S NW NE SE SW".split():
		if i not in hashInput:
			hashInput[i] = " "
		arrayOutput.append(char(hashInput[i]))
	stringOutput = "".join(
		filter(
			bool,
			list(
				map(
					lambda i: i
					if type(i) != int
					else "",
					arrayOutput
				)
			)
		)
	).rstrip()
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
				"N": newArray[1],
				"S": newArray[2]
			}).value
		case 4:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1],
				"SE": newArray[2],
				"SW": newArray[3]
			}).value
		case 5:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1],
				"E": newArray[2],
				"S": newArray[3],
				"W": newArray[4]
			}).value
		case 6:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1],
				"NE": newArray[2],
				"SE": newArray[3],
				"SW": newArray[4],
				"NW": newArray[5]
			}).value
		case 7:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"NE": newArray[1],
				"E": newArray[2],
				"SE": newArray[3],
				"SW": newArray[4],
				"W": newArray[5],
				"NW": newArray[6]
			}).value
		case 8:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1],
				"NE": newArray[2],
				"E": newArray[3],
				"SE": newArray[4],
				"SW": newArray[5],
				"W": newArray[6],
				"NW": newArray[7]
			}).value
		case 9:
			stringOutput = swipeVerbose({
				"C": newArray[0],
				"N": newArray[1],
				"NE": newArray[2],
				"E": newArray[3],
				"SE": newArray[4],
				"S": newArray[5],
				"SW": newArray[6],
				"W": newArray[7],
				"NW": newArray[8]
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
def keyboard(hashInput):
	title = hashInput["title"]
	arrayInput = hashInput["layout"]
	layout = {
		"title": title,
		"onScreen": {
			"main": []
		}
	}
	def row(arrayInput):
		for i in range(len(arrayInput)):
			arrayInput[i] = key(arrayInput[i])
		stringOutput = "".join(map(lambda i: i.value,arrayInput))
		layout["onScreen"]["main"].append(stringOutput)
		return
	for r in arrayInput:
		row(r)
	if outputData:
		with open(outputData,"w") as f:
			json.dump(layout,f,indent="\t")
if inputData:
	with open(inputData, "r") as f:
		keyboard(yaml.safe_load(f))