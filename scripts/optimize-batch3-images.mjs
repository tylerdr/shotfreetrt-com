// One-time conversion of the approved batch3 illustration masters into
// responsive WebP derivatives for public/media/. Resizing and format
// conversion only — no cropping, background removal, or other editing. The
// source PNGs carry real alpha (transparent background, subject cut out);
// this script preserves that alpha in the WebP output rather than
// flattening it onto a color. The warm-bone mounting surface these sit on
// is applied in CSS at each placement, not baked into the image.
// Masters are kept outside the repo at outputs/shotfreetrt-assets/batch3/.
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SRC_DIR = path.resolve(
  __dirname,
  "../../../outputs/shotfreetrt-assets/batch3"
);
const OUT_DIR = path.resolve(__dirname, "../public/media");

// 05 (botanical cards/shell) omitted per instruction — not TRT-relevant.
const FILES = ["01", "02", "03", "04", "06", "07", "08", "09", "10"];

for (const id of FILES) {
  const inputPath = path.join(SRC_DIR, `sft-web-batch3-${id}.png`);
  const outputPath = path.join(OUT_DIR, `sft-web-batch3-${id}.webp`);
  const info = await sharp(inputPath)
    .resize({ width: 960, height: 640, fit: "cover" })
    .webp({ quality: 80, alphaQuality: 100 })
    .toFile(outputPath);
  console.log(
    `sft-web-batch3-${id}.webp`,
    `${info.width}x${info.height}`,
    `${(info.size / 1024).toFixed(1)}KB`
  );
}
