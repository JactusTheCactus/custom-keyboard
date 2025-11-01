import fs from "fs"
import pug from "pug"
fs.writeFileSync("index.html", pug.renderFile("page/index.pug"))