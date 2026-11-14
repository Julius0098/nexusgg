'use client';

import Link from 'next/link';
import { ArrowUpRight, CircleDollarSign, Crosshair, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { GameLogo, type GameLogoData } from './game-logo';
import { includesTerms } from '../lib/search';
import { useEffect, useRef, useState } from 'react';

export type SearchItem = { title: string; href: string; kind: string; keywords?: string; game?: GameLogoData };
const nav = [['Home','/'],['All Games','/games/'],['Tools','/tools/'],['Make Money','/make-money/'],['Popular','/popular/'],['Guides','/guides/'],['About','/about/']];

export function Navigation({ items }: { items: SearchItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const matchesBox = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [light, setLight] = useState(false);
  const [mobile, setMobile] = useState(false);
  const matches = items.filter(item=>includesTerms(item.title+' '+item.kind+' '+(item.keywords??''),query)).slice(0,9);
  const open = () => {
    if (dialog.current?.open) return;
    setQuery('');
    setActive(0);
    dialog.current?.showModal();
  };
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === 'light');
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, []);
  const changeTheme = () => {
    const next = light ? 'dark' : 'light';
    setLight(!light);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('nexusgg-theme', next); } catch { /* Storage may be blocked. */ }
  };

  return <header className="site-header">
    <div className="shell header-inner">
      <Link className="wordmark" href="/" aria-label="NEXUSGG home"><span className="logo-icon"><Crosshair size={21} strokeWidth={2.5}/></span>NEXUS<span>GG</span></Link>
      <nav className={'navigation ' + (mobile ? 'expanded' : '')} aria-label="Main navigation">{nav.map(([label, path]) => <Link key={path} href={path} onClick={() => setMobile(false)} className={label==='Make Money'?'nav-money':undefined}>{label==='Make Money' && <CircleDollarSign size={14}/>} {label}</Link>)}</nav>
      <div className="header-actions">
        <button className="search-button" type="button" ref={opener} onClick={open} aria-label="Search site"><Search size={17}/><span>Search</span><kbd>Ctrl K</kbd></button>
        <button className="icon-button theme-toggle" type="button" onClick={changeTheme} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}>{light ? <Moon size={18}/> : <Sun size={18}/>}</button>
        <button className="icon-button mobile-menu" type="button" aria-label={mobile ? 'Close menu' : 'Open menu'} aria-expanded={mobile} onClick={() => setMobile(!mobile)}>{mobile ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
    </div>
    <dialog className="search-dialog" ref={dialog} onClose={() => opener.current?.focus()} onClick={event => {if (event.target === event.currentTarget) dialog.current?.close();}} aria-label="Search NEXUSGG">
      <div className="dialog-content">
        <div className="dialog-input"><Search size={20}/><input aria-label="Search games, tools and guides" placeholder="Search games, tools and guides…" autoFocus value={query} onChange={event => {setQuery(event.target.value);setActive(0);}} onKeyDown={event => {
          if (!matches.length) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            setActive(current => (current + offset + matches.length) % matches.length);
          }
          if (event.key === 'Enter') (matchesBox.current?.children[active] as HTMLAnchorElement | undefined)?.click();
        }}/><button className="icon-button" aria-label="Close search" onClick={() => dialog.current?.close()}><X size={18}/></button></div>
        <p className="search-caption">{query.trim() ? 'Search results' : 'Try a popular tool'}</p>
        <div ref={matchesBox}>{matches.map((item,index) => <Link className={'search-result '+ (index === active ? 'selected' : '')} key={item.href} href={item.href} onClick={() => dialog.current?.close()}><span className="search-item-title">{item.game && <GameLogo game={item.game}/>}<span><small>{item.kind}</small>{item.title}</span></span><ArrowUpRight size={16}/></Link>)}</div>
        {!matches.length && <p className="search-empty" role="status">No results. Try “Minecraft”, “aim” or “win rate”.</p>}
      </div>
    </dialog>
  </header>;
}
