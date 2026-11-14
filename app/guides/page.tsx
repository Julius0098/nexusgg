import { Crumbs, GuideCard, PageTitle } from '../../components/site';
import { guides } from '../../lib/catalog';
import { metadata } from '../../lib/seo';

export const generateMetadata = () => metadata('Gaming Guides', 'Guides for aim, Minecraft, Roblox, match stats and finding better farming rates.', '/guides/');

export default function GuidesPage() {
  return <div className="shell page-main"><Crumbs trail={[{title:'Guides',href:'/guides/'}]}/><PageTitle title="Gaming Guides" desc="Practical walkthroughs for getting more out of the tools."/><div className="guide-grid">{guides.map(guide => <GuideCard guide={guide} key={guide.slug} heading="h2"/>)}</div></div>;
}
