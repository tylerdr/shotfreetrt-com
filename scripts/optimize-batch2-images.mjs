// One-time conversion of the approved batch2 illustration masters into
// responsive WebP derivatives for public/media/. Resizing and format
// conversion only — no cropping, background removal, or other editing.
// Masters are kept outside the repo at outputs/shotfreetrt-assets/batch2/.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.resolve(
  __dirname,
  "../../../outputs/shotfreetrt-assets/batch2"
);
const OUT_DIR = path.resolve(__dirname, "../public/media");

const FILES = ["01", "02", "04", "05", "06", "08", "09"];

for (const id of FILES) {
  const inputPath = path.join(SRC_DIR, `sft-web-batch2-${id}.png`);
  const outputPath = path.join(OUT_DIR, `sft-web-batch2-${id}.webp`);
  const info = await sharp(inputPath)
    .resize({ width: 960, height: 640, fit: "cover" })
    .webp({ quality: 75 })
    .toFile(outputPath);
  console.log(
    `sft-web-batch2-${id}.webp`,
    `${info.width}x${info.height}`,
    `${(info.size / 1024).toFixed(1)}KB`
  );
}
