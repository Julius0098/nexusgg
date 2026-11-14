import { games } from './catalog.ts';
import { hubs, gamePlanSlug } from './game-hubs.ts';
import { anyDrop, number, otherFov, percent, ratio, requiredWins, xp, yaw, sensitivity } from './math.ts';

export type Category = 'Aim & Input' | 'Match Stats' | 'Sandbox' | 'Economy' | 'Probability' | 'Utility';
export type Field = { label: string; initial: string; options?: string[]; min?: number; max?: number; integer?: boolean; precision?: number };
export type Tool = {
  slug: string;
  title: string;
  category: Category;
  desc: string;
  formula: string;
  example: string;
  tip: string;
  fields?: Field[];
  run?: (values: string[]) => string;
  source?: [string, string];
};

const n = (label: string, initial: number, min = 0, max = 10000000): Field => ({ label, initial: String(initial), min, max });
const i = (label: string, initial: number, min = 0, max = 10000000): Field => ({ ...n(label, initial, min, max), integer: true });
const choice = (label: string, options: string[], initial = options[0]): Field => ({ label, options, initial });
const p = (label: string, initial: number): Field => n(label, initial, 0, 100);
const output = (value: number, unit: string) => number(value) + ' ' + unit;
const f = (calculate: (...values: number[]) => string) => (values: string[]) => calculate(...values.map(Number));
function share(part: number, total: number, label: string) {
  if (part > total) throw Error('The first count must be at most the total.');
  return percent(100 * ratio(part, total, label));
}

const coordinates = (x: number, z: number, factor: number) => 'X ' + number(x * factor) + ' / Z ' + number(z * factor);
const coords: Field[] = [i('X coordinate', 800, -29999984, 29999984), i('Z coordinate', -400, -29999984, 29999984)];
const grossFields = [i('Price per sale (Robux)', 100), i('Sales', 20), p('Platform fee (%)', 30)];
const revenue = (price: number, sales: number, fee: number) => price * sales * (1 - fee / 100);
const minecraft: [string, string] = ['Minecraft Wiki · Nether portal', 'https://minecraft.wiki/w/Nether_portal'];
const aim: [string, string] = ["KovaaK’s sensitivity documentation", 'https://kovaaks.com/kovaaks/sens-converter'];
const aimTool: Tool = {
  slug: 'sensitivity-converter', title: 'Sensitivity Converter', category: 'Aim & Input',
  desc: 'Carry the same mouse travel per full turn across supported shooters.',
  formula: 'Multiply source sensitivity by the source yaw, then divide by the target yaw. At the same DPI, the result preserves cm/360.',
  example: 'Counter-Strike 2 at 1.5 and 800 DPI converts to about 0.472 in Valorant, with about 34.64 cm per turn.',
  tip: 'Match hip-fire only. Scoped multipliers, acceleration and field of view can make aiming feel different. eDPI uses the target sensitivity and is comparable within a single game.',
  fields: [choice('From game', Object.keys(yaw)), choice('To game', Object.keys(yaw), 'Valorant'), i('Mouse DPI', 800, 1, 100000), n('In-game sensitivity', 1.5, 0.000001, 1000)],
  run: ([source, target, dpi, sens]) => {
    const result = sensitivity(source, target, Number(dpi), Number(sens));
    return number(result.converted);
  },
  source: aim,
};

