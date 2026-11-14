import Link from 'next/link';
import { ArrowRight, Flag } from 'lucide-react';
import { AdPlacement, Crumbs, PageTitle, Section } from '../../../components/site';
import { TournamentChecklist } from '../../../components/earning-tools';
import { arenasRules, competitions } from '../../../lib/competitions';
import { games } from '../../../lib/catalog';
import { GameLogo } from '../../../components/game-logo';
import { metadata } from '../../../lib/seo';

const description='Find gaming tournaments with cash prizes, official schedules, and entry rules. Check Fortnite Cash Cups, CS2, Valorant, Rocket League, and more.';
export const generateMetadata=()=>metadata('Gaming Tournaments with Cash Prizes',description,'/make-money/tournaments/');

export default function Compete(){
  return <div className="shell page-main">
    <Crumbs trail={[{title:'Make Money',href:'/make-money/'},{title:'Compete & Earn',href:'/make-money/tournaments/'}]}/>
    <PageTitle title="Compete & Earn" desc={description}/>
    <div className="insight"><h2 className="compact-heading"><Flag size={17}/> Tournament directory</h2><p>Sources checked November 14, 2026. Follow the organizer for the latest calendar and registration status. Winnings depend on eligibility and placement, and many players win nothing.</p></div>
    <nav className="pills earning-subnav" aria-label="Competitions by game">{competitions.map(item=><Link href={'#'+item.game} key={item.game}>{games.find(game=>game.slug===item.game)?.title}</Link>)}</nav>
    <div className="hub-guide-grid compete-grid">{competitions.map(item=>{
      const game=games.find(game=>game.slug===item.game)!;
      return <article id={item.game} key={item.game} className="guide-card opportunity-card competition-card">
        <div className="competition-title"><GameLogo game={game}/><div><small>{game.title} · {item.format}</small><h2>{item.name}</h2></div></div>
        <dl><dt>Organizer</dt><dd>{item.organizer}</dd><dt>Schedule</dt><dd>{item.date}</dd><dt>Regions</dt><dd>{item.region}</dd><dt>Minimum age</dt><dd>{item.age}</dd><dt>Entry requirements</dt><dd>{item.requirements}</dd><dt>Prizes</dt><dd>{item.prizes}</dd></dl>
        <div className="hub-actions"><a className="text-link" href={item.join}>Official entry or schedule <ArrowRight size={15}/></a><a className="text-link" href={item.rules}>Official rules or reference</a><Link className="text-link" href={'/make-money/'+item.game+'/'}>{game.title} earning guide</Link></div>
      </article>;
    })}</div>
    <Section title="Fortnite Cash Cup prize-table example" id="fortnite-arenas-example">
      <div className="insight"><h3>Chapter 7 Mini-Season · Arenas Cash Cup</h3><p>Epic’s November 2026 rules describe a solo Arenas format with a Platinum rank requirement. In Europe, fourth place was allocated US$300 per eligible player, and fifth and sixth were allocated US$200. Use the official schedule to confirm when a session is available and the rulebook for restrictions.</p><a className="text-link" href={arenasRules}>Official event rules and prize table <ArrowRight size={15}/></a></div>
      <p className="section-copy"><Link className="text-link" href="/make-money/fortnite/#fortnite-tournaments">Read the Fortnite tournament guide <ArrowRight size={15}/></Link></p>
    </Section>
    <AdPlacement placement="after-tournaments"/>
    <Section title="Tournament preparation checklist" id="checklist"><TournamentChecklist/></Section>
  </div>;
}
