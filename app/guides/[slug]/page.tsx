import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Crumbs, GuideCard, PageTitle, Section } from '../../../components/site';
import { guides } from '../../../lib/catalog';
import { getTool } from '../../../lib/tools';
import { metadata } from '../../../lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => guides.map(({slug}) => ({slug}));
type Props = {params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props) {
  const {slug} = await params;
  const guide = guides.find(item => item.slug === slug);
  return guide ? metadata(guide.title, guide.desc, '/guides/' + slug + '/', 'article') : {};
}

export default async function GuidePage({params}:Props) {
  const {slug} = await params;
  const guide = guides.find(item => item.slug === slug);
  if (!guide) notFound();
  return <div className="shell page-main">
    <Crumbs trail={[{title:'Guides',href:'/guides/'},{title:guide.title,href:'/guides/'+slug+'/'}]}/>
    <PageTitle title={guide.title} desc={guide.desc} tag={guide.category}/>
    <article className="article">{guide.sections.map(([title,copy]) => <section key={title}><h2>{title}</h2><p>{copy}</p></section>)}
      <Link className="primary-button" href={'/tools/' + guide.tool + '/'}>Open {getTool(guide.tool)?.title} <ArrowRight size={16}/></Link></article>
    <Section title="More guides" href="/guides/"><div className="guide-grid">{guides.filter(item => item.slug !== slug).slice(0,3).map(item => <GuideCard key={item.slug} guide={item}/>)}</div></Section>
  </div>;
}
