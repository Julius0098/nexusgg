import { Crumbs, PageTitle } from '../../components/site';
import { GameDirectory } from '../../components/game-directory';
import { games } from '../../lib/catalog';
import { toolSlugsFor } from '../../lib/game-links';
import { metadata } from '../../lib/seo';

export const generateMetadata = () => metadata('All Games', 'Find calculators, input tools and guides for 50 games.', '/games/');
const items=games.map(game=>({game,count:toolSlugsFor(game).length}));

export default function GamesPage() {
  return <div className="shell page-main">
    <Crumbs trail={[{title:'All games',href:'/games/'}]}/><PageTitle tag="Game catalog" title="All Games" desc="Find aim settings, calculators and guides for the games you play."/>
    <GameDirectory items={items}/>
  </div>;
}
