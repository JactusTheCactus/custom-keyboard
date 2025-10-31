#!/usr/bin/env node
import fs from "fs"
import YAML from "js-yaml"
const [
	uni,
	diacritics
] = [
	"uni",
	"diacritics"
]
	.map(i => YAML.load(fs.readFileSync(`${i}.yml`)))
const args = process.argv.filter(i => !/node|\.js$/.test(i))
const inputFile = ["data", [args[0], "yml"].join(".")].join("/")
const outputFile = ["layouts", [args[0], "json"].join(".")].join("/")
const input = YAML.load(fs.readFileSync(inputFile, { encoding: "utf-8" }))
function menu(arrIn) {
	return `[XK:${arrIn.map(char).join("")}]`
}
function multi(strIn) {
	return `[MC:${strIn}]`
}
function swipe(objIn) {
	return `[4D:${"C W N E S NW NE SE SW"
		.split(/\s+/)
		.map(k => char(objIn[k.toUpperCase()])
			?? char(objIn[k.toLowerCase()])
			?? " "
		)
		.join("")
		.replace(/\s*$/, "")
		}]`
}
function char(charIn) {
	switch (typeof charIn) {
		case "string":
			if (
				charIn.length > 1
				|| [
					...Object.keys(uni),
					...Object.keys(diacritics)
				].includes(charIn)
			) {
				const arrOut = charIn.split("_")
				if (arrOut.length > 1) {
					return multi(arrOut.map(char).join(""))
				} else {
					return uni[charIn]
						?? diacritics[charIn]
						?? multi(charIn)
				}
			} else {
				return charIn
			}
		case "object":
			if (Array.isArray(charIn)) {
				return menu(charIn)
			} else {
				return swipe(charIn)
			}
	}
}
function key(keyIn) {
	return keyIn
		.map(char)
		.slice(1)
		.join("")
		+ "[]".repeat(keyIn[0] - 1)
}
function row(rowIn) {
	return rowIn
		.map(key)
		.join("")
}
function keyboard(boardIn) {
	return boardIn.map(row)
}
function titleFMT(titleIn) {
	const titleOut = titleIn
		.replace(/\{(.*?)\}/g, (_, m) => {
			return m
				.split("_")
				.map(c => {
					return uni[c]
						?? diacritics[c]
						?? c
				})
				.join("")
		})
	return titleOut
}
fs.writeFileSync(outputFile, JSON.stringify({
	title: titleFMT(input.title),
	onScreen: {
		main: keyboard(input.layout)
	}
}, null, "\t"))