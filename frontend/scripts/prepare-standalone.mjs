import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const nextDir = path.join(root, ".next");
const standalone = path.join(nextDir, "standalone");

if (!fs.existsSync(standalone)) {
  console.warn("prepare-standalone: .next/standalone missing, skipping");
  process.exit(0);
}

const staticSrc = path.join(nextDir, "static");
const staticDest = path.join(standalone, ".next", "static");
if (fs.existsSync(staticSrc)) {
  fs.mkdirSync(path.dirname(staticDest), { recursive: true });
  fs.cpSync(staticSrc, staticDest, { recursive: true });
}

const publicSrc = path.join(root, "public");
const publicDest = path.join(standalone, "public");
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
}

console.log(
  "prepare-standalone: copied .next/static and public → .next/standalone"
);
