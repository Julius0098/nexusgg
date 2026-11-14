import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';
import { games } from '../lib/catalog.ts';

const audit = readFileSync(new URL('../GAME_LOGOS.md', import.meta.url), 'utf8');
const [integrated, fallbacks] = audit.split('## Fallbacks');
const auditNames = (section) => section.split('\n').filter(line => /^\| [^ -]/.test(line))
  .map(line => line.split('|')[1].trim()).filter(name => name !== 'Game');

test('the logo audit accounts for every catalog entry exactly once', () => {
  const registered = games.filter(game => game.logo).map(game => game.title).sort();
  const missing = games.filter(game => game.logo === null).map(game => game.title).sort();
  assert.equal(registered.length + missing.length, 50);
  assert.deepEqual(auditNames(integrated).sort(), registered);
  assert.deepEqual(auditNames(fallbacks).sort(), missing);
});

test('all mapped game logos are local, decodable and retain their proportions', async () => {
  const sources = new Set();
  for (const { slug, logo } of games) {
    if (!logo) continue;
    assert.ok(logo.source.startsWith('https://'), slug);
    assert.ok(logo.credit, slug);
    assert.ok(!sources.has(logo.small), slug);
    sources.add(logo.small);
    for (const location of new Set([logo.small, logo.large])) {
      assert.ok(location.startsWith('/games/' + slug + '/'), slug);
      const file = new URL('../public' + location, import.meta.url);
      assert.ok(existsSync(file), location);
      const image = sharp(file.pathname);
      const { width, height, format } = await image.metadata();
      assert.equal(format, 'webp', location);
      assert.ok(width >= 30 && height >= 20, location);
      await image.raw().toBuffer();
    }
    const small = await sharp(new URL('../public' + logo.small, import.meta.url).pathname).metadata();
    const large = await sharp(new URL('../public' + logo.large, import.meta.url).pathname).metadata();
    assert.ok(large.width >= small.width && large.height >= small.height, slug);
    assert.ok(Math.abs(small.width * large.height - large.width * small.height) <= large.width, slug);
  }
});
