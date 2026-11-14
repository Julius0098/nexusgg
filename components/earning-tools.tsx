'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Bookmark, Check, Download, Trash2 } from 'lucide-react';
import { regions, type Region, type Skill } from '../lib/competitions';
import { currencies, findOpportunities, formatIncome, incomeCsv, incomeTotals, methodLabels, parseIncomeAmount, validIncomeDate, type Currency, type FinderFilters, type Income, type Method, type Opportunity } from '../lib/earnings';

type Choice = {slug:string;title:string;planner:string};
const methodEntries=Object.entries(methodLabels) as [Method,string][];

function useBrowserData<T,>(key:string,initial:T,valid:(value:unknown)=>value is T) {
  const [value,setValue]=useState(initial);
  const [storage,setStorage]=useState<'loading'|'ready'|'unavailable'>('loading');
  useEffect(()=>{
    try{
      const raw=localStorage.getItem(key);
      if(raw!==null){
        const saved:unknown=JSON.parse(raw);
        if(valid(saved)) setValue(saved);
      }
      setStorage('ready');
    }catch{setStorage('unavailable');}
  },[key,valid]);
  const update=(next:T)=>{
    setValue(next);
    try {
      localStorage.setItem(key,JSON.stringify(next));
      setStorage('ready');
    }catch{setStorage('unavailable');}
  };
  return {value,update,storage};
}
const isStringArray=(item:unknown):item is string[]=>Array.isArray(item)&&item.every(value=>typeof value==='string');

export function SaveGame({slug}: {slug:string}) {
  const state=useBrowserData('nexusgg-favorite-games',[] as string[],isStringArray);
  const saved=state.value.includes(slug);
  return <div className="save-game">
    <button className="secondary-button" disabled={state.storage==='loading'} type="button" aria-pressed={saved} onClick={()=>state.update(saved?state.value.filter(item=>item!==slug):[...state.value,slug])}>{saved?<Check size={16}/>:<Bookmark size={16}/>} {saved?'Saved':'Save game'}</button>
    {state.storage==='unavailable'&&<span role="status">Browser storage unavailable.</span>}
  </div>;
}

export function SavedGames({games}: {games:Choice[]}) {
  const state=useBrowserData('nexusgg-favorite-games',[] as string[],isStringArray);
  const saved=games.filter(game=>state.value.includes(game.slug));
  return <div className="saved-games">{saved.length ? saved.map(game=><Link key={game.slug} href={'/make-money/'+game.slug+'/'} className="small-button"><Bookmark size={14}/>{game.title}</Link>) : <p className="section-copy">{state.storage==='unavailable'?'Browser storage is unavailable.':'Save a game from its earning guide to find it here.'}</p>}</div>;
}

export function OpportunityCard({item,showCosts=true}: {item:Opportunity;showCosts?:boolean}) {
  return <article className="guide-card opportunity-card">
    <small>{methodLabels[item.method]}</small><h3>{item.title}</h3>
    <dl><dt>Eligibility</dt><dd>{item.eligibility}</dd><dt>Skills</dt><dd>{item.skills}</dd><dt>How to start</dt><dd>{item.start}</dd><dt>How payment works</dt><dd>{item.payment}</dd>
      {showCosts&&<><dt>Costs and risks</dt><dd>{item.costs}</dd></>}
    </dl>
    {item.source?<a className="text-link" href={item.source[1]}>{item.source[0]}</a>:<p className="muted">Information not yet verified for a publisher-run coaching program.</p>}
  </article>;
}

