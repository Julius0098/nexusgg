import { Crumbs, GameCard, PageTitle, Section, ToolGrid } from '../../components/site';
import { featured } from '../../lib/featured';
import { games } from '../../lib/catalog';
import { featuredGames } from '../../lib/game-links';
import { metadata } from '../../lib/seo';

const desc = 'A handpicked lineup of useful tools for aim, stats, Minecraft and loot.';
export const generateMetadata = () => metadata('Popular Gaming Tools', desc, '/popular/');

export default function PopularPage() {
  return <div className="shell page-main"><Crumbs trail={[{title:'Popular',href:'/popular/'}]}/><PageTitle title="Popular Tools" desc={desc}/><ToolGrid slugs={featured} heading="h2"/>
    <Section title="Popular Games" href="/games/"><div className="game-grid">
      {featuredGames.map(slug => <GameCard key={slug} game={games.find(game => game.slug === slug)!}/>)}
    </div></Section></div>;
}
