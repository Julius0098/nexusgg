import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { ToolWidget } from '../../../components/calculator';
import { AdPlacement, Crumbs, GuideCard, JsonLd, PageTitle, Section, ToolGrid } from '../../../components/site';
import { GameCard } from '../../../components/game-card';
import { toolSlugsFor } from '../../../lib/game-links';
import { games, guides } from '../../../lib/catalog';
import { absoluteUrl, metadata } from '../../../lib/seo';
import { gamePlanSlug } from '../../../lib/game-hubs';
import { toolPageContent } from '../../../lib/tool-content';
import { getTool, tools } from '../../../lib/tools';

export const dynamicParams = false;
export const generateStaticParams = () => tools.map(({slug}) => ({slug}));
type Props = {params:Promise<{slug:string}>};
const plannerGames = new Map(games.map(game => [gamePlanSlug(game.slug), game]));
const relatedByTool: Record<string, string[]> = {
  'sensitivity-converter': ['edpi', 'mouse-dpi-match', 'crosshair-builder'],
  'crosshair-builder': ['sensitivity-converter', 'edpi', 'reaction-time-test'],
  'nether-coordinates': ['portal-coordinate-converter', 'stack-calculator', 'minecraft-xp'],
  'portal-coordinate-converter': ['nether-coordinates', 'stack-calculator', 'item-quantity'],
  'robux-value': ['developer-revenue', 'gamepass-earnings', 'roblox-marketplace-fee'],
  'developer-revenue': ['robux-value', 'gamepass-earnings', 'roblox-marketplace-fee'],
};

export async function generateMetadata({params}:Props) {
  const {slug} = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const { title, description } = toolPageContent(tool, plannerGames.get(slug));
  return metadata(title, description, '/tools/' + slug + '/');
}

export default async function ToolPage({ params }: Props) {
  const {slug} = await params;
  const tool = getTool(slug);
  if (!tool) notFound();
  const game = plannerGames.get(slug);
  const { title, description, steps, example, faq } = toolPageContent(tool, game);
  const guide = guides.find(item => item.tool === slug) ?? guides.find(item => item.slug === game?.guide);
  const relatedGames=games.filter(game=>toolSlugsFor(game).includes(slug)).slice(0,4);
  const relatedTools = relatedByTool[slug] ?? (game
    ? toolSlugsFor(game).filter(item => item !== slug).slice(0, 3)
    : tools.filter(item => item.category === tool.category && item.slug !== slug).slice(0, 3).map(item => item.slug));
  const path = '/tools/' + slug + '/';
  const url = absoluteUrl(path);
  return <div className="shell page-main">
    <Crumbs trail={[{title:'All tools',href:'/tools/'},{title,href:path}]}/>
    <PageTitle title={title} desc={description} tag={tool.category}/>
    {url && <JsonLd data={{'@type':'WebApplication',name:title,description,url,applicationCategory:'UtilitiesApplication',
      operatingSystem:'Any', isAccessibleForFree:true, offers:{'@type':'Offer',price:0,priceCurrency:'USD'}}}/>}
    <AdPlacement placement="after-intro"/>
    <div className="tool-layout"><ToolWidget slug={slug}/>
      <div className="tool-explanation">
        <h2>How to use it</h2><ol className="tool-steps">{steps.map(step => <li key={step}>{step}</li>)}</ol><p>{tool.tip}</p>
        <h2>How it works</h2><p>{tool.formula}</p>
        <h2>Worked example</h2><p>{example}</p>
        <AdPlacement placement="desktop-sidebar"/>
        {tool.source && <p><a className="text-link" href={tool.source[1]}>{tool.source[0]}</a></p>}
      </div>
    </div>
    <AdPlacement placement="after-result"/>
    <Section title="Frequently asked questions"><div className="faq">
      {faq && <details open><summary>{faq[0]}<ChevronDown size={16}/></summary><p>{faq[1]}</p></details>}
      <details><summary>Are my inputs uploaded?<ChevronDown size={16}/></summary><p>Calculations and tests run in your browser.</p></details>
    </div></Section>
    {guide && <Section title="Related guide"><div className="guide-grid"><GuideCard guide={guide}/></div></Section>}
    {relatedGames.length > 0 && <Section title="Related games"><div className="game-grid">{relatedGames.map(game=><GameCard game={game} key={game.slug}/>)}</div></Section>}
    <Section title="Related tools"><ToolGrid slugs={relatedTools}/>
      {slug === 'fortnite-sensitivity' && <p className="section-copy"><Link className="text-link" href="/make-money/fortnite/#fortnite-tournaments">Fortnite cash tournament entry guide</Link></p>}
    </Section>
  </div>;
}