const originalTools: Tool[] = [
  aimTool,
  { slug: 'crosshair-builder', title: 'Crosshair Builder', category: 'Aim & Input', desc: 'Tune a reticle against light, dark and high-contrast backgrounds.', formula: 'The preview places four mirrored arms around a central gap. Outline, tint and opacity apply to the composed reticle.', example: 'Try a cyan crosshair with a 4 px gap, 10 px arms and a 1 px outline.', tip: 'Copy the settings as a portable note. Match the controls available in your game.' },
  { slug: 'nether-coordinates', title: 'Nether Coordinate Calculator', category: 'Sandbox', desc: 'Translate Overworld positions into the Nether at the 8:1 ratio.', formula: 'Divide Overworld X and Z by 8. Y is independent of the horizontal scale.', example: '(800, −400) in the Overworld maps to (100, −50) in the Nether.', tip: 'The result gives ideal coordinates. For a Java Edition block position, round X and Z down. For example, −0.375 rounds down to −1. Choose a safe Y level and check nearby portals when you arrive.', fields: coords, run: f((x, z) => coordinates(x, z, 1 / 8)), source: minecraft },
  { slug: 'reaction-time-test', title: 'Reaction Time Test', category: 'Aim & Input', desc: 'Measure how quickly you respond after a random cue.', formula: 'The timer measures the interval between the cue frame and your input with the browser’s performance clock.', example: 'Run three attempts on the same device and compare your average.', tip: 'Click, tap, or use Enter or Space. A press before the cue resets the attempt. Display and input latency affect the reading.' },
  { slug: 'loot-probability', title: 'Loot Probability Calculator', category: 'Probability', desc: 'Find the odds of getting at least one drop across multiple tries.', formula: 'P(at least one) = 1 − (1 − p) to the power of attempts.', example: 'Ten tries at 5% each give about a 40.13% chance of at least one drop.', tip: 'Use this for independent rolls with fixed odds. Pity timers and changing drop pools require different inputs.', fields: [p('Chance per attempt (%)', 5), i('Attempts', 10)], run: f((chance, attempts) => percent(anyDrop(chance, attempts))) },
  { slug: 'required-wins', title: 'Required Wins Calculator', category: 'Match Stats', desc: 'See the minimum consecutive wins needed for a target record.', formula: 'Solve (wins + x) / (matches + x) ≥ target and round x up to a whole match.', example: 'With 45 wins in 100 games, you need 10 consecutive wins to reach 50%.', tip: 'Enter total games played. This scenario assumes every upcoming game is a win.', fields: [i('Wins', 45), i('Matches', 100), { ...p('Target win rate (%)', 50), precision: 5 }], run: f((wins, matches, target) => output(requiredWins(wins, matches, target), 'wins')) },
  { slug: 'stack-calculator', title: 'Minecraft Stack Calculator', category: 'Sandbox', desc: 'Break your inventory into full stacks and leftover items.', formula: 'Full stacks = floor(items ÷ max stack size). Leftover = remainder.', example: '150 items stack into 2 × 64 plus 22 loose items.', tip: 'Choose a capacity of 64, 16, or 1 to match the item.', fields: [i('Items', 150), choice('Items per stack', ['64', '16', '1'])], run: f((items, size) => number(Math.floor(items / size)) + ' stacks + ' + number(items % size) + ' items') },
  { slug: 'portal-coordinate-converter', title: 'Portal Coordinate Converter', category: 'Sandbox', desc: 'Find portal alignment coordinates in either dimension.', formula: 'Divide X and Z by 8 when traveling to the Nether and multiply them by 8 when traveling to the Overworld.', example: 'Nether (100, −50) maps to Overworld (800, −400).', tip: 'This gives a coordinate target. Existing portals, Y levels, and game boundaries can affect the actual link.', fields: [choice('Direction', ['Nether → Overworld', 'Overworld → Nether']), { ...coords[0], initial: '100' }, { ...coords[1], initial: '-50' }], run: ([direction, x, z]) => {
    const factor = direction === 'Nether → Overworld' ? 8 : 1 / 8;
    if (Math.max(Math.abs(Number(x) * factor), Math.abs(Number(z) * factor)) > 29999984) throw Error('The calculated target exceeds the default world border.');
    return coordinates(Number(x), Number(z), factor);
  }, source: minecraft },
  { slug: 'item-quantity', title: 'Minecraft Item Quantity Calculator', category: 'Sandbox', desc: 'Work out the inputs for a batch of recipes before you start crafting.', formula: 'Crafts = ceil(items wanted ÷ output per craft). Multiply crafts by the ingredient cost per craft.', example: 'Ten outputs at four per craft need three crafts. At one input each, bring three inputs.', tip: 'Run an ingredient at a time for recipes with several materials.', fields: [i('Output wanted', 10), i('Output per craft', 4, 1), i('Ingredient per craft', 1, 1)], run: f((wanted, per, ingredient) => output(Math.ceil(wanted / per) * ingredient, 'ingredients')) },
  { slug: 'minecraft-xp', title: 'Minecraft XP Calculator', category: 'Sandbox', desc: 'Calculate the Java Edition XP points needed between two levels.', formula: 'Subtract the XP total at the starting level from the total at the target. The cumulative formula changes above levels 16 and 31.', example: 'Starting at the beginning of level 0, reaching level 30 takes 1,395 XP.', tip: 'Start at the beginning of a level. If the current bar is partially filled, subtract the points already in that bar.', fields: [i('Current level', 0, 0, 100000), i('Target level', 30, 0, 100000)], run: f((start, end) => {
    if (start > end) throw Error('Target level must be at least the starting level.');
    return output(xp(end) - xp(start), 'XP');
  }), source: ['Minecraft Wiki · Experience', 'https://minecraft.wiki/w/Experience'] },
  { slug: 'robux-value', title: 'Robux Value Calculator', category: 'Economy', desc: 'Estimate the purchase value of an amount of Robux using a bundle you choose.', formula: 'Value = Robux wanted × bundle price ÷ bundle Robux.', example: 'At 800 Robux for 10 currency units, 200 Robux is worth 2.50 units at the same rate.', tip: 'Enter your own store bundle; taxes, fees and cash-out eligibility are separate.', fields: [i('Robux to value', 200), i('Robux in bundle', 800, 1), n('Bundle price (your currency)', 10)], run: f((amount, bundle, cost) => output(amount * cost / bundle, 'currency units')) },
  { slug: 'gamepass-earnings', title: 'Game Pass Earnings Calculator', category: 'Economy', desc: 'Estimate net Robux from pass sales using your own fee assumption.', formula: 'Estimated receipts = price × sales × (1 − fee percentage ÷ 100).', example: '20 sales of a 100 Robux pass at an assumed 30% fee yields an estimated 1,400 Robux.', tip: 'Check the fee for your sale type. Transaction-level rounding and other adjustments can change the payout.', fields: grossFields, run: f((price, sales, fee) => output(revenue(price, sales, fee), 'Robux')) },
  { slug: 'developer-revenue', title: 'Roblox Developer Revenue Estimator', category: 'Economy', desc: 'Estimate cash proceeds using eligible earned Robux and a rate you enter.', formula: 'Eligible Robux ÷ 1,000 × entered cash per 1,000 Robux.', example: '10,000 eligible Robux at a hypothetical 3.50 per thousand yields 35 currency units.', tip: 'The rate is an example. Use the applicable exchange rate and confirm which earned Robux qualify.', fields: [i('Eligible earned Robux', 10000), n('Cash per 1,000 Robux', 3.5)], run: f((robux, rate) => output(robux * rate / 1000, 'currency units')) },
  { slug: 'kd-ratio', title: 'K/D Ratio Calculator', category: 'Match Stats', desc: 'Calculate kills per death over one match or a full session.', formula: 'Divide total kills by total deaths.', example: '18 kills and 12 deaths gives a K/D of 1.5.', tip: 'With kills and zero deaths the mathematical ratio is infinite. Game scoreboards can display it differently.', fields: [i('Kills', 18), i('Deaths', 12)], run: f((kills, deaths) => deaths ? number(kills / deaths) : kills ? '∞ (zero deaths)' : 'Undefined (0 / 0)') },
  { slug: 'win-rate', title: 'Win Rate Calculator', category: 'Match Stats', desc: 'Turn wins and total matches into a percentage.', formula: 'Divide wins by matches and multiply by 100.', example: '27 wins in 50 matches gives a 54% win rate.', tip: 'Choose whether games that ended in a draw count toward your total and use that convention consistently.', fields: [i('Wins', 27), i('Matches', 50)], run: f((wins, games) => share(wins, games, 'Matches')) },
  { slug: 'average-damage', title: 'Average Damage Calculator', category: 'Match Stats', desc: 'Track average damage per match or round.', formula: 'Divide total damage by the number of matches or rounds.', example: '2,200 damage over 4 matches gives 550 damage per match.', tip: 'Use matching numerator and denominator periods when comparing sessions.', fields: [n('Total damage', 2200), i('Matches or rounds', 4)], run: f((damage, matches) => output(ratio(damage, matches, 'Matches or rounds'), 'damage per interval')) },
  { slug: 'headshot-percentage', title: 'Headshot Percentage Calculator', category: 'Match Stats', desc: 'Calculate your headshot share from one consistent count.', formula: 'Headshots ÷ total hits × 100.', example: '12 headshots out of 40 total hits gives 30%.', tip: 'For a headshot-kill rate, enter headshot kills and total kills in the same fields.', fields: [i('Headshots', 12), i('Total hits', 40)], run: f((hits, total) => share(hits, total, 'Total hits')) },
  { slug: 'edpi', title: 'eDPI Calculator', category: 'Aim & Input', desc: 'Combine mouse DPI and your in-game sensitivity.', formula: 'Effective DPI = mouse DPI × sensitivity.', example: '800 DPI and 0.4 sensitivity gives 320 eDPI.', tip: 'Compare eDPI within the same game. Use the sensitivity converter across games.', fields: [i('Mouse DPI', 800, 1, 100000), n('Game sensitivity', 0.4, 0.000001, 1000)], run: f((dpi, sens) => number(dpi * sens)) },
  { slug: 'cps-test', title: 'Clicks Per Second Test', category: 'Aim & Input', desc: 'Measure your click speed in a five-second interval.', formula: 'Clicks per second = counted inputs ÷ five seconds.', example: '35 recorded clicks in five seconds equals 7 CPS.', tip: 'The opening press starts the clock. Only subsequent clicks in the window count.' },
  { slug: 'fov-converter', title: 'FOV Converter', category: 'Aim & Input', desc: 'Translate horizontal and vertical perspective FOV at any aspect ratio.', formula: 'Target FOV = 2 × atan(tan(source FOV ÷ 2) × axis ratio), with angles converted from degrees.', example: '90° horizontal at 16:9 corresponds to about 58.72° vertical.', tip: 'Select the correct axis and enter the actual viewport ratio. Games can normalize FOV to a reference aspect ratio.', fields: [choice('Direction', ['Horizontal → vertical', 'Vertical → horizontal']), n('Source FOV (degrees)', 90, 0.01, 179.99), n('Aspect width', 16, 0.01, 10000), n('Aspect height', 9, 0.01, 10000)], run: ([direction, angle, width, height]) => number(otherFov(Number(angle), Number(width), Number(height), direction)) + '°' },
  { slug: 'session-timer', title: 'Gaming Session Timer', category: 'Utility', desc: 'Set a countdown for practice, warmup, or a planned break.', formula: 'The timer displays the remaining time to a fixed end timestamp and keeps its deadline while the tab is backgrounded.', example: 'Set 25 minutes for your practice session and pause between drills.', tip: 'Keep the page open while the timer runs.' },
  { slug: 'crafting-quantity', title: 'Crafting Quantity Calculator', category: 'Sandbox', desc: 'Scale recipe inputs for a specific number of crafting batches.', formula: 'Total ingredient cost = input per batch × batches.', example: 'Eight batches that need six iron each take 48 iron.', tip: 'Repeat the calculation for each ingredient in a recipe.', fields: [i('Ingredient per batch', 6), i('Number of batches', 8)], run: f((ingredient, batches) => output(ingredient * batches, 'ingredients')) },
  { slug: 'resource-calculator', title: 'Resource Calculator', category: 'Sandbox', desc: 'Find your remaining material requirement and the runs to cover it.', formula: 'Remaining = max(0, target − current). Runs = ceil(remaining ÷ yield).', example: 'A 500 target, 200 on hand and 45 per run leaves 300 to gather over 7 runs.', tip: 'Enter a conservative yield when drops are variable.', fields: [i('Target stock', 500), i('In storage', 200), i('Average per run', 45, 1)], run: f((target, have, run) => output(Math.max(0, target - have), 'left') + ' / ' + output(Math.ceil(Math.max(0, target - have) / run), 'runs')) },
  { slug: 'drop-chance', title: 'Drop Chance Calculator', category: 'Probability', desc: 'Estimate the chance of a single drop from recorded attempts.', formula: 'Observed rate = recorded drops ÷ attempts × 100. Enter attempts that produced the item, counting each attempt once.', example: '3 successful attempts in 120 runs gives an observed rate of 2.5%.', tip: 'Small samples fluctuate. Record all attempts, including unsuccessful ones.', fields: [i('Successful attempts', 3), i('Attempts', 120)], run: f((drops, runs) => share(drops, runs, 'Attempts')) },
  { slug: 'level-progression', title: 'Level Progression Calculator', category: 'Utility', desc: 'Find the XP between levels in a progression system with a fixed or linear cost per level.', formula: 'Sum the arithmetic series across the level difference. Enter the cost to go from your current level to the first next level.', example: 'Five levels at 100 XP each, increasing by 20 per level, need 700 XP.', tip: 'For fixed-level costs enter an increase of zero. Games with custom XP curves require their own formulas.', fields: [i('Current level', 10), i('Target level', 15), i('First level cost (XP)', 100), i('Cost increase per level (XP)', 20)], run: f((start, end, first, delta) => {
    if (end < start) throw Error('Target level must be at least the current level.');
    const count = end - start;
    return output(count * (2 * first + (count - 1) * delta) / 2, 'XP');
  }) },
  { slug: 'time-to-goal', title: 'Time-to-Goal Calculator', category: 'Utility', desc: 'Estimate playtime needed to reach a goal at a given hourly pace.', formula: 'Hours = max(0, target − current) ÷ units earned per hour.', example: 'With 180 out of 500 and 40 earned per hour, you need 8 more hours.', tip: 'Measure a typical pace that includes travel, queue, or downtime.', fields: [n('Target', 500), n('Current progress', 180), n('Units per hour', 40, 0.000001)], run: f((target, current, rate) => output(Math.max(0, target - current) / rate, 'hours')) },
  { slug: 'currency-converter', title: 'Currency Converter', category: 'Economy', desc: 'Convert game or real currency using a manually entered rate.', formula: 'Multiply the source amount by target currency units received per source unit.', example: '250 tokens at a rate of 0.4 credits per token converts to 100 credits.', tip: 'Use a rate you observed. For the reverse direction, use its reciprocal.', fields: [n('Source amount', 250), n('Target units per source unit', 0.4, 0.000001)], run: f((amount, rate) => output(amount * rate, 'target units')) },
  { slug: 'percentage-calculator', title: 'Percentage Calculator', category: 'Utility', desc: 'Find the part of a total represented by a percentage.', formula: 'Amount × percentage ÷ 100.', example: '15% of 240 is 36.', tip: 'For a discount, subtract the calculated amount from the original total.', fields: [n('Amount', 240), n('Percentage (%)', 15, 0, 100000)], run: f((amount, percentage) => number(amount * percentage / 100)) },
];

