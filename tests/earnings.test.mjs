import test from 'node:test';
import assert from 'node:assert/strict';
import { games } from '../lib/catalog.ts';
import { competitions } from '../lib/competitions.ts';
import { hubs } from '../lib/game-hubs.ts';
import { findOpportunities, formatIncome, incomeCsv, incomeTotals, opportunitiesFor, parseIncomeAmount, validIncomeDate } from '../lib/earnings.ts';
import { includesTerms } from '../lib/search.ts';

test('all 50 earning guides have an original subject, starting lesson and a sourced method',()=>{
  assert.equal(Object.keys(hubs).length,50);
  const subjects=new Set();
  for(const game of games){
    subjects.add(hubs[game.slug].subject);
    assert.ok(opportunitiesFor(game.slug).some(item=>item.source?.[1].startsWith('https://')),game.slug);
  }
  assert.equal(subjects.size,50);
  assert.ok(competitions.every(item=>games.some(game=>game.slug===item.game)));
});

test('Fortnite eligibility filters by age, region, skill, method and playstyle',()=>{
  const input={game:'fortnite',region:'Europe',age:18,skill:'Advanced',method:'competition',playstyle:'Competitive'};
  assert.equal(findOpportunities(input)[0].title,'Fortnite Cash Cups and FNCS');
  assert.equal(findOpportunities({...input,age:12}).length,0);
  assert.equal(findOpportunities({...input,age:13}).length,1);
  assert.equal(findOpportunities({...input,region:'Africa'}).length,0);
  assert.equal(findOpportunities({...input,skill:'Beginner'}).length,0);
  assert.equal(findOpportunities({...input,playstyle:'Casual'}).length,0);
  assert.equal(findOpportunities({...input,method:'development',age:16}).length,0);
  assert.equal(findOpportunities({...input,method:'development'}).length,1);
});

test('verified creator pathways appear only for relevant games',()=>{
  const input={game:'roblox',region:'Europe',age:13,skill:'Beginner',method:'development',playstyle:'Casual'};
  assert.equal(findOpportunities(input)[0].id,'roblox-devex');
  assert.equal(findOpportunities({...input,game:'subnautica'}).length,0);
  assert.equal(findOpportunities({...input,game:'roblox',age:12}).length,0);
});

test('regional age groups use conservative Apex restrictions',()=>{
  const input={game:'apex-legends',region:'Europe',age:16,skill:'Advanced',method:'competition',playstyle:'Competitive'};
  assert.equal(findOpportunities(input).length,1);
  assert.equal(findOpportunities({...input,region:'Asia'}).length,0);
  assert.equal(findOpportunities({...input,region:'Asia',age:18}).length,1);
});

test('income uses currency minor units and rejects bad dates and amounts',()=>{
  assert.equal(parseIncomeAmount('19.99','EUR'),1999);
  assert.equal(parseIncomeAmount('101','JPY'),101);
  assert.equal(formatIncome('EUR',200),'€2.00');
  for(const invalid of ['0','-2','3.333','1e2','NaN','']) assert.throws(()=>parseIncomeAmount(invalid,'EUR'));
  assert.throws(()=>parseIncomeAmount('2.22','JPY'));
  assert.equal(validIncomeDate('2026-02-29'),false);
  assert.equal(validIncomeDate('2028-02-29'),true);
});

test('income is grouped by month and currency and excluded currencies are never summed',()=>{
  const entries=[
    {id:'1',game:'fortnite',source:'competition',currency:'USD',amount:30000,date:'2026-11-13'},
    {id:'2',game:'roblox',source:'development',currency:'EUR',amount:40000,date:'2026-11-12'},
    {id:'3',game:'fortnite',source:'video',currency:'EUR',amount:20000,date:'2026-10-14'},
  ];
  assert.deepEqual(incomeTotals(entries),{USD:30000,EUR:60000});
  assert.deepEqual(incomeTotals(entries,'2026-11'),{USD:30000,EUR:40000});
  assert.match(incomeCsv(entries, ()=>'A "quoted" game'),/"A ""quoted"" game"/);
  assert.match(incomeCsv(entries, ()=>'=1+1'),/"'=1\+1"/);
  assert.match(incomeCsv(entries, ()=>'Fortnite'),/"USD","300\.00"/);
});

test('game search accepts accents, multiple terms and aliases',()=>{
  assert.ok(includesTerms('Pokémon GO Strategy', 'pokemon strategy'));
  assert.ok(includesTerms('Counter-Strike 2 CS2', 'cs2'));
  assert.equal(includesTerms('Fortnite', 'fortnite minecraft'),false);
});
