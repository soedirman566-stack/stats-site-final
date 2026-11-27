// Nusantara in Numbers — entrypoint.
// Hands the entry in: copies app/ and screenshots/ from this repository into
// the output directory and writes /output/dossier.json with buildDossier
// from vendor/makefun-frontend.ts. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output. Standard library only; never deletes the output
// directory — it only creates folders inside it and copies files in.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000
};

function copyInto(name) {
  const src = join(REPO_ROOT, name);
  if (!existsSync(src)) return;
  mkdirSync(join(OUTPUT_DIR, name), { recursive: true });
  cpSync(src, join(OUTPUT_DIR, name), { recursive: true });
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyInto('app');
copyInto('screenshots');
const dossier = buildDossier(OUTPUT_DIR, CAPS);
writeFileSync(join(OUTPUT_DIR, 'dossier.json'), dossier);
console.log('wrote dossier.json (' + dossier.length + ' bytes) to ' + OUTPUT_DIR);
