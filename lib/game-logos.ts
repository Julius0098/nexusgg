export type GameLogoAsset = {
  small: string;
  large: string;
  source: string;
  credit: string;
  backdrop?: 'light' | 'dark';
  license?: string;
};

function logo(slug: string, source: string, credit: string, backdrop?: GameLogoAsset['backdrop']): GameLogoAsset {
  const folder = '/games/' + slug;
  return { small: folder + '/logo.webp', large: folder + '/logo-large.webp', source, credit, backdrop };
}

const originals: Partial<Record<string, GameLogoAsset>> = {
  'counter-strike-2': logo('counter-strike-2', 'https://commons.wikimedia.org/wiki/File:Counter-Strike_2_logo.svg', 'Valve · Counter-Strike 2 wordmark', 'light'),
  'apex-legends': logo('apex-legends', 'https://www.ea.com/games/apex-legends/apex-legends/features', 'EA and Respawn · Apex Legends wordmark', 'dark'),
  'rainbow-six-siege': logo('rainbow-six-siege', 'https://www.ubisoft.com/en-us/game/rainbow-six/siege', 'Ubisoft · Rainbow Six Siege wordmark', 'dark'),
  'overwatch-2': logo('overwatch-2', 'https://commons.wikimedia.org/wiki/File:Overwatch_2_logo.svg', 'Blizzard · Overwatch 2 wordmark', 'light'),
  'the-finals': logo('the-finals', 'https://www.reachthefinals.com/content-creators', 'Embark Studios · THE FINALS creator assets', 'dark'),
  'marvel-rivals': logo('marvel-rivals', 'https://commons.wikimedia.org/wiki/File:Logo_Marvel_Rivals.png', 'Marvel and NetEase · Marvel Rivals wordmark', 'light'),
  'battlefield-2042': logo('battlefield-2042', 'https://www.ea.com/games/battlefield/battlefield-2042', 'EA and DICE · Battlefield 2042 wordmark', 'dark'),
  'team-fortress-2': logo('team-fortress-2', 'https://commons.wikimedia.org/wiki/File:Team-Fortress-2-logo.png', 'Valve · Team Fortress 2 wordmark', 'dark'),
  rust: logo('rust', 'https://facepunch.com/games/rust', 'Facepunch · Rust press kit'),
  valheim: logo('valheim', 'https://valheim.com/press/', 'Iron Gate · Valheim press kit', 'dark'),
  'sons-of-the-forest': logo('sons-of-the-forest', 'https://commons.wikimedia.org/wiki/File:Sons_of_the_Forest_logo.jpg', 'Endnight Games · Sons of the Forest wordmark', 'dark'),
  'red-dead-redemption-2': logo('red-dead-redemption-2', 'https://commons.wikimedia.org/wiki/File:Red_Dead_Redemption_2_Logo.png', 'Rockstar Games · Red Dead Redemption 2 wordmark', 'dark'),
  'elden-ring': logo('elden-ring', 'https://commons.wikimedia.org/wiki/File:Elden_Ring_logo_black.svg', 'FromSoftware and Bandai Namco · Elden Ring wordmark', 'light'),
  'genshin-impact': logo('genshin-impact', 'https://commons.wikimedia.org/wiki/File:Genshin_Impact_wordmark.svg', 'HoYoverse · Genshin Impact wordmark', 'light'),
  'dota-2': logo('dota-2', 'https://commons.wikimedia.org/wiki/File:Dota_logo.svg', 'Valve · Dota 2 wordmark', 'light'),
  'dead-by-daylight': logo('dead-by-daylight', 'https://commons.wikimedia.org/wiki/File:Dead_by_Daylight_Logo.png', 'Behaviour Interactive · Dead by Daylight wordmark', 'dark'),
  'ea-sports-fc': logo('ea-sports-fc', 'https://commons.wikimedia.org/wiki/File:EA_Sports_FC_logo.svg', 'Electronic Arts · EA Sports FC brand mark', 'light'),
  'assetto-corsa-competizione': {
    ...logo('assetto-corsa-competizione', 'https://commons.wikimedia.org/wiki/File:Assetto_Corsa_Competizione.png', 'Kunos Simulazioni · resized to WebP', 'dark'),
    license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  'nba-2k': logo('nba-2k', 'https://commons.wikimedia.org/wiki/File:NBA_2K_logo_white_(SGDB_65098).png', '2K and Visual Concepts · NBA 2K wordmark', 'dark'),
};

const existing: Partial<Record<string, [string, string]>> = {
  'brawl-stars': ['https://supercell.com/en/games/brawlstars/', 'Supercell · Brawl Stars logo'],
  'clash-of-clans': ['https://supercell.com/en/games/clashofclans/', 'Supercell · Clash of Clans logo'],
  'clash-royale': ['https://supercell.com/en/games/clashroyale/', 'Supercell · Clash Royale logo'],
  'euro-truck-simulator-2': ['https://www.scssoft.com/press/sheet?p=euro_truck_simulator_2', 'SCS Software · Euro Truck Simulator 2 editorial logo'],
};

export function getGameLogo(slug: string): GameLogoAsset | null {
  if (originals[slug]) return originals[slug];
  const published = existing[slug];
  if (!published) return null;
  const tile = '/games/' + slug + '/tile.webp';
  return { small: tile, large: tile, source: published[0], credit: published[1] };
}
