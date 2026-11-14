import type { Metadata } from 'next';
import Link from 'next/link';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource-variable/geist';
import './globals.css';
import { Navigation, type SearchItem } from '../components/navigation';
import { Footer } from '../components/site';
import { games, guides, genres } from '../lib/catalog';
import { categories, categorySlug, tools } from '../lib/tools';
import { isIndexable, siteUrl, siteDescription } from '../lib/seo';

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  robots: isIndexable ? {index:true, follow:true} : {index:false, follow:false},
  title: 'NEXUSGG',
  description: siteDescription,
  icons: '/nexus.svg',
};

const items: SearchItem[] = [
  {title:'Make Money',href:'/make-money/',kind:'Earnings',keywords:'gaming creator coaching streaming earnings'},
  {title:'Compete & Earn',href:'/make-money/tournaments/',kind:'Competition',keywords:'fortnite tournaments cash cup CS2 rocket league VALORANT'},
  {title:'Gaming Income Tracker',href:'/make-money/tracker/',kind:'Earnings',keywords:'money monthly csv local income'},
  ...tools.map(tool => ({title:tool.title,href:'/tools/'+tool.slug+'/',kind:'Tool',keywords:tool.category+' '+tool.desc+(tool.slug==='sensitivity-converter' ? ' CS2 Valorant Apex Overwatch' : '')})),
  ...games.map(game => ({title:game.title,href:'/games/'+game.slug+'/',kind:'Game',keywords:game.mark+' '+genres[game.genre],game:{slug:game.slug,title:game.title,genre:game.genre,logo:game.logo}})),
  ...categories.map(category => ({title:category,href:'/categories/'+categorySlug(category)+'/',kind:'Category'})),
  ...guides.map(guide => ({title:guide.title,href:'/guides/'+guide.slug+'/',kind:'Guide',keywords:guide.category})),
];

export default function Layout({ children }: Readonly<{ children:React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('nexusgg-theme')==='light'?'light':'dark'}catch{}"}}/></head>
    <body><Link className="skip-link" href="#main">Skip to content</Link><Navigation items={items}/><main id="main">{children}</main><Footer/></body>
  </html>;
}
