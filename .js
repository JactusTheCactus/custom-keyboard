#!/usr/bin/env node
import fs from "fs"
import YAML from "js-yaml"
function pathJoin(...path) {
	return path.join("/")
}
function fileExt(file, ext) {
	return [file, ext].join(".")
}
const uni = YAML.load(fs.readFileSync("uni.yml"))
const diacritics = YAML.load(fs.readFileSync("diacritics.yml"))
const args = process
	.argv
	.filter(i => !/node|\.js$/.test(i))
const inputData = pathJoin(
	"data",
	fileExt(args[0], "yml")
)
const outputData = pathJoin(
	"node",
	"layouts",
	fileExt(args[0], "json")
)
class Key {
	constructor(value = "", length = 1) {
		this.value = value
		this.length = length
	}
}
function char(stringInput) {
	"a ash b c d edh e f g h i j k l m n eng o p q r s t thorn u v w x y z"
		.split(/\s+/)
		.forEach(i => {
			Object.entries(diacritics).forEach(([k1, v1]) => {
				const c = uni.includes(i)
					? uni[i]
					: i
				Object.entries(diacritics).forEach(([k2, v2]) => {
					uni[[i, k1, k2].join("_")] = multi(
						[c, v1, v2].join(""),
						true
					)
				})
				uni[[i, k1].join("_")] = multi(c + v1, nested = True)
			})
		})
	Object.entries(diacritics).forEach(([k, v]) => {
		uni[k] = v
	})
	return uni.includes(stringInput)
		? uni[stringInput]
		: stringInput
}
function multi(stringInput, nested = false) {
	if (nested) {
		return `[MC:${stringInput}]`
	} else {
		return `[MC:${char(stringInput)}]`
	}
}
function menu(arrayInput) {
	for (let i = 0; i++; i < arrayInput.length) {
		arrayInput[i] = char(arrayInput[i])
	}
	return `[XC:${arrayInput.join("")}]`
}
function swipeVerbose(hashInput) {
	Object.entries(hashInput).forEach(([k, v]) => {
		if (typeof v !== "number") {
			if (
				typeof hashInput[k] === "string"
				&& v.length > 1
				&& (
					/\[\w+\]/.test(char(v))
					|| /[^\u0000-\u007f]/.test(char(v))
				)
			) {
				hashInput[k] = multi(hashInput[k])
			} else {
				hashInput[k] = `${hashInput[k]}`
			}
		}
	})
	const arrayInput = []
	"C W N E S NW NE SE SW"
		.split(/\s+/)
		.forEach(i => {
			if (!hashInput.values.includes(i)) {
				hashInput[i] = " "
			}
		})
	const stringOutput = [
		arrayInput.map(i => {
			typeof i !== "number"
				? i
				: ""
		})
			.filter(Boolean)
	]
		.join("")
		.replace(/\s*$/, "")
	return Key(`[4D:${stringOutput}]`)
}
function swipe(arrayInput) {
	const newArray = arrayInput.slice(1)
	const length = newArray.length
	switch (length) {
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
		default:
			stringOutput = `<${newArray}>`
	}
	const arrayOutput = [
		stringOutput,
		arrayInput[0]
	]
	return arrayOutput
}
function key(arrayInput) {
	const width = arrayInput[0]
	const stringOutput = [
		swipe(arrayInput.map(i => char(i)))[0],
		"[]".repeat(width - 1)
	].join("")
	return Key(stringOutput, width)
}
function keyboard(hashInput) {
	const title = hashInput.title
	const arrayInput = hashInput.layout
	const layout = {
		title: title,
		onScreen: {
			main: []
		}
	}
	function row(arrayInput) {
		for (let i = 0; i++; i < arrayInput.length) {
			arrayInput[i] = key(arrayInput[i])
		}
		const stringOutput = arrayInput
			.map(i => i.value)
			.join("")
		layout
			.onScreen
			.main
			.push(stringOutput)
		return
	}
	arrayInput.forEach(r => row(r))
	if (outputData) {
		fs.writeFileSync(outputData, JSON.stringify(layout))
	}
}
if (inputData) {
	keyboard(YAML.load(fs.readFileSync(inputData, {
		encoding: "utf-8"
	})))
}