import test from 'node:test';
import assert from 'node:assert/strict';
import { tools, getTool, validateTool } from '../lib/tools.ts';
import { xp, sensitivity, requiredWins, otherFov, anyDrop } from '../lib/math.ts';
import { games, guides } from '../lib/catalog.ts';
import { hubs, gamePlanSlug } from '../lib/game-hubs.ts';
import { toolSlugsFor } from '../lib/game-links.ts';

const cases = {
  'sensitivity-converter': '0.47169811',
  'nether-coordinates': 'X 100 / Z -50',
  'loot-probability': '40.126306%',
  'required-wins': '10 wins',
  'stack-calculator': '2 stacks + 22 items',
  'portal-coordinate-converter': 'X 800 / Z -400',
  'item-quantity': '3 ingredients',
  'minecraft-xp': '1,395 XP',
  'robux-value': '2.5 currency units',
  'gamepass-earnings': '1,400 Robux',
  'developer-revenue': '35 currency units',
  'kd-ratio': '1.5',
  'win-rate': '54%',
  'average-damage': '550 damage per interval',
  'headshot-percentage': '30%',
  'edpi': '320',
  'fov-converter': '58.715507°',
  'crafting-quantity': '48 ingredients',
  'resource-calculator': '300 left / 7 runs',
  'drop-chance': '2.5%',
  'level-progression': '700 XP',
  'time-to-goal': '8 hours',
  'currency-converter': '100 target units',
  'percentage-calculator': '36',
  'valorant-rank-progression': '2 wins',
  'fortnite-sensitivity': 'X 4% · Y 4% · ADS X 2% · Scope X 1.6%',
  'mouse-dpi-match': '1,200 DPI',
  'aspect-ratio-compare': '16:9 → 4:3 · 59.259259% of first pixel count',
  'roblox-marketplace-fee': '600 estimated Robux',
};

const modelResults = {
  match:'66.666667%', farm:'3 runs · 24 min', loot:'40.126306%',
  race:'90 s / lap · 0 s vs target · 15 min projected', budget:'170 used · 30 remaining',
  pace:'80 per hour · 1.5 hours remaining',
};
for (const game of games) cases[gamePlanSlug(game.slug)] = modelResults[hubs[game.slug].model];
assert.equal(Object.keys(cases).length, tools.filter(tool => tool.run).length);
for (const [slug, expected] of Object.entries(cases)) {
  test(slug + ' matches its worked example', () => {
    const tool = getTool(slug);
    assert.equal(validateTool(tool, tool.fields.map(field => field.initial)), expected);
  });
}

test('sensitivity conversion round-trips and preserves physical distance', () => {
  const old = sensitivity('Counter-Strike 2', 'Valorant', 800, 1.5);
  const back = sensitivity('Valorant', 'Counter-Strike 2', 800, old.converted);
  assert.ok(Math.abs(back.converted - 1.5) < 1e-12);
  assert.ok(Math.abs(back.cm - old.cm) < 1e-12);
  assert.ok(Math.abs(old.cm - 34.636363636) < 1e-8);
});

test('Minecraft XP is continuous across the formula ranges', () => {
  assert.deepEqual([0,16,17,30,31,32].map(xp), [0,352,394,1395,1507,1628]);
});

test('portal conversion accepts decimal results and rejects out-of-range targets', () => {
  assert.equal(validateTool(getTool('portal-coordinate-converter'), ['Overworld → Nether','-3','7']), 'X -0.375 / Z 0.875');
  assert.throws(() => validateTool(getTool('portal-coordinate-converter'), ['Nether → Overworld','4000000','0']), /world border/);
});

test('required wins handles reachability, precise rates, and a new record', () => {
  assert.equal(requiredWins(1, 3, 50), 1);
  assert.equal(requiredWins(7, 8, 87.5), 0);
  assert.equal(requiredWins(0, 0, 100), 1);
  assert.throws(() => requiredWins(7, 8, 100), /unreachable/);
  assert.equal(requiredWins(2, 5, 80), 10);
  assert.equal(requiredWins(0, 1, 99.99999), 9999999);
});

test('drop probability is stable for small odds and boundary cases', () => {
  assert.equal(anyDrop(100, 0), 0);
  assert.equal(anyDrop(100, 1), 100);
  assert.equal(anyDrop(0, 25), 0);
  assert.ok(Math.abs(anyDrop(1e-10, 1) - 1e-10) < 1e-19);
});

test('FOV round-trips across axes', () => {
  const vertical = otherFov(90,16,9,'Horizontal → vertical');
  assert.ok(Math.abs(otherFov(vertical,16,9,'Vertical → horizontal') - 90) < 1e-12);
});

test('validation rejects missing values, invalid options, and bad counts', () => {
  assert.throws(() => validateTool(getTool('win-rate'), ['', '1']), /Enter a number/);
  assert.throws(() => validateTool(getTool('win-rate'), ['0', '0']), /greater than zero/);
  assert.throws(() => validateTool(getTool('win-rate'), ['4', '3']), /at most/);
  assert.throws(() => validateTool(getTool('win-rate'), ['0.1', '3']), /whole number/);
  assert.throws(() => validateTool(getTool('kd-ratio'), ['-1', '1']), /between/);
  assert.throws(() => validateTool(getTool('fov-converter'), ['Diagonal','90','16','9']), /valid option/);
  assert.throws(() => validateTool(getTool('minecraft-xp'), ['5','3']), /at least/);
  assert.equal(validateTool(getTool('kd-ratio'), ['10', '0']), '∞ (zero deaths)');
  assert.equal(validateTool(getTool('win-rate'), ['0', '3']), '0%');
});

test('catalog lists exactly 50 unique games with working references', () => {
  assert.equal(games.length, 50);
  assert.equal(new Set(games.map(game => game.slug)).size, 50);
  assert.equal(new Set(games.map(game => game.tip)).size, 50);
  for (const game of games) {
    assert.ok(guides.some(guide => guide.slug === game.guide));
    for (const slug of toolSlugsFor(game)) assert.ok(getTool(slug), slug);
    assert.equal(new Set(toolSlugsFor(game)).size, toolSlugsFor(game).length);
    assert.ok(hubs[game.slug].question);
  }
  for (const guide of guides) assert.ok(getTool(guide.tool));
});
