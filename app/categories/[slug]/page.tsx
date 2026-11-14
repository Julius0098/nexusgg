import { notFound } from 'next/navigation';
import { Crumbs, PageTitle, ToolGrid } from '../../../components/site';
import { categories, categorySlug, tools } from '../../../lib/tools';
import { metadata } from '../../../lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => categories.map(category => ({slug:categorySlug(category)}));
type Props = {params:Promise<{slug:string}>};
const descriptions = {
  'Aim & Input':'Dial in mouse settings, reticles, reaction time, and field of view.',
  'Match Stats':'Calculate win rates, damage, and other match stats from your own results.',
  Sandbox:'Work out coordinates, inventory space, resource runs, and recipes.',
  Economy:'Estimate Roblox earnings and convert currencies with your own rates.',
  Probability:'Compare the odds of getting a drop with your observed results.',
  Utility:'Time your sessions and estimate progress toward a goal.',
};

export async function generateMetadata({params}:Props) {
  const {slug} = await params;
  const category = categories.find(item => categorySlug(item) === slug);
  return category ? metadata(category + ' Tools', descriptions[category], '/categories/' + slug + '/') : {};
}

export default async function CategoryPage({params}:Props) {
  const {slug} = await params;
  const category = categories.find(item => categorySlug(item) === slug);
  if (!category) notFound();
  return <div className="shell page-main"><Crumbs trail={[{title:'All tools',href:'/tools/'},{title:category,href:'/categories/'+slug+'/'}]}/><PageTitle title={category} desc={descriptions[category]} tag="Tool category"/>
    <ToolGrid heading="h2" slugs={tools.filter(tool => tool.category === category).map(tool => tool.slug)}/></div>;
}
