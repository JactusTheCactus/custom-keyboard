(async () => {
    function FMT(strIn) {
        return (strIn || "")
            .replace(/\[(.*?)\]/g, (_, m) => {
            function cmd(strIn) {
                return [
                    "CTRL",
                    strIn
                ]
                    .join("+");
            }
            switch (m) {
                case "ALL": return cmd("A");
                case "COPY": return String.fromCodePoint(0x2FFB);
                case "PASTE": return String.fromCodePoint(0x1F4CB);
                case "CUT": return String.fromCodePoint(0x2702);
                case "REDO": return String.fromCodePoint(0x21B7);
                case "UNDO": return String.fromCodePoint(0x21B6);
                case "LB": return "[";
                case "RB": return "]";
                case "LEFT": return String.fromCodePoint(0x2190);
                case "UP": return String.fromCodePoint(0x2191);
                case "RIGHT": return String.fromCodePoint(0x2192);
                case "DOWN": return String.fromCodePoint(0x2193);
                default: return _;
            }
        })
            .replace(new RegExp(`[${[
            [0x0300, 0x0308],
            [0x030A, 0x030C],
            0x030F,
            0x0311,
            [0x0323, 0x0328],
            0x0332
        ]
            .map((d) => {
            switch (typeof d) {
                case "number":
                    return String.fromCodePoint(d);
                case "object":
                    return d
                        .map(D => String.fromCodePoint(D))
                        .join("-");
            }
        })
            .join("")}]`, "g"), m => `\u25CC${m}`)
            .replace(/([a-z])\u25CC/gi, "$1");
    }
    const keyboards = JSON.parse(await (await fetch("data.json")).text());
    keyboards.forEach((data) => {
        const title = document.createElement("th");
        title.innerText = data.title ?? "N/A";
        data.layout.forEach((row) => {
            if (row.length > title.colSpan || !title.colSpan) {
                title.colSpan = row.length;
            }
        });
        const titleRow = document.createElement("tr");
        titleRow.appendChild(title);
        const keyboard = document.createElement("table");
        keyboard.appendChild(titleRow);
        data.layout.forEach((r) => {
            const row = document.createElement("tr");
            r.forEach((k) => {
                const key = document.createElement("td");
                key.colSpan = k[0];
                key.classList.add("key");
                const chars = k[1];
                switch (typeof chars) {
                    case "string":
                        key.classList.add("tap");
                        key.innerHTML = [
                            "<b>",
                            FMT(chars),
                            "</b>"
                        ]
                            .join("");
                        break;
                    case "object":
                        {
                            if (Array.isArray(chars)) {
                                key.classList.add("hold");
                                key.innerHTML = chars.map(c => {
                                    return [
                                        c === chars[0]
                                            ? "<b>"
                                            : "",
                                        FMT(c),
                                        c === chars[0]
                                            ? "</b>"
                                            : ""
                                    ].join("");
                                }).join(" ");
                            }
                            else {
                                key.classList.add("flick");
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
                                    .join("")}</tr>`)
                                    .join("")}</table>`;
                            }
                        }
                        break;
                    default: JSON.stringify(chars) ?? chars;
                }
                key.innerHTML = `<abbr title="${String(key.classList).replace(/^key\s*/, "")}">${key.innerHTML}</abbr>`;
                row.appendChild(key);
            });
            keyboard.appendChild(row);
        });
        document.body.appendChild(keyboard);
    });
})();
export {};
//# sourceMappingURL=_.js.map