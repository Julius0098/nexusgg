import Link from 'next/link';
import { ArrowRight, Flag, Gamepad2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Crumbs, GameCard, GuideCard, Section, ToolGrid } from '../../../components/site';
import { FAQ, HubHeader, SourceLink } from '../../../components/hub';
import { games, guides } from '../../../lib/catalog';
import { gamePlanSlug, hubs } from '../../../lib/game-hubs';
import { toolSlugsFor } from '../../../lib/game-links';
import { gameTutorials, proSettings, robloxExperiences } from '../../../lib/special-guides';
import { competitions } from '../../../lib/competitions';
import { metadata } from '../../../lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => games.map(({slug}) => ({slug}));
type Props = {params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props) {
  const {slug} = await params;
  const game = games.find(game => game.slug === slug);
  return game ? metadata(game.title + ' Tools & Guides', 'Explore ' + game.title + ' tools and guides for ' + hubs[slug].focus.toLowerCase() + '. ' + game.desc, '/games/' + slug + '/') : {};
}

export default async function GamePage({params}:Props) {
  const {slug} = await params;
  const game = games.find(game => game.slug === slug);
  if (!game) notFound();
  const hub=hubs[slug];
  const guide = guides.find(guide => guide.slug === game.guide)!;
  const related = games.filter(item => item.genre === game.genre && item.slug !== game.slug).sort((a,b)=>
    b.tools.filter(tool=>game.tools.includes(tool)).length-a.tools.filter(tool=>game.tools.includes(tool)).length
  ).slice(0,3);
  const allTools=toolSlugsFor(game);
  const recentlyAdded=allTools.filter(tool=>!game.tools.includes(tool)).slice(0,3);
  return <div className="shell page-main">
    <Crumbs trail={[{title:'All games',href:'/games/'},{title:game.title,href:'/games/' + slug + '/'}]}/>
    <HubHeader game={game} title={game.title} summary={game.desc}>
      <Link className="primary-button" href="#tools"><Gamepad2 size={17}/> Open tools</Link>
      <Link className="secondary-button" href={'/make-money/'+slug+'/'}>Ways to earn <ArrowRight size={16}/></Link>
      {competitions.some(item=>item.game===slug) && <Link className="secondary-button" href={'/make-money/tournaments/#'+slug}><Flag size={16}/> Competitions</Link>}
    </HubHeader>
    <Section title={hub.focus}><div className="hub-guide-grid">
      <article className="insight"><h3>Practice session</h3><p>{hub.drill}</p></article>
      <article className="insight"><h3>What to track</h3><p>{game.tip}</p><Link className="text-link" href={'/tools/'+gamePlanSlug(slug)+'/'}>Measure your results <ArrowRight size={15}/></Link></article>
    </div></Section>
    <Section title={'Tools for '+game.title} id="tools"><ToolGrid slugs={allTools}/></Section>
    <Section title="Guides and tutorials"><div className="hub-guide-grid">
      {(gameTutorials[slug]??[{title:'Build a repeatable progression plan',text:hub.lesson}]).map(item=><article className="insight" key={item.title}><h3>{item.title}</h3><p>{item.text}</p>{item.source && <SourceLink source={item.source}/>}</article>)}
      <GuideCard guide={guide}/>
    </div></Section>
    {slug==='apex-legends' && <Section title="Official competitive statistics"><div className="insight">
      <h3>ALGS Year 5 Championship</h3><p>EA’s published event dashboard shows player kills, damage, assists and Legend pick rates. Use the per-match toggle when comparing players with different match counts.</p><a className="text-link" href="https://algs.ea.com/en/year-5/champs-2026/statistics">Open EA’s championship statistics</a>
    </div></Section>}
    {slug==='counter-strike-2' && <Section title="CS2 professional settings" id="pro-settings">
      <p className="section-copy">Third-party profiles checked November 14, 2026. Settings can change. eDPI is calculated from the listed DPI and sensitivity.</p>
      <div className="data-table"><table><thead><tr><th>Player and source</th><th>DPI</th><th>Sensitivity</th><th>eDPI</th></tr></thead><tbody>{proSettings.map(player=><tr key={player.name}><td><a className="text-link" href={player.url}>{player.name}</a></td><td>{player.dpi}</td><td>{player.sens}</td><td>{player.dpi*player.sens}</td></tr>)}</tbody></table></div>
    </Section>}
    {slug==='roblox' && <Section title="Roblox experiences to explore" id="experiences">
      <div className="hub-guide-grid">{robloxExperiences.map(item=><a href={item.href} key={item.title} className="guide-card"><small>{item.category}</small><h3>{item.title}</h3><span>Open on Roblox <ArrowRight size={15}/></span></a>)}</div>
      <p className="section-copy"><a className="text-link" href="https://www.roblox.com/charts?SortFilter=3">See the current Roblox charts</a></p>
    </Section>}
    <Section title="Frequently asked questions"><FAQ items={[[hub.question,hub.answer],['How can I practice '+hub.focus.toLowerCase()+'?',hub.drill]]}/></Section>
    <Section title="Recently added tools"><ToolGrid slugs={recentlyAdded}/></Section>
    <Section title="Related games"><div className="game-grid">{related.map(item => <GameCard key={item.slug} game={item} count={toolSlugsFor(item).length}/>)}</div></Section>
  </div>;
}
