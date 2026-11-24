#!/usr/bin/env node
/**
 * Regenerates the ASCII font subset used by the site.
 *
 * Ascii art only lines up if every glyph — letters, spaces and box-drawing
 * characters — advances by exactly the same width and comes from the same
 * font. Google's "latin" slice of JetBrains Mono drops the box-drawing block,
 * so we subset the full font ourselves and strip ligatures.
 *
 * Requirements: fonttools + brotli  (pip install fonttools brotli)
 *
 * Usage:
 *   node scripts/generate-ascii.mjs /path/to/jetbrainsmono.ttf
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/generate-ascii.mjs <JetBrainsMono-Regular.ttf>');
  process.exit(1);
}

const out = resolve('website/public/fonts/jetbrains-mono-ascii.woff2');
mkdirSync(dirname(out), { recursive: true });

const extra = '─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬█▀▄▌▐░▒▓·•→←↑↓–—‘’“”…×≈≤≥°±';
const unicodes = [
  'U+0020-007E', // printable ASCII
  'U+00A0', // nbsp
  'U+00B7',
  ...[...extra].map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`),
].join(',');

execFileSync(
  'pyftsubset',
  [
    src,
    `--output-file=${out}`,
    '--flavor=woff2',
    `--unicodes=${unicodes}`,
    '--layout-features=*',
    '--name-IDs=*',
    '--notdef-outline',
  ],
  { stdio: 'inherit' },
);

console.log(`wrote ${out}`);
