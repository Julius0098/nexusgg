export type GameArtSource = {tile:string; cover:string; credit:string; url:string};

// Publisher-supplied files. Credit and original media terms are linked in the hubs.
export const gameArt:Record<string,GameArtSource> = {
  'euro-truck-simulator-2':{tile:'/games/euro-truck-simulator-2/tile.webp',cover:'/games/euro-truck-simulator-2/cover.webp',credit:'SCS Software editorial press kit',url:'https://www.scssoft.com/press/sheet?p=euro_truck_simulator_2'},
  'apex-legends':{tile:'/games/apex-legends/tile.webp',cover:'/games/apex-legends/cover.webp',credit:'Apex Legends artwork by EA',url:'https://www.ea.com/games/apex-legends/apex-legends/features'},
  'brawl-stars':{tile:'/games/brawl-stars/tile.webp',cover:'/games/brawl-stars/cover.webp',credit:'Supercell · Brawl Stars artwork',url:'https://supercell.com/en/games/brawlstars/'},
  'clash-of-clans':{tile:'/games/clash-of-clans/tile.webp',cover:'/games/clash-of-clans/cover.webp',credit:'Supercell · Clash of Clans artwork',url:'https://supercell.com/en/games/clashofclans/'},
  'clash-royale':{tile:'/games/clash-royale/tile.webp',cover:'/games/clash-royale/cover.webp',credit:'Supercell · Clash Royale artwork',url:'https://supercell.com/en/games/clashroyale/'},
  'the-finals':{tile:'/games/the-finals/tile.webp',cover:'/games/the-finals/cover.webp',credit:'Embark Studios · THE FINALS creator media',url:'https://www.reachthefinals.com/content-creators'},
  valheim:{tile:'/games/valheim/tile.webp',cover:'/games/valheim/cover.webp',credit:'Iron Gate · Valheim press and creator media',url:'https://valheim.com/press/'},
};
