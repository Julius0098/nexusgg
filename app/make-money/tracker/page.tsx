import { Crumbs, PageTitle } from '../../../components/site';
import { IncomeTracker } from '../../../components/earning-tools';
import { earningChoices } from '../../../lib/earning-content';
import { metadata } from '../../../lib/seo';

const description='Record money you received from gaming, see monthly totals by currency, and export your entries as CSV.';
export const generateMetadata=()=>metadata('Gaming Income Tracker',description,'/make-money/tracker/');

export default function Tracker(){
  return <div className="shell page-main"><Crumbs trail={[{title:'Make Money',href:'/make-money/'},{title:'Income tracker',href:'/make-money/tracker/'}]}/>
    <PageTitle title="Gaming Income Tracker" desc={description}/>
    <p className="section-copy tracker-copy">Entries are saved in this browser. Totals keep currencies separate and represent received amounts before any separate expenses you need to account for.</p>
    <IncomeTracker games={earningChoices}/>
  </div>;
}
