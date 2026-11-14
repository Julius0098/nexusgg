export const gameTutorials:Record<string, {title:string; text:string; source?:[string,string]}[]> = {
  'counter-strike-2':[
    {title:'Learn recoil in short groups',text:'Use a fixed distance and an offline practice session. Start with three-shot groups, then practice the first ten shots. Use Follow Recoil as visual feedback while learning. Turn it off if you want to review how well you compensate without it.'},
    {title:'Compare 16:9 and 4:3 before changing your setup',text:'Try native 16:9, 4:3 black bars, and 4:3 stretched one at a time. Compare visibility at the sides as well as frame times in the same replay. Keep DPI and sensitivity fixed during the comparison.'},
    {title:'Warm up for more than aim',text:'Spend five minutes on controlled rifle bursts and five minutes repeating one smoke or flash. Run the same routine for several sessions before changing the practice target.'},
  ],
  valorant:[
    {title:'Sova, recon with a teammate',text:'Use Recon Bolt to clear a common angle and ask an entry player to time the swing with its first scan. If it is destroyed immediately, note the angle it exposed so you know where the defender was able to shoot it.'},
    {title:'Omen, block vision for a specific push',text:'Practice placing the smoke edge flush with the choke. Tell your team when the smoke is ready and leave enough time to act before it expires.'},
    {title:'Killjoy, play off utility contact',text:'Place a trap where you can safely respond to it. Practice repositioning if the utility is destroyed or bypassed before you peek.'},
    {title:'Warm up with controlled taps',text:'Use a fixed Range drill at the same sensitivity for several sessions. Reset your movement before each shot and track hits from the same distance.',source:['Riot’s agent directory','https://playvalorant.com/en-us/agents/']},
  ],
  fortnite:[
    {title:'Build and edit practice',text:'In Creative, repeat one wall-and-ramp entry until your crosshair remains steady. Add a protected right-hand edit and a reset. Count clean repetitions before attempting a faster sequence.'},
    {title:'Test FPS and frame pacing',text:'Compare the same replay or Creative route at the same resolution. Try lowering shadows and effects. Compare sustained FPS and stutters in an actual fight before keeping the change.'},
    {title:'Pick a reliable drop in the current season',text:'Use the current in-game map to pick a named POI with several landing rooftops, then mark a backup route to smaller structures. Run ten drops and log shield availability, contest rate, and time to first zone.'},
    {title:'Controller deadzone and look settings',text:'Adjust one stick’s deadzone at a time. Raise it if the camera drifts with the stick untouched. Test unscoped turns and ADS tracking separately before changing response curves or boosts.'},
  ],
  minecraft:[
    {title:'Build an enchanting station',text:'Use up to fifteen properly placed, unblocked bookshelves to unlock the highest level of table offers. Keep the space between table and shelves clear, then bring lapis and enough levels for the offered enchantment.',source:['Minecraft Wiki · Enchanting mechanics','https://minecraft.wiki/w/Enchanting_table_mechanics']},
    {title:'Choose enchants by the job',text:'A mining tool and a collection tool can have different goals. Choose Fortune for drops that benefit from it and Silk Touch when you need the block itself. Use separate tools if you need both jobs.'},
    {title:'Measure farming efficiency over a full cycle',text:'Time startup, production and emptying storage together. Log useful drops after overflow, then use the hub’s farm planner to compare time for your actual material target.'},
  ],
  roblox:[
    {title:'Build and test your first playable loop',text:'In Roblox Studio, create one small place with a clear spawn, objective and retry path. Use private playtests to see where new players get stuck, then check it on a mobile-sized screen.'},
    {title:'Start with a clear offer',text:'Make a pass with a benefit users can understand. Record the price, net Robux and sale surface separately. Check creator receipts and DevEx eligibility before treating Robux as cash.',source:['Roblox Creator Hub · Discovery','https://create.roblox.com/docs/discovery']},
  ],
};

export const proSettings = [
  {name:'donk',dpi:800,sens:1.25,url:'https://prosettings.net/players/donk/'},
  {name:'ZywOo',dpi:400,sens:1.9,url:'https://prosettings.net/players/zywoo/'},
  {name:'m0NESY',dpi:400,sens:2.3,url:'https://prosettings.net/players/m0nesy/'},
];

export const robloxExperiences = [
  {title:'Brookhaven RP',category:'Social roleplay',href:'https://www.roblox.com/games/4924922222/Brookhaven-RP'},
  {title:'Blox Fruits',category:'Action and progression',href:'https://www.roblox.com/games/2753915549/Blox-Fruits'},
  {title:'Adopt Me!',category:'Collection and social simulation',href:'https://www.roblox.com/games/920587237/Adopt-Me'},
  {title:'Murder Mystery 2',category:'Social deduction',href:'https://www.roblox.com/games/142823291/Murder-Mystery-2'},
];
