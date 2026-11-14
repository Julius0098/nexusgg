import Link from 'next/link';
import { ArrowRight, Flag } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AdPlacement, Crumbs, JsonLd, Section, ToolGrid } from '../../../components/site';
import { FAQ, HubHeader } from '../../../components/hub';
import { OpportunityCard, SaveGame } from '../../../components/earning-tools';
import { games } from '../../../lib/catalog';
import { arenasRules, competitions, fortniteRules } from '../../../lib/competitions';
import { opportunitiesFor } from '../../../lib/earnings';
import { hubs } from '../../../lib/game-hubs';
import { toolSlugsFor } from '../../../lib/game-links';
import { absoluteUrl, metadata, siteTitle } from '../../../lib/seo';

export const dynamicParams=false;
export const generateStaticParams=()=>games.map(({slug})=>({slug}));
type Props={params:Promise<{slug:string}>};

function titleFor(title:string,slug:string){
  if(slug==='roblox')return 'How to Earn Money from Roblox Development';
  if(slug==='counter-strike-2')return 'How to Earn Money Playing CS2';
  return 'How to Make Money Playing '+title;
}

function descriptionFor(title:string,slug:string){
  if (slug === 'fortnite') return 'Learn how to enter Fortnite Cash Cups, read official prize tables, and explore Fortnite Island Creator eligibility, content creation, and coaching.';
  if (slug === 'roblox') return 'Learn how Roblox creators earn eligible Robux from experiences and passes, what DevEx requires, and where to verify cash-out rules.';
  if (slug === 'counter-strike-2') return 'Explore CS2 cash-prize competition requirements, demo review, content creation, and coaching. Find official rules and practical first steps.';
  return 'Explore ways to earn around ' + title + ' through ' + hubs[slug].subject + '. Learn where to start and how to check eligibility and payment terms.';
}

export async function generateMetadata({params}:Props){
  const {slug}=await params;
  const game=games.find(item=>item.slug===slug);
  return game ? metadata(titleFor(game.title,slug),descriptionFor(game.title,slug),'/make-money/'+slug+'/','article') : {};
}

function FortniteEarning(){
  return <>
    <Section title="Fortnite cash tournaments" id="fortnite-tournaments"><div className="hub-guide-grid">
      <article className="insight"><h3>Check your age, account and region</h3><p>Epic’s base minimum is 13 or the higher local minimum. Minors need parent or guardian permission. Enable MFA and check the event’s rank, account and team requirements. A matchmaking region can have additional prize country restrictions.</p><a className="text-link" href={fortniteRules}>Read Epic’s master rules</a></article>
      <article className="insight"><h3>Enter through the Compete tab</h3><p>Find the cup for your region and read each session’s format. Set your eligible region, assemble the correct team size and queue when the window opens. Later rounds may require qualifying from an earlier round.</p><Link className="text-link" href="/make-money/tournaments/#fortnite">Open tournament discovery <ArrowRight size={15}/></Link></article>
      <article className="insight"><h3>Read the leaderboard and prize table</h3><p>Placement and eliminations can carry separate points. Tiebreak rules and permitted matches vary. Prize tables say which regions and placements qualify and whether awards are per player or per team. Winners complete Epic’s prize claim, identity verification, and tax documentation.</p><a className="text-link" href={arenasRules}>See scoring and prizes in the Arenas rulebook</a><br/><a className="text-link" href="https://www.fortnite.com/competitive/discover-competitive/make-money-fortnite-cash-cups?region=NAC">Epic’s prize claim guide</a></article>
      <article className="insight"><h3>Train for the scoring format</h3><p>Play a practice block with the same rules and mark every elimination by cause. Compare your drop survival and mid-game fights, then fix the problem that removed the most points before your next block.</p><Link className="text-link" href="/games/fortnite/">Open Fortnite practice guides</Link></article>
    </div></Section>
    <Section title="Can You Earn €200–€300 Playing Fortnite?" id="fortnite-prize-example">
      <div className="insight prize-example"><h3>Published example · November 2026 Arenas Cash Cup, Europe</h3>
        <p>Epic’s prize table listed <strong>US$300 per eligible player for fourth place</strong> and <strong>US$200 per eligible player for fifth or sixth</strong> in a session. The event required at least Platinum in Arenas Ranked during the current or previous ranked season. The rules list regional prize restrictions.</p>
        <p>A result in this range is a one-off tournament prize. The amount received in euros depends on the exchange rate and any applicable fees or taxes. Many players win nothing. Use the rulebook for the specific event before counting on a prize.</p>
        <a className="text-link" href={arenasRules}>Epic Games · Official rules and prize table <ArrowRight size={15}/></a>
      </div>
    </Section>
  </>;
}

