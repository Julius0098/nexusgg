import { Crumbs, PageTitle, Section } from '../../../components/site';
import { TournamentChecklist } from '../../../components/earning-tools';
import { glossary, roadmap, safety } from '../../../lib/earning-content';
import { metadata } from '../../../lib/seo';

const description='Plan your gaming progression, track tournament preparation, and learn how to verify organizers and payout messages.';
export const generateMetadata=()=>metadata('Gaming Earnings Starter Guide',description,'/make-money/resources/');

export default function Resources(){
  return <div className="shell page-main"><Crumbs trail={[{title:'Make Money',href:'/make-money/'},{title:'Resources',href:'/make-money/resources/'}]}/>
    <PageTitle title="Gaming Earnings Starter Guide" desc={description}/>
    <Section title="From beginner to competitive play" id="roadmap"><ol className="steps-grid">{roadmap.map(([title,copy])=><li className="insight" key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol></Section>
    <Section title="Tournament preparation checklist" id="checklist"><TournamentChecklist/></Section>
    <Section title="Tournament glossary" id="glossary"><dl className="game-glossary">{glossary.map(([title,copy])=><div className="insight" key={title}><dt>{title}</dt><dd>{copy}</dd></div>)}</dl></Section>
    <Section title="Gaming scams and account safety" id="safety"><div className="hub-guide-grid">{safety.map(([title,copy])=><article className="insight" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></Section>
  </div>;
}
