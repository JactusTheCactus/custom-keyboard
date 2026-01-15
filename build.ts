import fs from "fs";
import YAML from "js-yaml";
function capitalize(str: any, strict = false) {
	return (
		str[0].toUpperCase() +
		(strict ? str.slice(1).toLowerCase() : str.slice(1))
	);
}
const uni = YAML.load(
	fs.readFileSync("uni.yml", { encoding: "utf-8" })
) as Record<string, string>;
const diacritics = YAML.load(
	fs.readFileSync("diacritics.yml", { encoding: "utf-8" })
) as Record<string, string>;
const args = process.argv.filter((i) => !/node|\.js$/.test(i));
const inputFile = ["data", [args[0], "yml"].join(".")].join("/");
const outputFile = ["layouts", [args[0], "json"].join(".")].join("/");
const input = YAML.load(fs.readFileSync(inputFile, { encoding: "utf-8" })) as {
	title: string;
	layout: any;
};
function menu(arrIn: Array<string>): string {
	return `[XK:${arrIn.map(char).join("")}]`;
}
function multi(strIn: string): string {
	return `[MC:${strIn}]`;
}
function swipe(objIn: Record<string, string>): string {
	return `[4D:${"C W N E S NW NE SE SW"
		.split(/\s+/)
		.map(
			(k: string) =>
				char(objIn[k.toUpperCase()]!) ??
				char(objIn[k.toLowerCase()]!) ??
				" "
		)
		.join("")
		.replace(/\s*$/, "")}]`;
}
function char(charIn: string): string {
	switch (typeof charIn) {
		case "string":
			if (
				charIn.length > 1 ||
				[
					...Object.keys(uni as Record<string, string>),
					...Object.keys(diacritics as Record<string, string>),
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
function key(keyIn: Array<any>) {
	return keyIn.map(char).slice(1).join("") + "[]".repeat(keyIn[0] - 1);
}
function row(rowIn: Array<any>) {
	return rowIn.map(key).join("");
}
function keyboard(boardIn: Array<any>) {
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
function FMT(c: string) {
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
function layoutFMT(layoutIn: Array<Array<Array<Array<string>>>>) {
	return layoutIn.map((r) =>
		r.map((k) =>
			k.map((c) => {
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
									([k, v]: [string, any]) => [
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
