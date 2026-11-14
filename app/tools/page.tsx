import { CategoryCards, Crumbs, PageTitle, Section, ToolGrid } from '../../components/site';
import { metadata } from '../../lib/seo';
import { categories, categorySlug, tools } from '../../lib/tools';

const description = 'Browse free gaming calculators, sensitivity converters, crosshair tools, input tests, and planners for 50 games. Use them directly in your browser.';
export const generateMetadata = () => metadata('Free Gaming Calculators & Aim Tools', description, '/tools/');

export default function ToolsPage() {
  return <div className="shell page-main"><Crumbs trail={[{title:'All tools',href:'/tools/'}]}/><PageTitle tag="Tool library" title="Free Gaming Tools" desc={description}/><CategoryCards/>
    {categories.map(category => <Section title={category} key={category} href={'/categories/' + categorySlug(category) + '/'}><ToolGrid slugs={tools.filter(tool => tool.category === category).map(tool => tool.slug)}/></Section>)}</div>;
}