const rankSource: [string,string] = ['Riot Games · Rank Rating', 'https://support.riotgames.com/en-us/valorant/gameplay/rank-rating-rr-for-iron-through-ascendant-ranks'];
const newTools: Tool[] = [
  {slug:'valorant-rank-progression',title:'Valorant Rank Progression Calculator',category:'Match Stats',desc:'Estimate the consecutive wins required to reach your next promotion threshold.',formula:'Subtract current RR from 100 and divide by the entered gain per win. Round the result up.',example:'At 68 RR and an assumed 18 RR per win, two wins would clear the threshold.',tip:'For Iron through Ascendant tiers that promote at 100 RR. This model assumes an unchanged RR gain and consecutive wins. Immortal thresholds and placement matches differ.',fields:[i('Current RR',68,0,99),i('Estimated RR per win',18,1,100)],run:f((current,gain)=>output(Math.ceil((100-current)/gain),'wins')),source:rankSource},
  {slug:'fortnite-sensitivity',title:'Fortnite Sensitivity Calculator',category:'Aim & Input',desc:'Match your mouse sensitivity when switching DPI and calculate targeting and scope equivalents.',formula:'Game sensitivity percentage × old DPI ÷ new DPI preserves the same eDPI. Multiply by the targeting or scope multiplier for effective X-axis sensitivity.',example:'800 to 1600 DPI with 8% X and Y gives 4% on both axes. A 50% targeting multiplier yields 2% effective X sensitivity.',tip:'Use Fortnite’s mouse settings. Changes to controller look, FOV, or a separate multiplier need their own adjustments.',fields:[i('Current DPI',800,1,100000),i('New DPI',1600,1,100000),n('X-axis sensitivity (%)',8,0.01,100),n('Y-axis sensitivity (%)',8,0.01,100),p('Targeting multiplier (%)',50),p('Scope multiplier (%)',40)],run:f((from,to,x,y,target,scope)=>{
    const nextX=x*from/to;
    const nextY=y*from/to;
    if(nextX>100 || nextY>100) throw Error('The matched axis value exceeds 100%. Try a higher new DPI.');
    return 'X '+percent(nextX)+' · Y '+percent(nextY)+' · ADS X '+percent(nextX*target/100)+' · Scope X '+percent(nextX*scope/100);
  }),source:['Fortnite Wiki · Mouse settings','https://fortnite.fandom.com/wiki/Settings']},
  {slug:'mouse-dpi-match',title:'Mouse DPI Match Calculator',category:'Aim & Input',desc:'Find the DPI needed to preserve mouse travel when changing sensitivity in the same game.',formula:'Target DPI = current DPI × current sensitivity ÷ target sensitivity.',example:'800 DPI at 1.5 matches 1,200 DPI at 1.0.',tip:'Pick the closest setting your hardware supports. This calculation assumes the game’s yaw and acceleration settings stay the same.',fields:[i('Current DPI',800,1,100000),n('Current sensitivity',1.5,0.000001),n('Target sensitivity',1,0.000001)],run:f((dpi,from,to)=>output(dpi*from/to,'DPI'))},
  {slug:'aspect-ratio-compare',title:'Resolution & Aspect Ratio Comparison',category:'Aim & Input',desc:'Compare two render resolutions, their proportions, and how many pixels each renders.',formula:'Reduce width and height by their greatest common divisor. Compare pixel counts by dividing the second area by the first.',example:'1920×1080 is 16:9. 1280×960 is 4:3 and renders about 59.26% as many pixels.',tip:'This shows render workload from pixel count alone. GPU render time, stretched presentation, and black bars depend on your settings.',fields:[i('First width',1920,1,16384),i('First height',1080,1,16384),i('Second width',1280,1,16384),i('Second height',960,1,16384)],run:f((a,b,c,d)=>{
    const aspect=(w:number,h:number):string=>{let x=w,y=h;while(y)[x,y]=[y,x%y];return w/x+':'+h/x;};
    return aspect(a,b)+' → '+aspect(c,d)+' · '+percent(c*d/(a*b)*100)+' of first pixel count';
  })},
  {slug:'roblox-marketplace-fee',title:'Roblox Marketplace Fee Calculator',category:'Economy',desc:'Estimate your share of sales using the creator payout percentage for the actual sale channel.',formula:'Price × sales × creator share percentage ÷ 100.',example:'A 100 Robux listing, 20 sales and an illustrative 30% creator share yield an estimated 600 Robux.',tip:'Use the creator share for your item type and sale surface. Roblox calculates actual proceeds and eligibility.',fields:[i('Item price (Robux)',100),i('Sales',20),p('Creator share (%)',30)],run:f((price,sales,share)=>output(price*sales*share/100,'estimated Robux')),source:['Roblox Creator Hub · Marketplace fees and commissions','https://create.roblox.com/docs/marketplace/marketplace-fees-and-commissions']},
];

