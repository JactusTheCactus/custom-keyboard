import fs from "fs";
import YAML from "js-yaml";
type Char = string;
type CharObjKey = "c" | "w" | "n" | "e" | "s" | "nw" | "ne" | "se" | "sw";
type CharObj = { [K in CharObjKey]: Char };
type Key = [number, ...(Char | CharObj)[]];
type Row = Key[];
type Keyboard = Row[];
function capitalize(str: string, strict = false) {
	return (
		str[0]!.toUpperCase() +
		(strict ? str.slice(1).toLowerCase() : str.slice(1))
	);
}
const uni = YAML.load(fs.readFileSync("uni.yml", { encoding: "utf-8" })) as {
	[s in string]: string;
};
const diacritics = YAML.load(
	fs.readFileSync("diacritics.yml", { encoding: "utf-8" })
) as {
	[s in string]: string;
};
const args = process.argv.filter((i) => !/node|\.js$/.test(i));
const inputFile = ["data", [args[0], "yml"].join(".")].join("/");
const outputFile = ["layouts", [args[0], "json"].join(".")].join("/");
const input = YAML.load(fs.readFileSync(inputFile, { encoding: "utf-8" })) as {
	title: string;
	layout: Keyboard;
};
function menu(arrIn: Key): string {
	return `[XK:${arrIn.map((c) => char(c as Char)).join("")}]`;
}
function multi(strIn: Char): string {
	return `[MC:${strIn}]`;
}
function swipe(objIn: CharObj): string {
	return `[4D:${"c w n e s nw ne se sw"
		.split(/\s+/)
		.map((k) => char(objIn[k as CharObjKey]!) ?? " ")
		.join("")
		.replace(/\s*$/, "")}]`;
}
function char(charIn: Char): string {
	switch (typeof charIn) {
		case "string":
			if (
				charIn.length > 1 ||
				[
					...Object.keys(
						uni as {
							[s in string]: Char;
						}
					),
					...Object.keys(
						diacritics as {
							[s in string]: Char;
						}
					),
				].includes(charIn)
			) {
				const arrOut = charIn.split("_");
				if (arrOut.length > 1) {
					return multi(arrOut.map(char).join(""));
				} else {
					return uni[charIn] ?? diacritics[charIn] ?? multi(charIn);
				}
			} else {
				return charIn;
			}
		case "object":
			if (Array.isArray(charIn)) {
				return menu(charIn);
			} else {
				return swipe(charIn);
			}
	}
}
function key(keyIn: Key) {
	return (
		keyIn
			.map((c) => char(c as Char))
			.slice(1)
			.join("") + "[]".repeat(keyIn[0] - 1)
	);
}
function row(rowIn: Row) {
	return rowIn.map(key).join("");
}
function keyboard(boardIn: Keyboard) {
	return boardIn.map(row);
}
function titleFMT(titleIn: string) {
	const titleOut = titleIn.replace(/\{(.*?)\}/g, (_, m) => {
		return m
			.split("_")
			.map((c: string) => {
				return uni[c] ?? diacritics[c] ?? c;
			})
			.join("");
	});
	return capitalize(titleOut, true);
}
function FMT(c: Char) {
	if (
		c.length > 1 ||
		[...Object.keys(uni), ...Object.keys(diacritics)].includes(c)
	) {
		const arrOut = c.split("_");
		if (arrOut.length > 1) {
			return multi(arrOut.map(char).join(""));
		} else {
			return uni[c] ?? diacritics[c] ?? multi(c);
		}
	} else {
		return c;
	}
}
function layoutFMT(layoutIn: Keyboard) {
	return layoutIn.map((r: Row) =>
		r.map((k: Key) =>
			(k as Char[]).map((c: Char | number | CharObj) => {
				switch (typeof c) {
					case "number":
						return c;
					case "string":
						return FMT(c);
					case "object": {
						if (Array.isArray(c)) {
							return c.map(FMT);
						} else {
							return Object.fromEntries(
								Object.entries(c).map(
									([k, v]: [string, string]) => [
										k,
										FMT(v).replace(
											/\[(?:MC):(.*?)\]/g,
											(_, m) => m
										),
									]
								)
							);
						}
					}
				}
			})
		)
	);
}
fs.writeFileSync(
	outputFile,
	JSON.stringify(
		{
			title: titleFMT(input.title),
			onScreen: {
				main: keyboard(input.layout),
			},
		},
		null,
		"\t"
	)
);
fs.writeFileSync(
	"data.json",
	JSON.stringify(
		[
			...JSON.parse(fs.readFileSync("data.json", { encoding: "utf-8" })),
			{
				title: titleFMT(input.title),
				layout: layoutFMT(input.layout),
			},
		],
		null,
		"\t"
	)
);
