/**
 * Converts source artwork into web-ready WebP files.
 *
 *   node scripts/optimize-images.cjs [srcDir] [outDir]
 *
 * Defaults: assets/artwork -> public/work/posters
 * Drop new PNG/JPGs into the source folder, run this, then add an entry in content/site.ts.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = process.argv[2] || 'assets/artwork';
const out = process.argv[3] || 'public/work/posters';
const slug = (s) =>
  s
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

(async () => {
  fs.mkdirSync(out, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    if (!/\.(png|jpe?g|webp)$/i.test(file)) continue;
    const target = path.join(out, `${slug(file)}.webp`);
    await sharp(path.join(src, file))
      .rotate()
      .resize({ width: 1400, height: 1800, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(target);
    const meta = await sharp(target).metadata();
    const kb = Math.round(fs.statSync(target).size / 1024);
    console.log(`${slug(file)}  ${meta.width}x${meta.height}  ${kb}KB`);
  }
})();
