import Link from 'next/link';
import { ArrowRight, CircleDollarSign, Compass, Flag, NotebookPen, ShieldCheck } from 'lucide-react';
import { Crumbs, Section } from '../../components/site';
import { GameDirectory } from '../../components/game-directory';
import { OpportunityFinder, SavedGames } from '../../components/earning-tools';
import { games } from '../../lib/catalog';
import { earningChoices } from '../../lib/earning-content';
import { methodLabels, opportunitiesFor } from '../../lib/earnings';
import { toolSlugsFor } from '../../lib/game-links';
import { metadata } from '../../lib/seo';

const summary='Discover legitimate ways to potentially earn money playing your favorite games. Explore tournaments, content creation, coaching, and competitive opportunities.';
export const generateMetadata=()=>metadata('Make Money Gaming',summary,'/make-money/');
const items=games.map(game=>({game,count:toolSlugsFor(game).length,methods:Array.from(new Set(opportunitiesFor(game.slug).map(item=>methodLabels[item.method])))}));

export default function MakeMoneyPage(){
  return <div className="shell page-main earning-home">
    <Crumbs trail={[{title:'Make Money',href:'/make-money/'}]}/>
    <header className="money-hero">
      <p className="eyebrow"><CircleDollarSign size={16}/> Make Money</p>
      <h1>Your Gaming Skills Could Be Worth Something.</h1>
      <p>{summary}</p>
      <div className="hub-actions"><Link className="primary-button" href="#choose-your-game">Choose Your Game <ArrowRight size={16}/></Link><Link className="secondary-button" href="#opportunity-finder"><Compass size={17}/> Explore Opportunities</Link></div>
    </header>
    <nav className="pills earning-subnav" aria-label="Earning resources">
      <Link href="/make-money/tournaments/"><Flag size={15}/> Compete &amp; Earn</Link>
      <Link href="/make-money/tracker/"><NotebookPen size={15}/> Income tracker</Link>
      <Link href="/make-money/resources/"><ShieldCheck size={15}/> Roadmap, glossary &amp; safety</Link>
    </nav>
    <Section title="Choose Your Game" id="choose-your-game"><GameDirectory items={items} earning/></Section>
    <Section title="Opportunity finder" id="opportunity-finder"><OpportunityFinder games={earningChoices}/></Section>
    <Section title="Saved games"><SavedGames games={earningChoices}/></Section>
    <p className="section-copy end-note">Earnings depend on eligibility, opportunities and results. Prize money is conditional. Some events have costs, and many players earn nothing.</p>
  </div>;
}
