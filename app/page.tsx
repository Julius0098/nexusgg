import Link from 'next/link';
import { ArrowRight, ChevronDown, CircleDollarSign, Crosshair, Gamepad2, Zap } from 'lucide-react';
import { Calculator } from '../components/calculator';
import { HeroEntrance } from '../components/visual';
import { AdPlacement, CategoryCards, GameCard, GuideCard, JsonLd, Section, ToolGrid } from '../components/site';
import { games, guides } from '../lib/catalog';
import { metadata, siteDescription, siteTitle, siteUrl } from '../lib/seo';
import { featured } from "../lib/featured";

export const generateMetadata = () => ({
  ...metadata('Free Gaming Tools & Calculators', siteDescription, '/'),
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined },
});
const faq = [
  ['Are the tools free to use?', 'Yes. All tools work in your browser and are available without an account.'],
  ['Which games are supported by the sensitivity converter?', 'Counter-Strike 2, Valorant, Apex Legends and Overwatch 2. The converter matches hip-fire distance at the same DPI.'],
  ['Where are my settings saved?', 'Saved aim settings and appearance preferences are stored in your current browser. You can remove them by clearing the site’s browser data.'],
  ['Is NEXUSGG affiliated with game publishers?', 'NEXUSGG is an independent fan-made site. Games and trademarks belong to their respective publishers.'],
];

export default function Home() {
  return <>
    <link rel="preload" href="/reactor.webp" as="image" fetchPriority="high"/>
    {siteUrl && <JsonLd data={{'@type':'WebSite',name:siteTitle,url:siteUrl+'/',description:siteDescription}}/>}
    <div className="hero-wrap">
      <div className="shell hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot"/> Free gaming tools</p>
          <h1>Every Game.<br/>Every Tool.<br/><em>One Place.</em></h1>
          <p className="hero-description">Free gaming tools for 50 games. Convert mouse sensitivity, calculate match stats, and plan everything from Minecraft portals to Roblox purchases.</p>
          <div className="hero-actions"><Link className="primary-button" href="/tools/"><Zap size={17}/> Explore Tools <ArrowRight size={17}/></Link><Link className="secondary-button" href="/games/"><Gamepad2 size={18}/> Browse Games</Link></div>
        </div>
        <HeroEntrance><Calculator slug="sensitivity-converter" preview/></HeroEntrance>
      </div>
    </div>
    <div className="shell home-content">
      <AdPlacement placement="after-intro"/>
      <Section title="Popular tools" href="/tools/" label="View all tools"><ToolGrid slugs={featured}/></Section>
      <Section title="Browse by game" href="/games/" label="Browse all 50 games"><div className="game-grid">{[games[0],games[1],games[15],games[2],games[16],games[3]].map(game => <GameCard key={game.slug} game={game}/>)}</div></Section>
      <Section title="Tool categories"><CategoryCards/></Section>
      <Section title="Recently added tools" href="/tools/" label="All tools"><ToolGrid slugs={['developer-revenue','level-progression','time-to-goal']}/></Section>
      <Section title="Featured calculators"><ToolGrid slugs={['fov-converter','minecraft-xp','gamepass-earnings']}/></Section>
      <Section title="Gaming guides" href="/guides/" label="All guides"><div className="guide-grid">{guides.slice(0,3).map(guide => <GuideCard guide={guide} key={guide.slug}/>)}</div></Section>
      <Section title="Frequently asked questions">
        <div className="faq">{faq.map(([q,a]) => <details key={q}><summary>{q}<ChevronDown size={16}/></summary><p>{a}</p></details>)}</div>
      </Section>
      <Section title="Turn Your Gaming Skills Into Opportunities" href="/make-money/" label="Explore Ways to Earn">
        <p className="section-copy">Explore legitimate ways to potentially earn through tournaments, content creation, and gaming-related work.</p>
        <div className="category-grid home-earning-grid">{[
          ['Fortnite tournaments','/make-money/tournaments/#fortnite'],['CS2 competitions','/make-money/tournaments/#counter-strike-2'],['Roblox development','/make-money/roblox/'],
          ['Gaming content creation','/make-money/#opportunity-finder'],['Streaming','/make-money/fortnite/#ways-to-earn'],['Coaching','/make-money/counter-strike-2/#ways-to-earn'],
        ].map(([label,href])=><Link key={label} className="category-card" href={href}><CircleDollarSign size={16} className="green"/>{label}<ArrowRight size={15}/></Link>)}</div>
      </Section>
      <div className="home-bottom"><Crosshair size={18}/> <Link href="/tools/">Find a tool <ArrowRight size={16}/></Link></div>
    </div>
  </>;
}