const plannerTools = games.map(game => {
  const hub = hubs[game.slug];
  const unit = hub.unit;
  const common = {slug:gamePlanSlug(game.slug),title:game.title + ' · ' + hub.focus,tip:hub.drill};
  switch (hub.model) {
    case 'match': return {...common, category:'Match Stats',desc:'Measure the success rate for your chosen '+unit+' drill.',formula:'Divide successful attempts by total attempts, then multiply by 100.',example:'Completing 8 of 12 attempts gives a success rate of about 66.67%.',fields:[i('Successful attempts',8),i('Total attempts',12,1)],run:f((success,total)=>share(success,total,'Attempts'))};
    case 'farm': return {...common,category:'Sandbox',desc:'Plan your next '+unit+' using your observed yield and time.',formula:'Divide the remaining target by the measured yield per run and round up. Multiply runs by measured minutes per run.',example:'With 30 of 150 units, a 40-unit yield and 8-minute runs, budget 3 runs and 24 minutes.',fields:[i('Target units',150),i('Stock available',30),n('Units per '+unit,40,0.01),n('Minutes per run',8,0.01)],run:f((goal,stock,yieldPerRun,minutes)=>{
      const runs=Math.ceil(Math.max(goal-stock,0)/yieldPerRun);
      return output(runs,'runs')+' · '+output(runs*minutes,'min');
    })};
    case 'loot': return {...common,category:'Probability',desc:'Estimate the chance of at least one success from a known chance per '+unit+'.',formula:'Subtract the probability of missing every independent attempt from one.',example:'At 5% per attempt, 10 eligible tries give about 40.13% odds of getting at least one.',fields:[p('Chance per '+unit+' (%)',5),i('Eligible attempts',10)],run:f((chance,tries)=>percent(anyDrop(chance,tries)))};
    case 'race': return {...common,category:'Utility',desc:'Compare average time to a target and estimate a full stint.',formula:'Average lap time = elapsed seconds ÷ clean laps. Project the stint by multiplying this average by the planned lap count.',example:'Six 90-second laps average 90 seconds. At that pace, ten laps take 15 minutes.',fields:[n('Total clean-lap seconds',540,0.01),i('Clean laps completed',6,1),n('Target lap seconds',90,0.01),i('Planned laps',10,1)],run:f((elapsed,count,target,laps)=>{
      const average=elapsed/count;
      const delta=average-target;
      return output(average,'s / lap')+' · '+(delta>0?'+':'')+output(delta,'s vs target')+' · '+output(average*laps/60,'min projected');
    })};
    case 'budget': return {...common,category:'Economy',desc:'Compare the full '+unit+' budget against your target limit.',formula:'Multiply the cost per activity by your planned count, add fixed costs, and subtract the total from the available budget.',example:'Five activities at 30 currency units each plus 20 in fixed costs use 170 units of a 200-unit budget.',fields:[n('Available budget',200),n('Cost per '+unit,30),i('Planned activities',5),n('Total fixed costs',20)],run:f((budget,cost,count,fixed)=>{
      const total=cost*count+fixed;
      return output(total,'used')+' · '+output(Math.abs(budget-total),budget>=total?'remaining':'over budget');
    })};
    case 'pace': return {...common,category:'Utility',desc:'Use your own observations to estimate '+unit+' per hour and the time to your next goal.',formula:'Hourly pace = output ÷ elapsed minutes × 60. Divide remaining units by pace to estimate hours.',example:'40 units in 30 minutes is 80 per hour. At that pace, another 120 takes 1.5 hours.',fields:[n('Measured '+unit,40,0.01),n('Elapsed minutes',30,0.01),n('Units remaining',120)],run:f((amount,minutes,left)=>{
      const hourly=amount*60/minutes;
      return output(hourly,'per hour')+' · '+output(left/hourly,'hours remaining');
    })};
  }
}) satisfies Tool[];

