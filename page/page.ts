const debug: Boolean = (
	await import("../config.json", { with: { type: "json" } })
).default.debug;
(async () => {
	function FMT(strIn: string) {
		return (strIn || "")
			.replace(/\[(.*?)\]/g, (_: string, m: string) => {
				const point = {
					ALL: 0x26f6,
					COPY: 0x2398,
					PASTE: 0x29c9,
					CUT: 0x2702,
					REDO: 0x21b7,
					UNDO: 0x21b6,
					LB: 0x5b,
					RB: 0x5d,
					LEFT: 0x2190,
					UP: 0x2191,
					RIGHT: 0x2192,
					DOWN: 0x2193,
					TAB: 0x21e5,
					ENTER: 0x21b2,
					SHIFT: 0x21d1,
					DEL: 0x232b,
					SPACE: 0x2423,
				}[m];
				return point
					? String.fromCodePoint(point)
					: `<code>|-${m}-|</code>`;
			})
			.replace(
				new RegExp(
					`[${[0x0300, 0x0332]
						.map((d) => String.fromCodePoint(d))
						.join("-")}]`,
					"g"
				),
				(m) => `\u25CC${m}`
			)
			.replace(/(.)\u25CC/gu, "$1");
	}
	const keyboards: [
		| { title: string }
		| {
				layout: [
					number,
					(
						| string
						| string[]
						| {
								[i in
									| "c"
									| "n"
									| "s"
									| "e"
									| "w"
									| "nw"
									| "ne"
									| "sw"
									| "se"]: string;
						  }
					)
				];
		  }
	] = JSON.parse(await (await fetch("data.json")).text());
	if (debug) {
		keyboards.shift();
		keyboards.pop();
	}
	keyboards.forEach((data: Record<string, any>) => {
		const title = document.createElement("th");
		title.innerText = data["title"] ?? "N/A";
		data["layout"].forEach((row: []) => {
			if (row.length > title.colSpan || !title.colSpan) {
				title.colSpan = row.length;
			}
		});
		const titleRow = document.createElement("tr");
		titleRow.appendChild(title);
		const keyboard = document.createElement("table");
		keyboard.appendChild(titleRow);
		data["layout"].forEach((r: any[]) => {
			const row = document.createElement("tr");
			r.forEach((k: any) => {
				const key = document.createElement("td");
				key.colSpan = k[0];
				key.classList.add("key");
				const chars = k[1];
				switch (typeof chars) {
					case "string":
						key.classList.add("tap");
						key.innerHTML = ["<b>", FMT(chars), "</b>"].join("");
						break;
					case "object":
						{
							if (Array.isArray(chars)) {
								key.classList.add("hold");
								key.innerHTML = chars
									.map(
										(c) =>
											`<${
												c === chars[0] ? "b" : "span"
											}>` +
											FMT(c) +
											`</${
												c === chars[0] ? "b" : "span"
											}>`
									)
									.join(" ");
							} else {
								key.classList.add("flick");
								key.innerHTML =
									"<table>" +
									[
										["nw", "n", "ne"],
										["w", "c", "e"],
										["sw", "s", "se"],
									]
										.map(
											(a) =>
												"<tr>" +
												a
													.map(
														(b) =>
															"<td>" +
															`<${
																b === "c"
																	? "b"
																	: "span"
															}>` +
															FMT(
																chars[b] ?? null
															) +
															`</${
																b === "c"
																	? "b"
																	: "span"
															}>` +
															"<td>"
													)
													.join("") +
												"</tr>"
										)
										.join("") +
									"</table>";
							}
						}
						break;
					default:
						key.innerText = JSON.stringify(chars) ?? chars;
				}
				key.innerHTML =
					'<abbr title="' +
					String(key.classList).replace(/^key\s*/, "") +
					`\">${key.innerHTML}</abbr>`;
				row.appendChild(key);
			});
			keyboard.appendChild(row);
		});
		document.body.appendChild(keyboard);
	});
})();