export function OpportunityFinder({games}: {games:Choice[]}) {
  const [filters,setFilters]=useState<FinderFilters>({game:'fortnite',region:'Europe',age:18,skill:'Beginner',method:'Any',playstyle:'Any'});
  const update=<K extends keyof FinderFilters,>(key:K,value:FinderFilters[K])=>setFilters({...filters,[key]:value});
  const matches=findOpportunities(filters);
  const game=games.find(game=>game.slug===filters.game)!;
  return <div className="finder">
    <div className="calculator fields finder-fields">
      <label><span>Game</span><select value={filters.game} onChange={event=>update('game',event.target.value)}>{games.map(game=><option key={game.slug} value={game.slug}>{game.title}</option>)}</select></label>
      <label><span>Region</span><select value={filters.region} onChange={event=>update('region',event.target.value as Region)}>{regions.map(region=><option key={region}>{region}</option>)}</select></label>
      <label><span>Age group</span><select value={filters.age} onChange={event=>update('age',Number(event.target.value) as FinderFilters['age'])}><option value={12}>Under 13</option><option value={13}>13–15</option><option value={16}>16–17</option><option value={18}>18+</option></select></label>
      <label><span>Skill level</span><select value={filters.skill} onChange={event=>update('skill',event.target.value as Skill)}>{['Beginner','Intermediate','Advanced'].map(skill=><option key={skill}>{skill}</option>)}</select></label>
      <label><span>Earning method</span><select value={filters.method} onChange={event=>update('method',event.target.value as FinderFilters['method'])}><option value="Any">Any method</option>{methodEntries.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
      <label><span>Playstyle</span><select value={filters.playstyle} onChange={event=>update('playstyle',event.target.value as FinderFilters['playstyle'])}><option>Any</option><option>Casual</option><option>Competitive</option></select></label>
    </div>
    <p className="directory-count" role="status">{matches.length} {matches.length===1?'match':'matches'}. Confirm your country, account and event eligibility with the organizer.</p>
    {matches.length ? <div className="hub-guide-grid">{matches.map(item=><OpportunityCard key={item.id} item={item} showCosts={false}/>)}</div> : <div className="insight"><p>No verified pathways match these selections. Try another playstyle or method, or review the game guide.</p></div>}
    <div className="hub-actions"><Link className="text-link" href={'/make-money/'+game.slug+'/'}>Read the {game.title} earning guide</Link><Link className="text-link" href={'/tools/'+game.planner+'/'}>Open the {game.title} planner</Link></div>
  </div>;
}

const checklist = [
  'Check the minimum age, regional eligibility and guardian requirements',
  'Enable account security and complete required verification in the official portal',
  'Test equipment, settings and communication with the roster',
  'Check latency and have a plan for connection issues',
  'Schedule realistic practice in the event format',
  'Confirm the roster, registration, and check-in deadline',
  'Read scoring, tiebreaks, payout and dispute rules',
];
export function TournamentChecklist() {
  const state=useBrowserData('nexusgg-tournament-checklist',[] as string[],isStringArray);
  const completed=checklist.filter(item=>state.value.includes(item)).length;
  return <div className="calculator checklist">
    <p className="section-copy" role="status">{completed} of {checklist.length} complete</p>
    {checklist.map(item=><label key={item}><input type="checkbox" checked={state.value.includes(item)} disabled={state.storage==='loading'} onChange={event=>state.update(event.target.checked?[...state.value,item]:state.value.filter(value=>value!==item))}/><span>{item}</span></label>)}
    <div className="actions"><button className="small-button" disabled={state.storage==='loading'} onClick={()=>state.update([])}>Reset checklist</button>{state.storage==='unavailable'&&<span role="status">Browser storage unavailable.</span>}</div>
  </div>;
}

const isIncome=(value:unknown):value is Income[]=>Array.isArray(value)&&value.every(item=>
  item && typeof item.id==='string' && typeof item.game==='string' && typeof item.date==='string' && validIncomeDate(item.date) &&
  (item.source==='Other'||Object.hasOwn(methodLabels,item.source))&&currencies.includes(item.currency)&&Number.isSafeInteger(item.amount)&&item.amount>0
);

export function IncomeTracker({games}: {games:Choice[]}) {
  const state=useBrowserData('nexusgg-earned-income',[] as Income[],isIncome);
  const [month,setMonth]=useState('');
  const [error,setError]=useState('');
  const entries=state.value.toSorted((a,b)=>b.date.localeCompare(a.date));
  const gameName=(slug:string)=>games.find(game=>game.slug===slug)?.title??slug;
  const dates=Array.from(new Set(entries.map(item=>item.date.slice(0,7))));
  const filtered=month?entries.filter(item=>item.date.startsWith(month+'-')):entries;
  const save=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const form=event.currentTarget;
    const data=new FormData(form);
    const currency=data.get('currency') as Currency;
    const game=String(data.get('game'));
    const source=data.get('source') as Income['source'];
    const date=String(data.get('date'));
    try {
      if(!validIncomeDate(date)) throw Error('Enter a valid payment date.');
      if(!games.some(item=>item.slug===game)||!currencies.includes(currency)||(source!=='Other'&&!Object.hasOwn(methodLabels,source))) throw Error('Choose a valid game, income source and currency.');
      state.update([...entries,{id:crypto.randomUUID(),game,source,currency,date,amount:parseIncomeAmount(String(data.get('amount')).trim().replace(',','.'),currency)}]);
      setError('');
      setMonth('');
      form.reset();
    }catch(issue){setError((issue as Error).message);}
  };
  const download=()=>{
    const url=URL.createObjectURL(new Blob(['\uFEFF',incomeCsv(filtered,gameName)],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');
    link.href=url;
    link.download='nexusgg-income'+(month?'-'+month:'')+'.csv';
    link.click();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  return <>
    <form className="calculator income-form" onSubmit={save}><div className="fields">
      <label><span>Game</span><select name="game" defaultValue="fortnite">{games.map(game=><option key={game.slug} value={game.slug}>{game.title}</option>)}</select></label>
      <label><span>Income source</span><select name="source">{methodEntries.map(([key,label])=><option key={key} value={key}>{label}</option>)}<option>Other</option></select></label>
      <label><span>Amount received</span><input type="text" inputMode="decimal" name="amount" required placeholder="0.00"/></label>
      <label><span>Currency</span><select name="currency">{currencies.map(currency=><option key={currency}>{currency}</option>)}</select></label>
      <label><span>Payment date</span><input name="date" type="date" required/></label>
    </div>
    <div className="actions"><button className="primary-button" disabled={state.storage==='loading'}>Add payment</button>{error&&<span className="form-error" role="alert">{error}</span>}{state.storage==='unavailable'&&<span role="status">Browser storage is unavailable. Export before closing.</span>}</div></form>
    <section className="content-section"><div className="section-head"><h2>Recorded earnings</h2><button className="small-button" disabled={!filtered.length} onClick={download}><Download size={15}/> Export CSV</button></div>
      <div className="income-results">
        <label><span>View month</span><select value={month} onChange={event=>setMonth(event.target.value)}><option value="">All months</option>{dates.map(date=><option key={date}>{date}</option>)}</select></label>
        <div className="income-totals" role="status">{Object.entries(incomeTotals(entries,month)).map(([currency,amount])=><span key={currency}>{currency} <b>{formatIncome(currency as Currency,amount)}</b></span>)}</div>
      </div>
      {filtered.length ? <ul className="income-list">{filtered.map(item=><li key={item.id}><div><strong>{gameName(item.game)}</strong><span>{item.date} · {item.source==='Other'?'Other':methodLabels[item.source]}</span></div><b>{formatIncome(item.currency,item.amount)}</b><button className="icon-button" aria-label={'Remove '+gameName(item.game)+' payment on '+item.date} onClick={()=>{state.update(entries.filter(entry=>entry.id!==item.id));if(!entries.some(entry=>entry.id!==item.id&&entry.date.startsWith(month+'-')))setMonth('');}}><Trash2 size={16}/></button></li>)}</ul> : <p className="section-copy">No payments recorded for this view.</p>}
    </section>
  </>;
}
