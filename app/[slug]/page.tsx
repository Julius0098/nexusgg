import { notFound } from 'next/navigation';
import { Crumbs, PageTitle } from '../../components/site';
import { ReportForm } from '../../components/calculator';
import { basePages } from '../../lib/catalog';
import { metadata } from '../../lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(basePages).map(slug => ({slug}));
type Props = {params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props) {
  const {slug} = await params;
  if (!Object.hasOwn(basePages,slug)) return {};
  const [title,copy] = basePages[slug as keyof typeof basePages];
  return metadata(title,copy.split('. ')[0] + '.', '/' + slug + '/');
}

export default async function InfoPage({params}:Props) {
  const {slug} = await params;
  if (!Object.hasOwn(basePages,slug)) notFound();
  const [title,copy] = basePages[slug as keyof typeof basePages];
  return <div className="shell page-main"><Crumbs trail={[{title,href:'/' + slug + '/'}]}/><PageTitle title={title} desc={copy}/>
    {slug === 'contact' && <ReportForm email={process.env.NEXT_PUBLIC_CONTACT_EMAIL}/>}</div>;
}
