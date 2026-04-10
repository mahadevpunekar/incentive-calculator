import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Next.js builds into `.next/` (not `dist/` or `build/`). After standalone
 * prep, mirror that bundle to `dist/` so it’s easy to spot in the file tree.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");
const dist = path.join(root, "dist");

if (!fs.existsSync(standalone)) {
  console.error(
    "pack-dist: missing .next/standalone — run `npm run build` from frontend (or repo root) first"
  );
  process.exit(1);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(standalone, dist, { recursive: true });
console.log("pack-dist: deployment bundle → frontend/dist/ (run: node dist/server.js)");
