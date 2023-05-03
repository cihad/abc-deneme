import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const astroFile = path.resolve("node_modules/astro/astro.js");

const scriptContents = fs.readFileSync(astroFile).toString();

const searchQuery = "'use strict';\n";
const sliceIndex = scriptContents.indexOf(searchQuery) + searchQuery.length;

const importStr = `import "${__dirname}/override-fs.js";`

if (!scriptContents.includes(importStr)) {
  const overridedAstro = [
    scriptContents.slice(0, sliceIndex),
    importStr,
    scriptContents.slice(sliceIndex)
  ].join("\n");
  
  fs.writeFileSync(astroFile, overridedAstro);
}


