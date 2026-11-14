import { competitions, type Region, type Skill } from './competitions.ts';
import { hubs } from './game-hubs.ts';

export const methodLabels = {
  competition:'Competitive play', video:'Video tutorials', streaming:'Streaming', coaching:'Coaching', development:'Development',
} as const;
export type Method = keyof typeof methodLabels;
type Source = [label:string, url:string];
export type Opportunity = {
  id:string; method:Method; title:string; eligibility:string; skills:string; start:string; payment:string; costs:string;
  source?:Source; minAge?:number; regionalMinimum?:Partial<Record<Region,number>>; skill:Skill; playstyle:'Competitive'|'Casual'|'Both'; regions?:Region[];
};

const youtube:Source = ['YouTube Partner Program eligibility','https://support.google.com/youtube/answer/72851'];
const twitch:Source = ['Twitch Affiliate requirements','https://help.twitch.tv/s/article/joining-the-affiliate-program?language=en_US'];
const roblox:Source = ['Roblox DevEx rules and rates','https://en.help.roblox.com/hc/en-us/articles/13061189551124-Developer-Exchange-Help-and-Information-Page'];
const epic:Source = ['Epic’s Fortnite Developer Program','https://dev.epicgames.com/documentation/fortnite/fortnite-developer-program?lang=en-US'];

const streamingGames = new Set(['counter-strike-2','valorant','fortnite','apex-legends','call-of-duty-warzone','escape-from-tarkov','minecraft','rust','valheim','elden-ring','skyrim','world-of-warcraft','league-of-legends','dota-2','rocket-league','teamfight-tactics','dead-by-daylight','among-us','forza-horizon-5','euro-truck-simulator-2']);
const coachingGames = new Set(['counter-strike-2','valorant','fortnite','apex-legends','rainbow-six-siege','overwatch-2','marvel-rivals','league-of-legends','dota-2','rocket-league','clash-royale','teamfight-tactics','ea-sports-fc','assetto-corsa-competizione']);

const development:Record<string,Opportunity> = {
  fortnite:{id:'fortnite-islands',method:'development',title:'Publish Fortnite islands',eligibility:'Age 18+. Meet Epic’s enrollment requirements and confirm payout support for your country. Real-money payouts require tax and payment setup.',skills:'Creative or UEFN, level design, playtesting, and retention analysis.',start:'Build one short island, observe new players, then apply through Epic’s Creator Portal. Inspect the portal’s current terms before paying for anything.',payment:'Eligible islands can receive a share of engagement payouts and may earn through qualifying transactions. The engagement pool depends on Fortnite revenue and measured engagement.',costs:'Development and moderation take time. Epic lists qualifying purchase routes for enrollment. Check your account before spending.',source:epic,minAge:18,skill:'Intermediate',playstyle:'Both'},
  roblox:{id:'roblox-devex',method:'development',title:'Build experiences and use Developer Exchange',eligibility:'Age 13+, at least 30,000 eligible Earned Robux, and Roblox account, verification, tax and compliance requirements.',skills:'Roblox Studio, Luau, original assets and playtesting.',start:'Publish a small experience through Creator Hub, add appropriate passes, then check DevEx eligibility and apply from Roblox’s creator tools.',payment:'Roblox lists US$0.0038 per qualifying Earned Robux at the standard newer rate, or US$114 per 30,000. Older and special eligible US spend balances can use different rates.',costs:'Studio can be used without buying traffic. Custom assets, moderation and time can add costs. Purchased Robux cannot be made eligible by moving them between accounts.',source:roblox,minAge:13,skill:'Beginner',playstyle:'Casual'},
  minecraft:{id:'minecraft-marketplace',method:'development',title:'Apply to the Minecraft Marketplace Partner Program',eligibility:'Portfolio approval and onboarding are required. Check the partner application for supported locations, age, and business requirements.',skills:'Bedrock content creation, asset ownership, testing and documentation.',start:'Build a small portfolio of original worlds or add-ons with working examples and apply through the official partner page.',payment:'Approved Marketplace creators may earn from sales under their agreement. General per-sale earnings are information not yet verified.',costs:'Budget design and testing time before committing to platform-specific assets.',source:['Minecraft Marketplace Partner Program','https://www.minecraft.net/en-us/partner'],skill:'Intermediate',playstyle:'Casual'},
};

