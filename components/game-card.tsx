import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { GameLogo } from './game-logo';
import { genres, type Game } from '../lib/catalog';

export function GameCard({game,count,methods}: {game:Game;count?:number;methods?:string[]}) {
  const earning=methods!==undefined;
  return <Link className={'game-card'+(earning?' earning-card':'')} href={(earning?'/make-money/':'/games/')+game.slug+'/'} prefetch={false}>
    <GameLogo game={game}/>
    <span className="game-card-info"><strong>{game.title}</strong><small>{earning ? methods.join(' · ') : genres[game.genre]+(count===undefined?'':' · '+count+' tools')}</small>
      {earning && <span className="card-action">Explore Opportunities <ArrowRight size={14}/></span>}
    </span><ChevronRight size={17}/>
  </Link>;
}