export const tools: Tool[] = [...originalTools,...newTools,...plannerTools];

export const categories: Category[] = ['Aim & Input', 'Match Stats', 'Sandbox', 'Economy', 'Probability', 'Utility'];
export const categorySlug = (name: string) => name.toLowerCase().replace(' & ', '-').replaceAll(' ', '-');
export const getTool = (slug: string) => tools.find(tool => tool.slug === slug);

export function validateTool(tool: Tool, values: string[]) {
  if (!tool.fields || !tool.run || values.length !== tool.fields.length) throw Error('This calculation is unavailable.');
  tool.fields.forEach((field, index) => {
    const raw = values[index].trim();
    if (field.options) {
      if (!field.options.includes(raw)) throw Error('Choose a valid option for ' + field.label + '.');
      return;
    }
    const value = Number(raw);
    if (!raw || !Number.isFinite(value)) throw Error('Enter a number for ' + field.label + '.');
    if (field.integer && !Number.isInteger(value)) throw Error(field.label + ' must be a whole number.');
    if (value < field.min! || value > field.max!) throw Error(field.label + ' must be between ' + field.min + ' and ' + field.max + '.');
    if (field.precision && Math.abs(value * 10 ** field.precision - Math.round(value * 10 ** field.precision)) > 1e-6) throw Error(field.label + ' supports up to ' + field.precision + ' decimal places.');
  });
  return tool.run(values);
}