export function opportunitiesFor(game:string): Opportunity[] {
  const hub=hubs[game];
  if(!hub) return [];
  const opportunities:Opportunity[] = [{
    id:'video',method:'video',title:'Publish tutorials on '+hub.subject,eligibility:'YouTube Partner Program is available in supported countries. YouTube ad payout requires an adult AdSense account, which can belong to a parent or guardian when appropriate.',
    skills:'Record original footage and explain a decision that a new player can repeat.',
    start:hub.lesson+' Publish the tutorial and check eligibility in YouTube Studio → Earn.',
    payment:'YouTube ad revenue becomes available after channel eligibility and review. Revenue depends on audience and eligible viewing.',
    costs:'Start with existing capture equipment. Check the publisher’s footage policy, mute music you lack permission to reuse and get consent before including private voice chat.',
    source:youtube,minAge:13,skill:'Beginner',playstyle:'Both',
  }];
  if(streamingGames.has(game)) opportunities.push({
    id:'streaming',method:'streaming',title:'Stream '+hub.subject,eligibility:'Twitch requires users to be at least 13. For minors, refer to guardian and monetization onboarding requirements. Check availability and payout terms for your location.',
    skills:'Live commentary, moderation, and clear audio.',
    start:'Plan a short session around '+hub.focus.toLowerCase()+'. On stream, explain your decisions as you play, then turn one lesson into a clip. Open your Twitch creator dashboard for Affiliate onboarding.',
    payment:'Program features and payout terms depend on account eligibility. Subscriptions, Bits and ad proceeds may vary.',
    costs:'Budget upload bandwidth and time. Hide private account details and use your own broadcast footage.',
    source:twitch,minAge:13,skill:'Beginner',playstyle:'Both',
  });
  if(coachingGames.has(game)) opportunities.push({
    id:'coaching',method:'coaching',title:'Offer replay review or a structured lesson',eligibility:'This is independent client work. The finder shows it for adults. Verify whether contracts and payment providers are available in your country.',
    skills:'Demonstrate consistent results and keep a sample lesson on '+hub.focus.toLowerCase()+'.',
    start:hub.lesson+' Use that sample to define one review deliverable and find clients through communities that allow coaching listings.',
    payment:'Set a clear rate and written scope per review or session. Income depends on booked work, fees and refunds.',
    costs:'Include preparation time, disputes and provider fees. Review replays without asking for client passwords or offering account boosting.',
    minAge:18,skill:'Advanced',playstyle:'Competitive',
  });
  if(development[game]) opportunities.push(development[game]);
  const event=competitions.find(item=>item.game===game && item.game!=='dota-2');
  if(event) opportunities.unshift({
    id:'competition',method:'competition',title:event.name,eligibility:event.age+' '+event.region+' '+event.requirements,
    skills:'Practice the current competition format and review your consistency under its rules.',
    start:'Open the organizer page, confirm registration for your region, and follow the official roster or in-client entry instructions.',
    payment:event.prizes,costs:'Check official entry costs, equipment, travel and team costs before committing. Typical outcomes include no cash payment.',
    source:['Official organizer information',event.join],minAge:event.minAge,regionalMinimum:event.regionalMinimum,skill:event.skill,playstyle:'Competitive',regions:event.regions,
  });
  return opportunities;
}

const skillOrder: Skill[] = ['Beginner','Intermediate','Advanced'];
export type FinderFilters = { game:string; region:Region; age:12|13|16|18; skill:Skill; method:Method|'Any'; playstyle:'Any'|'Casual'|'Competitive' };
export function findOpportunities(filters:FinderFilters) {
  return opportunitiesFor(filters.game).filter(item =>
    (item.regionalMinimum?.[filters.region] ?? item.minAge ?? 13) <= filters.age &&
    skillOrder.indexOf(item.skill) <= skillOrder.indexOf(filters.skill) &&
    (filters.method==='Any' || filters.method===item.method) &&
    (!item.regions || item.regions.includes(filters.region)) &&
    (filters.playstyle==='Any' || item.playstyle==='Both' || filters.playstyle===item.playstyle)
  );
}

export const currencies = ['EUR','USD','GBP','CAD','AUD','SEK','JPY'] as const;
export type Currency = typeof currencies[number];
export type Income = {id:string; game:string; source:Method|'Other'; currency:Currency; amount:number; date:string};

export function parseIncomeAmount(raw:string,currency:Currency) {
  const precision = currency==='JPY' ? 0 : 2;
  const pattern = precision ? /^\d+(?:\.\d{1,2})?$/ : /^\d+$/;
  const value = Number(raw);
  if (!pattern.test(raw) || !Number.isFinite(value) || value<=0 || value>100000000) {
    throw Error(precision ? 'Enter a positive amount with up to two decimal places.' : 'Enter a positive whole-yen amount.');
  }
  return Math.round(value * 10 ** precision);
}

export const validIncomeDate=(value:string)=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp=Date.parse(value+'T00:00:00Z');
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0,10)===value;
};

export function incomeTotals(entries:Income[], month='') {
  const totals:Partial<Record<Currency,number>>={};
  for (const entry of entries) {
    if(month && !entry.date.startsWith(month+'-')) continue;
    totals[entry.currency]=(totals[entry.currency]??0)+entry.amount;
  }
  return totals;
}

export const formatIncome = (currency:Currency,minor:number) =>
  new Intl.NumberFormat('en',{style:'currency',currency}).format(minor/(currency==='JPY'?1:100));

export function incomeCsv(entries:Income[], gameName:(slug:string)=>string) {
  const cell=(value:string)=>'"'+(/^[=+\-@\t\r]/.test(value)?"'":'')+value.replaceAll('"','""')+'"';
  return ['Date,Game,Source,Currency,Amount',...entries.map(item=>[
    item.date,gameName(item.game),item.source==='Other'?'Other':methodLabels[item.source],item.currency,
    (item.amount/(item.currency==='JPY'?1:100)).toFixed(item.currency==='JPY'?0:2),
  ].map(cell).join(','))].join('\r\n');
}
