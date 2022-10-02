import { promises as fs } from "fs";

const prefix = "export const sfx = ";

async function main() {
  const src = "dist/sfx.json";
  const dst = "dist/sfx.ts";
  const text = await fs.readFile(src, "utf8");
  console.log("text", text);
  await fs.writeFile(dst, prefix + text);
}

main();
