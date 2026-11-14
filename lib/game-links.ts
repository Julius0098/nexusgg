import { gamePlanSlug } from './game-hubs.ts';
import type { Game } from './catalog.ts';

const extras: Record<string,string[]> = {
  'counter-strike-2':['mouse-dpi-match','aspect-ratio-compare','edpi','reaction-time-test'],
  valorant:['valorant-rank-progression','reaction-time-test','cps-test'],
  fortnite:['fortnite-sensitivity','fov-converter','session-timer'],
  minecraft:['resource-calculator','time-to-goal'],
  roblox:['roblox-marketplace-fee'],
};

export function toolSlugsFor(game: Game) {
  return [gamePlanSlug(game.slug),...(extras[game.slug] ?? []),...game.tools];
}

export const featuredGames = ['fortnite','counter-strike-2','valorant','minecraft','roblox','rocket-league'];
