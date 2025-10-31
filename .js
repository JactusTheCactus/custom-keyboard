#!/usr/bin/env node
import fs from "fs"
import YAML from "js-yaml"
const uni = YAML.load(fs.readFileSync("uni.yml"))
const diacritics = YAML.load(fs.readFileSync("diacritics.yml"))
const args = process.argv.filter(i => !/node|\.js$/.test(i))
const inputFile = ["WIP", "data", [args[0], "yml"].join(".")].join("/")
const outputFile = ["WIP", "layouts", [args[0], "json"].join(".")].join("/")
const input = YAML.load(fs.readFileSync(inputFile, { encoding: "utf-8" }))
const out = {
	title: input.title,
	onScreen: {
		main: []
	}
}
const test = "x a e i o u dotBelow".split(/\s+/)
function menu(arrIn) {
	return `[XC:${arrIn.map(char).join("")}]`
}
function multi(strIn) {
	return `[MC:${strIn}]`
}
function swipe(objIn) {
	return `[4D:${"C W N E S NW NE SE SW"
		.split(/\s+/)
		.map(k => char(objIn[k] ?? " "))
		.join("")
		.replace(/\s*$/, "")
		}]`
}
function char(charIn) {
	switch (typeof charIn) {
		case "string":
			if (charIn.length > 1) {
				const arrOut = charIn.split("_")
				if (arrOut.length > 1) {
					return arrOut.map(char).join("")
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
// function key() { }
// function row() { }
// function keyboard() { }
// fs.writeFileSync(outputFile,JSON.stringify(out,null,"\t"))
console.log(char(test))