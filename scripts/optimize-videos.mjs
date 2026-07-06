#!/usr/bin/env node
/**
 * Opt-in project-video optimizer. Mirrors the old Astro site's external ffmpeg
 * workflow but codifies it. Dependency-light on purpose: spawns the system
 * `ffmpeg` (must be on PATH) rather than adding an npm package.
 *
 * Usage:  pnpm optimize:video            (process every raw input)
 *         pnpm optimize:video --force    (re-encode even if outputs exist)
 *
 * Input:  src/assets/portfolio/*.src.{mp4,mov,webm}   (a `.src.` marker = "raw, please optimize")
 * Output: <name>.mp4  (H.264, faststart)   — universal fallback
 *         <name>.webm (VP9)                 — small, modern browsers / Safari 16+
 *         <name>.jpg  (poster frame)        — avoids the grey box while loading
 *
 * Embed the results with the projectVideo shortcode, e.g.
 *   {% projectVideo "/assets/portfolio/homepage.mp4", "Alt",
 *                   webm="/assets/portfolio/homepage.webm",
 *                   poster="/assets/portfolio/homepage.jpg" %}
 */
import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'src', 'assets', 'portfolio');
const FORCE = process.argv.includes('--force');

function hasFfmpeg() {
  const probe = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  return !probe.error && probe.status === 0;
}

function run(args) {
  const res = spawnSync('ffmpeg', args, { stdio: 'inherit' });
  if (res.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`);
}

if (!existsSync(DIR)) {
  console.log(`No portfolio dir at ${DIR} — nothing to do.`);
  process.exit(0);
}

const inputs = readdirSync(DIR).filter((f) => /\.src\.(mp4|mov|webm)$/i.test(f));
if (inputs.length === 0) {
  console.log('No raw *.src.{mp4,mov,webm} inputs found — nothing to optimize.');
  process.exit(0);
}

if (!hasFfmpeg()) {
  console.error('ffmpeg not found on PATH. Install it (e.g. `brew install ffmpeg`) and retry.');
  process.exit(1);
}

for (const file of inputs) {
  const name = file.replace(/\.src\.[^.]+$/i, '');
  const input = join(DIR, file);
  const mp4 = join(DIR, `${name}.mp4`);
  const webm = join(DIR, `${name}.webm`);
  const poster = join(DIR, `${name}.jpg`);

  console.log(`\n▶ ${file}`);

  if (FORCE || !existsSync(mp4)) {
    console.log('  → mp4 (H.264)');
    run(['-y', '-i', input, '-c:v', 'libx264', '-crf', '24', '-preset', 'slow',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4]);
  } else console.log('  → mp4 exists (skip, use --force to redo)');

  if (FORCE || !existsSync(webm)) {
    console.log('  → webm (VP9)');
    run(['-y', '-i', input, '-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0',
      '-row-mt', '1', '-an', webm]);
  } else console.log('  → webm exists (skip)');

  if (FORCE || !existsSync(poster)) {
    console.log('  → poster (jpg)');
    run(['-y', '-ss', '0.1', '-i', input, '-frames:v', '1', '-q:v', '3', '-update', '1', poster]);
  } else console.log('  → poster exists (skip)');
}

console.log('\nDone.');
