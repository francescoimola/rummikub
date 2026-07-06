/**
 * Lossless recompression of src/assets/ images.
 *   PNG: max-effort DEFLATE (pixel-identical).
 *   JPEG: mozjpeg q=95, 4:4:4 chroma (near-lossless).
 *   Idempotent: only overwrites when the new file is smaller.
 *
 * Usage: pnpm compress:assets
 */

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../src/assets",
);

const EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function* walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(p);
        else yield p;
    }
}

const kb = (n) => (n / 1024).toFixed(1) + " KB";

let totalBefore = 0;
let totalAfter = 0;
let compressed = 0;
let skipped = 0;
let errored = 0;

for await (const file of walk(ROOT)) {
    const ext = path.extname(file).toLowerCase();
    if (!EXTS.has(ext)) continue;

    const before = (await fs.stat(file)).size;
    totalBefore += before;

    try {
        let buffer;
        if (ext === ".png") {
            // Truly lossless: max DEFLATE effort, no palette/bit-depth changes.
            buffer = await sharp(file, { failOn: "none" })
                .png({
                    compressionLevel: 9,
                    effort: 10,
                    palette: false,
                    adaptiveFiltering: true,
                })
                .toBuffer();
        } else {
            // Near-lossless: mozjpeg q=95, 4:4:4 chroma, no subsampling — preserves sharp text, edges, and saturated colour.
            buffer = await sharp(file, { failOn: "none" })
                .jpeg({
                    mozjpeg: true,
                    quality: 95,
                    chromaSubsampling: "4:4:4",
                    trellisQuantisation: true,
                    overshootDeringing: true,
                    optimiseScans: true,
                })
                .toBuffer();
        }

        if (buffer.length < before) {
            await fs.writeFile(file, buffer);
            totalAfter += buffer.length;
            compressed++;
            const saved = (((before - buffer.length) / before) * 100).toFixed(1);
            console.log(
                `  ${path.relative(ROOT, file)}  ${kb(before)} → ${kb(buffer.length)}  (-${saved}%)`,
            );
        } else {
            totalAfter += before;
            skipped++;
        }
    } catch (err) {
        totalAfter += before;
        errored++;
        console.error(`  ! ${path.relative(ROOT, file)} — ${err.message}`);
    }
}

const savedBytes = totalBefore - totalAfter;
const savedPct = totalBefore
    ? ((savedBytes / totalBefore) * 100).toFixed(1)
    : "0";

console.log("");
console.log(
    `${compressed} compressed · ${skipped} already optimal · ${errored} errored`,
);
console.log(
    `Total: ${kb(totalBefore)} → ${kb(totalAfter)}  (saved ${kb(savedBytes)}, -${savedPct}%)`,
);
