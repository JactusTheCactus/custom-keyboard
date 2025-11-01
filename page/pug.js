#!/usr/bin/env node
import fs from "fs";
import pug from "pug";
fs.writeFileSync("index.html", pug.renderFile("page/index.pug"));
//# sourceMappingURL=pug.js.map