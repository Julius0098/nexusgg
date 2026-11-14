'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Blocks, Compass, Crosshair, Fish, Flag, Gamepad2, Globe, Mountain,
  Radar, Shield, Sprout, Star, Sword, Swords, Target, Trees, Trophy, Truck,
} from 'lucide-react';
import type { Game } from '../lib/catalog';

export type GameLogoData = Pick<Game, 'slug' | 'title' | 'genre' | 'logo'>;

const genreIcons = [Crosshair, Blocks, Swords, Shield, Flag];
const accents = ['cyan', 'green', 'violet', 'yellow', 'blue'];
const gameFallbacks: Partial<Record<string, typeof Gamepad2>> = {
  valorant: Target,
  fortnite: Compass,
  'call-of-duty-warzone': Radar,
  'call-of-duty-black-ops-6': Shield,
  'pubg-battlegrounds': Target,
  'escape-from-tarkov': Compass,
  'destiny-2': Star,
  minecraft: Blocks,
  'baldurs-gate-3': Sword,
  'league-of-legends': Shield,
  'teamfight-tactics': Gamepad2,
  roblox: Gamepad2,
  terraria: Sprout,
  'ark-survival-ascended': Mountain,
  palworld: Trees,
  '7-days-to-die': Shield,
  subnautica: Fish,
  'grand-theft-auto-v': Globe,
  'cyberpunk-2077': Radar,
  'the-witcher-3': Sword,
  skyrim: Mountain,
  'honkai-star-rail': Star,
  'world-of-warcraft': Swords,
  'rocket-league': Trophy,
  'among-us': Radar,
  'pokemon-go': Globe,
  'forza-horizon-5': Flag,
  'assetto-corsa-competizione': Trophy,
  'euro-truck-simulator-2': Truck,
};

export function GameLogo({ game, large = false, decorative = true }: { game: GameLogoData; large?: boolean; decorative?: boolean }) {
  const { slug, title, genre, logo } = game;
  const src = logo && (large ? logo.large : logo.small);
  const [loaded, setLoaded] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const showImage = Boolean(src && failed !== src);
  const Icon = gameFallbacks[slug] ?? genreIcons[genre];
  const backdrop = showImage && logo?.backdrop ? ' game-logo-' + logo.backdrop : '';

  return <span className={'game-mark game-art ' + accents[genre] + (large ? ' game-art-large' : '') + backdrop}
    aria-hidden={decorative || undefined} data-game-logo={slug} data-logo-status={showImage ? 'logo' : 'fallback'}>
    {(!showImage || loaded !== src) && <Icon size={large ? 38 : 22} aria-hidden="true"/>}
    {!decorative && !showImage && <span className="sr-only">{title} icon</span>}
    {showImage && src && <Image key={src} src={src} alt={decorative ? '' : title + ' logo'} fill
      sizes={large ? '(max-width: 620px) 59px, 84px' : '(max-width: 450px) 37px, 50px'}
      loading={large ? 'eager' : 'lazy'} decoding="async"
      className={loaded === src ? 'game-logo-loaded' : 'game-logo-loading'}
      onLoad={() => setLoaded(src)} onError={() => setFailed(src)}/>}
  </span>;
}