export default async function EarningPage({params}:Props){
  const {slug}=await params;
  const game=games.find(item=>item.slug===slug);
  if(!game)notFound();
  const hub=hubs[slug];
  const methods=opportunitiesFor(slug);
  const competition=competitions.find(item=>item.game===slug);
  const dev=methods.find(item=>item.method==='development');
  const title=titleFor(game.title,slug);
  const description=descriptionFor(game.title,slug);
  const url=absoluteUrl('/make-money/'+slug+'/');
  const faq:[string,string][]=[
    ['What can I start with in '+game.title+'?',hub.lesson],
    ['What should I practice before offering paid help?',hub.drill],
    [competition?'Does '+competition.name+' pay cash?':'Is there a verified cash tournament for '+game.title+'?',competition?.prizes??'Information not yet verified. Check publisher announcements and review all organizers and rules before entering an event.'],
  ];
  return <div className="shell page-main">
    <Crumbs trail={[{title:'Make Money',href:'/make-money/'},{title:game.title,href:'/make-money/'+slug+'/'}]}/>
    {url && <JsonLd data={{'@type':'Article',headline:title,description,mainEntityOfPage:url,
      image:absoluteUrl('/nexusgg-social.jpg'),publisher:{'@type':'Organization',name:siteTitle,url:absoluteUrl('/')},
      author:{'@type':'Organization',name:siteTitle,url:absoluteUrl('/about/')}}}/>}
    <HubHeader game={game} title={title} tag="Make Money" summary={description}>
      <SaveGame slug={slug}/><Link className="secondary-button" href={'/games/'+slug+'/'}>Game hub <ArrowRight size={16}/></Link>
      {competition && <Link className="secondary-button" href={'/make-money/tournaments/#'+slug}><Flag size={16}/> Competitions</Link>}
    </HubHeader>
    {slug==='fortnite'&&<FortniteEarning/>}
    <AdPlacement placement="after-guide"/>
    <Section title="Ways to earn" id="ways-to-earn"><div className="hub-guide-grid">{methods.map(item=><OpportunityCard item={item} key={item.id}/>)}</div></Section>
    <Section title="How to get started"><ol className="steps-grid">
      <li className="insight"><h3>Practice one useful skill</h3><p>{hub.drill}</p></li>
      <li className="insight"><h3>Create something you can show</h3><p>{hub.lesson}</p></li>
      <li className="insight"><h3>Check eligibility and apply</h3><p>{(dev??methods[0]).start}</p><p>Review local age and regional rules, plus any official registration costs before applying.</p></li>
      <li className="insight"><h3>Track what you actually receive</h3><p>Log payouts from {hub.subject} only after you have received them. Keep expenses, fees, and payment currencies visible when you assess the time you spent.</p><Link className="text-link" href="/make-money/tracker/">Open the income tracker</Link></li>
    </ol></Section>
    <Section title="Potential earnings"><div className="insight">
      <h3>{dev ? dev.title : competition ? competition.name : 'Creator and client income'}</h3>
      <p>{dev?.payment??competition?.prizes??'Information not yet verified for game-specific compensation. Platform ad share, subscriber support and individual client payments vary with actual views, subscribers or completed work.'}</p>
      <p>A prize is paid for eligible placement. Platform or client income depends on performance or completed work. Neither provides a guaranteed hourly wage.</p>
    </div></Section>
    <Section title="Official opportunities and references"><ul className="official-list">
      {methods.filter(item=>item.source).map(item=><li key={item.id}><a className="text-link" href={item.source![1]}>{item.source![0]} <ArrowRight size={14}/></a></li>)}
      <li><Link className="text-link" href="/make-money/resources/#safety">Verify organizers and avoid prize scams</Link></li>
    </ul></Section>
    <Section title={'Tools for '+game.title}><ToolGrid slugs={toolSlugsFor(game).slice(0,3)}/></Section>
    <Section title="Frequently asked questions"><FAQ items={faq}/></Section>
  </div>;
}
