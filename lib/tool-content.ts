import type { Game } from './catalog';
import { hubs } from './game-hubs';
import type { Tool } from './tools';

type FAQ = [question: string, answer: string];
type ToolContent = {
  title?: string;
  description?: string;
  steps?: string[];
  faq: FAQ;
};

const details: Record<string, ToolContent> = {
  'sensitivity-converter': {
    title: 'CS2 Sensitivity Converter for Valorant & More',
    description: 'Convert CS2 to Valorant sensitivity or match hip-fire aim across Apex Legends and Overwatch 2. See your eDPI and centimeters per 360° turn.',
    steps: ['Select the shooter you already play and the game you are switching to.', 'Enter your mouse DPI and current in-game sensitivity. Use the same DPI in both games.', 'Copy the converted value into your target game and check one full turn with a ruler.'],
    faq: ['How do I convert Valorant sensitivity to CS2?', 'Choose Valorant as the source and Counter-Strike 2 as the target, or use the swap button. At the same DPI, Valorant 0.472 is about 1.50 in CS2.'],
  },
  'crosshair-builder': {
    title: 'Valorant Crosshair Generator & CS2 Preview',
    description: 'Preview a custom crosshair for Valorant or CS2. Adjust color, gap, length, outline and opacity, then copy the settings for manual entry.',
    steps: ['Pick a preset and preview it on dark, light, and mixed backgrounds.', 'Adjust the gap and outline so you can see the center when the background color changes.', 'Copy the settings and recreate the reticle in your game. Pixel values are a visual reference.'],
    faq: ['Can I import these settings as a Valorant or CS2 crosshair code?', 'The Copy settings button gives you a readable settings note. Recreate the look with your game’s crosshair controls, since each game has its own import format and scale.'],
  },
  'nether-coordinates': {
    title: 'Minecraft Nether Coordinate Calculator',
    description: 'Convert Minecraft Overworld X and Z to Nether coordinates at the 8:1 scale. Use the result to plan where to build your portal.',
    steps: ['Find the Overworld portal’s X and Z coordinates.', 'Enter both coordinates with their signs. Use the result to locate the matching X and Z in the Nether.', 'Check for nearby portals and safe ground before choosing a Y level. Test the link in both directions.'],
    faq: ['Do negative coordinates also divide by eight?', 'Yes. Preserve the sign on both axes. For example, Overworld X −800 becomes Nether X −100. The Y coordinate is independent of the 8:1 scale.'],
  },
  'robux-value': {
    title: 'Roblox Robux Calculator',
    description: 'Estimate the purchase value of Robux in euros, dollars or another currency using a Roblox store bundle and its listed price.',
    steps: ['Enter how many Robux you want to value.', 'Enter the Robux included in one bundle and that bundle’s listed price in your currency.', 'Compare another bundle by changing both bundle fields. The result uses the currency you entered.'],
    faq: ['Can I use the result as a Roblox DevEx cash-out estimate?', 'This result estimates purchase value from a store bundle. For DevEx, use the Roblox Developer Revenue Estimator with eligible earned Robux and the correct program rate.'],
  },
  'reaction-time-test': {
    steps: ['Press Start reaction test and wait for green.', 'Click, tap, or activate the focused button when it says Press now. An early input restarts the attempt.', 'Repeat several times on the same device and compare your average.'],
    faq: ['Why is my phone score different from my PC score?', 'Display refresh, input hardware and the browser can affect the measured time. Compare repeated attempts on the same setup.'],
  },
  'cps-test': {
    steps: ['Press Start five-second test.', 'Click or tap the test button repeatedly until the interval ends.', 'Record the resulting clicks per second or reset before changing input devices.'],
    faq: ['Does the first click count toward CPS?', 'The first click starts the window. Only inputs made during the next five seconds count.'],
  },
  'session-timer': {
    steps: ['Enter the duration in minutes. Decimals work, such as 0.5 for 30 seconds.', 'Press Start / resume. Use Pause to keep the current time remaining.', 'Use Reset to set the timer back to 25 minutes.'],
    faq: ['Does the timer keep running in a background tab?', 'It keeps its deadline while the page is open and refreshes the display when you return. Reloading the page resets it.'],
  },
  'loot-probability': { faq: ['Is a drop guaranteed once the result reaches 90%?', 'No. A 90% cumulative chance still leaves a 10% chance of getting no drop. Pity timers or guaranteed rewards need a different model.'] },
  'required-wins': { faq: ['Can I get to a 100% record after a loss?', 'No finite win streak can erase an earlier loss from the denominator. Try a target below 100%.'] },
  'stack-calculator': { faq: ['How many stacks do unstackable items take?', 'Select a maximum stack size of 1. Each item then occupies its own inventory slot.'] },
  'portal-coordinate-converter': { faq: ['Why did I come out of a different portal?', 'The result maps ideal X and Z coordinates. The game can select an existing nearby portal, and portal elevation can affect which route links.'] },
  'item-quantity': { faq: ['What if a recipe produces more items than I need?', 'The calculator rounds up to a whole craft. The last completed recipe may leave spare outputs.'] },
  'minecraft-xp': { faq: ['Why does going from level 29 to 30 take more XP than going from 9 to 10?', 'XP per level increases as you level up. The result uses the Java Edition curve and assumes you are at the start of the entered current level.'] },
  'gamepass-earnings': { faq: ['Is the default fee my actual Roblox fee?', 'It is a worked example. Check the fee for your sale channel before using the result for a budget.'] },
  'developer-revenue': { faq: ['Which Robux should I include for DevEx?', 'Enter only eligible earned Robux, and use the published rate for those earnings. Roblox determines eligibility and actual payouts.'] },
  'kd-ratio': { faq: ['What should I enter if I did not die?', 'Enter zero deaths. A positive kill count has an infinite mathematical K/D, even if the game displays it differently.'] },
  'win-rate': { faq: ['How should I handle draws?', 'Choose whether you count draws in total matches and apply the same convention to every sample you compare.'] },
  'average-damage': { faq: ['Can I compare damage per round to damage per match?', 'Calculate and compare one unit at a time. A match can contain several rounds, so the values represent different samples.'] },
  'headshot-percentage': { faq: ['Should I divide headshot kills by total hits?', 'Use matching units. Divide headshot hits by total hits, or headshot kills by total kills.'] },
  'edpi': { faq: ['Do identical eDPI values feel the same in CS2 and Valorant?', 'Each game has its own sensitivity scale. Use the sensitivity converter for cross-game mouse travel and eDPI when comparing settings within the same game.'] },
  'fov-converter': { faq: ['Does this conversion apply to scoped aiming?', 'It converts horizontal and vertical perspective angles. A game may apply additional zoom, scope or aspect-ratio rules.'] },
  'crafting-quantity': { faq: ['How do I handle a recipe with several ingredients?', 'Calculate each ingredient separately at the same batch count, and account for any intermediate recipes before collecting materials.'] },
  'resource-calculator': { faq: ['What if I already have enough materials?', 'If the amount in storage meets or exceeds your target, the remaining amount and the number of required runs are both zero.'] },
  'drop-chance': { faq: ['Should two copies from one run count as two successes?', 'Count that run once if you are estimating the share of attempts that yielded at least one copy.'] },
  'level-progression': { faq: ['Which XP cost should I use for the first level?', 'Use the cost of advancing from your current level to the very next level. Enter a per-level increase of zero for a fixed cost.'] },
  'time-to-goal': { faq: ['Should my hourly rate include travel or waiting?', 'Include normal downtime if you want an estimate for total time spent. Use an active-play-only rate to estimate active grinding time.'] },
  'currency-converter': { faq: ['Is a live exchange rate included?', 'Enter the rate yourself as target units per source unit. The calculator applies that rate without fetching a live quote.'] },
  'percentage-calculator': { faq: ['How do I find a price after a 15% discount?', 'Calculate 15% of the original price, then subtract that amount from the original price.'] },
  'valorant-rank-progression': { faq: ['Will I actually gain the same RR in every match?', 'RR can vary between matches. The result is a consecutive-win estimate for a 100 RR promotion threshold using your entered gain.'] },
  'fortnite-sensitivity': { faq: ['Can I use the same calculation for controller sensitivity?', 'The calculation uses mouse DPI and Fortnite’s mouse sensitivity percentages. Controller stick and look settings use different controls.'] },
  'mouse-dpi-match': { faq: ['What if my mouse does not support the exact result?', 'Use the closest DPI available, then adjust your in-game sensitivity if needed and check a measured turn.'] },
  'aspect-ratio-compare': { faq: ['Does rendering fewer pixels guarantee a higher frame rate?', 'The result compares pixel counts. Frame rate also depends on your CPU, GPU, render settings and the scene.'] },
  'roblox-marketplace-fee': { faq: ['Which creator share should I enter?', 'Use Roblox’s published creator share for your item type and sale surface. The illustrative default may differ from your actual share.'] },
};

export function toolPageContent(tool: Tool, game?: Game) {
  const detail = details[tool.slug];
  const hub = game && hubs[game.slug];
  const fields = tool.fields?.map(field => field.label) ?? [];
  const steps = detail?.steps ?? [
    'Fill in ' + new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(fields) + '.',
    'Read the updated result below the inputs. Try the worked example to see how changing an input affects the answer.',
  ];
  return {
    title: detail?.title ?? tool.title,
    description: detail?.description ?? (game ? game.title + ': ' + tool.desc : tool.desc),
    steps,
    example: tool.slug === 'session-timer' ? 'Set 25 minutes, select Start / resume, then pause it between drills to keep the time remaining.' : tool.example,
    faq: detail?.faq ?? (hub ? [hub.question, hub.answer] : undefined),
  };
}
