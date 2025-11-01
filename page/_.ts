(async () => {
	function FMT(strIn: string) {
		return (strIn || "")
			.replace(/\[(.*?)\]/g, (_, m) => {
				const ctrl = "CTRL+"
				let cmd
				switch (m) {
					case "ALL": cmd = "A"; break
					case "COPY": cmd = "C"; break
					case "PASTE": cmd = "V"; break
					case "CUT": cmd = "X"; break
					case "REDO": cmd = "Y"; break
					case "UNDO": cmd = "Z"; break
					default: return _
				}
				return [
					"CTRL",
					cmd
				]
					.join("+")
			})
			.replace(
				new RegExp(`[${[
					[0x0300, 0x0308],
					[0x030A, 0x030C],
					0x030F,
					0x0311,
					[0x0323, 0x0328],
					0x0332
				]
					.map((d: number | Array<number>) => {
						switch (typeof d) {
							case "number":
								return String.fromCodePoint(d)
							case "object":
								return d
									.map(D => String.fromCodePoint(D))
									.join("-")
						}
					})
					.join("")}]`
					, "g"),
				m => `\u25CC${m}`
			)
			.replace(
				/([a-z])\u25CC/gi,
				"$1"
			)
	}
	const keyboards = JSON.parse(
		await (
			await fetch("data.json")
		).text()
	)
	keyboards.forEach((data: Record<string, any>) => {
		const title = document.createElement("th")
		title.innerText = data.title ?? "N/A"
		data.layout.forEach((row: []) => {
			if (row.length > title.colSpan || !title.colSpan) {
				title.colSpan = row.length
			}
		})
		const titleRow = document.createElement("tr")
		titleRow.appendChild(title)
		const keyboard = document.createElement("table")
		keyboard.appendChild(titleRow)
		data.layout.forEach((r: Array<any>) => {
			const row = document.createElement("tr")
			r.forEach((k: any) => {
				const key = document.createElement("td")
				key.colSpan = k[0]
				key.classList.add("key")
				const chars = k[1]
				switch (typeof chars) {
					case "string":
						key.classList.add("tap")
						key.innerHTML = [
							"<b>",
							FMT(chars),
							"</b>"
						]
							.join("")
						break
					case "object": {
						if (Array.isArray(chars)) {
							key.classList.add("hold")
							key.innerHTML = chars.map(c => {
								return [
									c === chars[0]
										? "<b>"
										: "",
									FMT(c),
									c === chars[0]
										? "</b>"
										: ""
								].join("")
							}).join(" ")
						} else {
							key.classList.add("flick")
							key.innerHTML = `<table>${[
								["nw", "n", "ne"],
								["w", "c", "e"],
								["sw", "s", "se"]
							]
								.map(a => `<tr>${a
									.map(b => [
										"<td>",
										b === "c"
											? "<b>"
											: "",
										FMT(chars[b] ?? null),
										b === "c"
											? "</b>"
											: "",
										"<td>"
									]
										.join(""))
											.join("")
								}</tr>`)
									.join("")
							}</table>`
						}
					} break
					default: JSON.stringify(chars) ?? chars
				}
				key.innerHTML=`<abbr title="${String(key.classList).replace(/^key\s*/,"")}">${key.innerHTML}</abbr>`
				row.appendChild(key)
			})
			keyboard.appendChild(row)
		})
		document.body.appendChild(keyboard)
	})
})()