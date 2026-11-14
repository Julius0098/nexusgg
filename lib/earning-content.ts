import { games } from './catalog.ts';
import { gamePlanSlug } from './game-hubs.ts';

export const earningChoices=games.map(game=>({slug:game.slug,title:game.title,planner:gamePlanSlug(game.slug)}));

export const roadmap = [
  ['Build one repeatable skill','Choose one mode or mechanic. Run a short baseline, then practice the same objective under comparable conditions.'],
  ['Make a portfolio of results','Save a few annotated replays, publish a useful example, or ship a small prototype. Keep proof of what you did and where it worked.'],
  ['Test one earning route','Pick an eligible competition, a creator application, or a clearly scoped client project. Cap your spending and count your time.'],
  ['Review what actually paid','Record settled payments, costs and hours. Compare several months before relying on irregular gaming income.'],
];

export const glossary = [
  ['Open qualifier','An early entry stage open to players or teams that meet the published eligibility rules.'],
  ['Region lock','A rule that limits the region a player may represent or the queues they may enter.'],
  ['Check-in','The step that confirms your roster is present before the organizer’s deadline.'],
  ['Prize pool','The amount allocated across eligible finishing positions. A per-player prize and a team prize can have different splits.'],
  ['Scrim','A practice match against another player or team.'],
  ['VOD review','An analysis of recorded play used to identify decisions to improve.'],
  ['Placement','The position in a game or leaderboard. An event may score these separately.'],
  ['Payout verification','Checks an organizer uses to confirm a winner’s identity and eligibility before releasing a prize.'],
];

export const safety = [
  ['Check the organizer’s domain','Open the published rules from the official game client or organizer website. A matching profile picture or Discord role alone cannot confirm identity.'],
  ['Read the fee in the rules','A legitimate fee appears in the event rules and the official checkout. Avoid gift-card, crypto, or direct transfer requests from an organizer impersonator.'],
  ['Treat surprise prize DMs as unverified','Confirm your result from the published leaderboard and use the official support path. A request to pay a private account to unlock a prize is a warning sign.'],
  ['Keep account access private','Never share passwords, backup codes, or one-time codes with someone claiming to register you. Complete account verification on the official platform.'],
  ['Check the full terms before registering','Look for the game, eligible countries, organizer identity, scoring, age rules, refund terms and prize distribution. Avoid guaranteed-income pitches.'],
];
