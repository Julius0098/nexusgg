import { ChevronDown } from 'lucide-react';
import { GameLogo } from './game-logo';
import { gameArt } from '../lib/game-art';
import { genres, type Game } from '../lib/catalog';

export function HubHeader({game,title,tag,summary,children}: {game:Game;title:string;tag?:string;summary:string;children?:React.ReactNode}) {
  const media=gameArt[game.slug];
  return <header className={'game-hub-header hub-genre-'+game.genre}>
    {media && <img className="hub-cover" src={media.cover} alt="" fetchPriority="high" decoding="async"/>}
    <div className="hub-header-content">
      <GameLogo game={game} large decorative={false}/>
      <div><p className="eyebrow">{tag??genres[game.genre]}</p><h1>{title}</h1><p>{summary}</p>{children && <div className="hub-actions">{children}</div>}</div>
    </div>
    {(media || game.logo) && <div className="hub-media-credits">
      {game.logo && game.logo.source !== media?.url && <a className="asset-credit" href={game.logo.source}>{game.logo.credit}</a>}
      {game.logo?.license && <a className="asset-credit" href={game.logo.license}>CC BY-SA 4.0</a>}
      {media && <a className="asset-credit" href={media.url}>{media.credit}</a>}
    </div>}
  </header>;
}

export function FAQ({items}: {items:[string,string][]}) {
  return <div className="faq">{items.map(([question,answer])=><details key={question}><summary>{question}<ChevronDown size={16}/></summary><p>{answer}</p></details>)}</div>;
}

export function SourceLink({source}: {source?:[string,string]}) {
  return source ? <a className="text-link" href={source[1]}>{source[0]}</a> : <span className="muted">Information not yet verified for a game-specific program.</span>;
}
