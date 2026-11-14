import Link from 'next/link';
import { Activity, ArrowRight, ArrowUpRight, BarChart3, Box, ChevronRight, Coins, Crosshair, Dices, Gamepad2, Layers3, Timer } from 'lucide-react';
import { type Guide } from '../lib/catalog';
import { categories, categorySlug, getTool, type Category, type Tool } from '../lib/tools';
import { absoluteUrl, siteUrl } from '../lib/seo';
import type { ReactNode } from 'react';

const icons = {
  'Aim & Input': Crosshair, 'Match Stats': BarChart3, Sandbox: Box, Economy: Coins, Probability: Dices, Utility: Timer,
};
const accents: Record<Category,string> = {
  'Aim & Input':'cyan', 'Match Stats':'violet', Sandbox:'green', Economy:'yellow', Probability:'pink', Utility:'blue',
};
export { GameCard } from './game-card';

export function ToolCard({ tool, heading = 'h3' }: { tool: Tool; heading?: 'h2' | 'h3' }) {
  const Heading = heading;
  const Icon = tool.slug === 'reaction-time-test' ? Activity : icons[tool.category];
  return <Link className="tool-card" href={'/tools/' + tool.slug + '/'} prefetch={false}>
    <div className="card-top"><span className={'icon-tile ' + accents[tool.category]}><Icon size={20}/></span><ArrowUpRight size={17} className="card-arrow"/></div>
    <small>{tool.category}</small><Heading>{tool.title}</Heading><p>{tool.desc}</p>
  </Link>;
}

export function GuideCard({ guide, heading = 'h3' }: { guide: Guide; heading?: 'h2' | 'h3' }) {
  const Heading = heading;
  return <Link className="guide-card" href={'/guides/' + guide.slug + '/'}>
    <small>{guide.category}</small><Heading>{guide.title}</Heading><p>{guide.desc}</p><span>Read guide <ArrowRight size={16}/></span>
  </Link>;
}

export function CategoryCards() {
  return <div className="category-grid">{categories.map(category => {
    const Icon = icons[category];
    return <Link className="category-card" key={category} href={'/categories/' + categorySlug(category) + '/'}><Icon size={17} className={accents[category]}/>{category}<ChevronRight size={14}/></Link>;
  })}</div>;
}

export function Section({title,href,label,children,id}: { title:string;href?:string;label?:string;children:ReactNode;id?:string }) {
  return <section className="content-section" id={id}>
    <div className="section-head"><h2>{title}</h2>{href && <Link className="text-link" href={href}>{label ?? 'View all'} <ArrowRight size={16}/></Link>}</div>{children}
  </section>;
}

export function Crumbs({trail}: {trail: {title:string;href:string}[]}) {
  const entries = [{title:'Home',href:'/'}, ...trail];
  const json = siteUrl ? {
    '@type':'BreadcrumbList',
    itemListElement: entries.map(({title,href}, index) => ({'@type':'ListItem',position:index+1,name:title,item:absoluteUrl(href)})),
  } : null;
  return <><nav className="crumbs" aria-label="Breadcrumb"><ol>{entries.map(({title,href}, index) => <li key={href}>{index > 0 && <ChevronRight size={13}/>}
    {index === entries.length - 1 ? <span aria-current="page">{title}</span> : <Link href={href}>{title}</Link>}</li>)}</ol></nav>
    {json && <JsonLd data={json}/>}</>;
}

export function JsonLd({data}: {data: Record<string, unknown>}) {
  const json = JSON.stringify({'@context':'https://schema.org', ...data}).replace(/</g,'\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:json}}/>;
}

export function PageTitle({title,desc,tag}: { title:string;desc:string;tag?:string }) {
  return <div className="page-title">{tag && <p className="eyebrow"><Layers3 size={14}/>{tag}</p>}<h1>{title}</h1><p>{desc}</p></div>;
}

export function ToolGrid({ slugs, heading }: { slugs:string[]; heading?: 'h2' | 'h3' }) {
  return <div className="tool-grid">{slugs.map(slug => {
    const tool = getTool(slug);
    return tool && <ToolCard key={slug} tool={tool} heading={heading}/>;
  })}</div>;
}

export function Footer() {
  return <footer className="site-footer"><div className="shell footer-inner">
    <div className="footer-brand"><Link className="wordmark" href="/"><span className="logo-icon"><Gamepad2 size={21}/></span>NEXUS<span>GG</span></Link><p>Independent tools for your next game.</p></div>
    <div className="footer-links"><Link href="/about/">About</Link><Link href="/contact/">Contact</Link><Link href="/privacy/">Privacy</Link><Link href="/cookies/">Cookies</Link><Link href="/terms/">Terms</Link><Link href="/disclaimer/">Disclaimer</Link></div>
  </div><div className="shell footer-credits">
    <p>This website is not endorsed by or affiliated with EA or its licensors.</p>
    <p>This material is unofficial and is not endorsed by Supercell. <a href="https://supercell.com/en/fan-content-policy/">Supercell Fan Content Policy</a></p>
  </div></footer>;
}

export function AdPlacement({ placement }: { placement: 'after-intro' | 'after-result' | 'after-guide' | 'desktop-sidebar' | 'after-tournaments' }) {
  const publisher = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  const slots = {
    'after-intro':process.env.NEXT_PUBLIC_ADSENSE_INTRO_SLOT,
    'after-result':process.env.NEXT_PUBLIC_ADSENSE_RESULT_SLOT,
    'after-guide':process.env.NEXT_PUBLIC_ADSENSE_GUIDE_SLOT,
    'desktop-sidebar':process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT,
    'after-tournaments':process.env.NEXT_PUBLIC_ADSENSE_TOURNAMENT_SLOT,
  };
  const slot=slots[placement];
  if (!publisher || !slot) return null;
  return <div hidden data-ad-placement={placement} data-ad-client={publisher} data-ad-slot={slot} aria-label="Advertisement"/>;
}
