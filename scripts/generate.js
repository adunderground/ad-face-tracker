// generates a video from images in ./out directory

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// CONFIG
const FPS = 60;
const IMAGES_DIR = path.resolve('./out');
const OUTPUT_VIDEO = path.resolve('./out10.mp4');

function parseCoords(filename) {
  const match = filename.match(/px(m?\d+p\d+)_py(m?\d+p\d+)/);

  if (!match) {
    throw new Error(`Invalid filename format: ${filename}`);
  }

  const parse = (v) =>
    parseFloat(v.replace('m', '-').replace('p', '.'));

  return {
    x: parse(match[1]),
    y: parse(match[2]),
  };
}

async function generateVideo() {
  if (!fs.existsSync(IMAGES_DIR)) {
    throw new Error(`Directory not found: ${IMAGES_DIR}`);
  }

  const images = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort((a, b) => {
      const A = parseCoords(a);
      const B = parseCoords(b);

      // 1️⃣ Y: top → bottom (descending)
      if (A.y !== B.y) {
        return B.y - A.y;
      }

      // 2️⃣ X: right → left (descending)
      return B.x - A.x;
    });

  console.log('images', images);

  if (images.length === 0) {
    throw new Error('No images found in ./out');
  }

  const concatFile = path.join(IMAGES_DIR, 'concat.txt');

  const concatContent = images
    .map((img) => `file '${path.join(IMAGES_DIR, img)}'`)
    .join('\n');

  fs.writeFileSync(concatFile, concatContent);

  const command = `
    ffmpeg -y \
    -f concat \
    -safe 0 \
    -r ${FPS} \
    -i "${concatFile}" \
    -c:v libx264 \
    -preset slow \
    -crf 23 \
    -pix_fmt yuv420p \
    "${OUTPUT_VIDEO}"
  `;

  try {
    await execAsync(command);
    console.log(`Video generated: ${OUTPUT_VIDEO}`);
  } finally {
    fs.unlinkSync(concatFile);
  }
}

await generateVideo();
