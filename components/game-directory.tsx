'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { genres, type Game } from '../lib/catalog';
import { featuredGames } from '../lib/game-links';
import { includesTerms } from '../lib/search';
import { GameCard } from './game-card';

export type DirectoryItem = {game:Game; count:number; methods?:string[]};

export function GameDirectory({items,earning=false}: {items:DirectoryItem[];earning?:boolean}) {
  const FeaturedHeading = earning ? 'h3' : 'h2';
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('all');
  const [sort,setSort]=useState('featured');
  const featured = featuredGames.flatMap(slug=>items.filter(item=>item.game.slug===slug));
  const visible=items.filter(({game,methods})=>(category==='all'||String(game.genre)===category) &&
     includesTerms(game.title+' '+game.mark+' '+genres[game.genre]+' '+(methods?.join(' ')??''),query));
  if(sort==='az') visible.sort((a,b)=>a.game.title.localeCompare(b.game.title,'en'));
  if(sort==='za') visible.sort((a,b)=>b.game.title.localeCompare(a.game.title,'en'));
  if(sort==='count') visible.sort((a,b)=>(b.methods?.length??b.count)-(a.methods?.length??a.count) || a.game.title.localeCompare(b.game.title,'en'));
  const card=({game,count,methods}:DirectoryItem)=><GameCard key={game.slug} game={game} count={count} methods={methods}/>;
  const clear=!query.trim() && category==='all' && sort==='featured';
  return <>
    <div className="directory-controls calculator">
      <label><span>Search games</span><span className="directory-search"><Search size={17}/><input type="search" placeholder="Search by game name" value={query} onChange={event=>setQuery(event.target.value)}/></span></label>
      <label><span>Category</span><select value={category} onChange={event=>setCategory(event.target.value)}><option value="all">All categories</option>{genres.map((item,index)=><option key={item} value={index}>{item}</option>)}</select></label>
      <label><span>Sort by</span><select value={sort} onChange={event=>setSort(event.target.value)}><option value="featured">Catalog order</option><option value="az">Name A–Z</option><option value="za">Name Z–A</option><option value="count">{earning?'Most earning methods':'Most tools'}</option></select></label>
    </div>
    {clear && <section className="directory-featured"><div className="section-head"><FeaturedHeading>Featured games</FeaturedHeading></div><div className="game-grid">{featured.map(card)}</div></section>}
    <p className="directory-count" role="status">{visible.length} {visible.length===1?'game':'games'}</p>
    {visible.length ? <div className="game-grid">{visible.map(card)}</div> : <div className="insight"><p>No games match these filters.</p><button className="small-button" onClick={()=>{setQuery('');setCategory('all');setSort('featured');}}>Clear filters</button></div>}
  </>;
}
