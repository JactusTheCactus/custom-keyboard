#!/usr/bin/env node
import fs from "fs"
import YAML from "js-yaml"
const uni = YAML.load(fs.readFileSync("uni.yml"))
const diacritics = YAML.load(fs.readFileSync("diacritics.yml"))
const args = process
	.argv
	.filter(i => !/node|\.js$/.test(i))
const inputFile = ["WIP", "data", [args[0], "yml"].join(".")].join("/")
const outputFile = ["WIP", "layouts", [args[0], "json"].join(".")].join("/")
const input = YAML.load(fs.readFileSync(inputFile, { encoding: "utf-8" }))
input.layout = input
	.layout
	.map(row => {
		return row
			.map(key => {
				return "[4D:"
					+ key
						.map(char => {
							return typeof char === "string"
								? (
									char !== "_"
										? uni[char]
										?? char
											.split("_")
											.map(i => uni[i] ?? i)
											.join("_")
											.replace(/^.*$/, m => {
												Object
													.entries(diacritics)
													.forEach(([k, v]) => {
														m = m.replace(
															new RegExp(`(\w+)?_?${k}`, "g"),
															`$1${v}`
														)
													})
												return m
											})
										: char
								)
								: null
						})
						.filter(k => (
							Boolean(k)
						))
						.join("")
					+ "]"
					+ "[]"
						.repeat(key[0] - 1)
			})
			.join("")
	})
fs.writeFileSync(outputFile, JSON.stringify(
	{
		title: input.title,
		onScreen: {
			main: input.layout
		}
	},
	null,
	"\t"
))