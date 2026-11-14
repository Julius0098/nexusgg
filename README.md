# NEXUSGG

NEXUSGG is an independent gaming tools site. It includes 50 game hubs, 83 tools, 50 earning guides, seven general guides, and keyboard search. Calculators and tests run in the visitor's browser. A database, API key, purchased domain, or player account is unnecessary.

## Run on Windows

Install Node.js 22.18 or newer. Extract the project, open PowerShell in the nexusgg folder, and run:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:3000. On macOS or Linux use `npm` in place of `npm.cmd`.

```powershell
npm.cmd test
npm.cmd run build
```

The production build writes the static website to `out/`.

## Deploy to Cloudflare Pages

1. Push the extracted project to a GitHub repository.
2. In **Workers & Pages**, select **Create application**, then **Pages** and import the repository.
3. Select **Next.js (Static HTML Export)**. Set the build command to `npm run build`, output directory to `out`, and Node version to 22.18 or newer.
4. The canonical origin defaults to `https://nexusgg-8ia.pages.dev`. If you move domains, set `NEXT_PUBLIC_SITE_URL` to the new HTTPS origin and redeploy so canonicals and the sitemap match.
5. Optionally set `NEXT_PUBLIC_CONTACT_EMAIL` to the address you want to receive feedback at and redeploy. The Contact page opens an email draft on the visitor's device when an address is configured.

[Cloudflare's Next.js static export guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/) explains the settings. The same source can be imported into Vercel as a Next.js project. Review the terms of your hosting plan before running ads.

## Set up Google Search Console

1. In [Search Console](https://search.google.com/search-console/about), add a **URL prefix** property using the exact public HTTPS address.
2. Choose **HTML tag** verification. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the value inside the tag's `content` attribute and redeploy. Confirm the homepage renders the tag in its head, then click **Verify**. You can also use **HTML file** verification by putting the downloaded file in `public/` before deploying.
3. Under **Sitemaps**, submit `sitemap.xml`. Use URL Inspection on the homepage and on key tool pages to check crawl access.

Use a public deployment from the Cloudflare Pages `main` branch and leave `NEXT_PUBLIC_NO_INDEX` unset there. Cloudflare branch previews and builds with `NEXT_PUBLIC_NO_INDEX=1` send noindex metadata and omit URLs from the sitemap.

Run `python scripts/check-export.py --seo` after the build, with the same SEO environment variables, to check rendered metadata, links, and the sitemap.

[Search Console verification](https://support.google.com/webmasters/answer/9008080) · [Submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## AdSense later

1. In AdSense, open **Sites**, select **New site**, and check whether Google accepts the exact public domain you want to monetize.
2. Use the verification method shown in AdSense, such as `ads.txt` or a verification meta tag, and request review. Wait until the site is **Ready**.
3. Before serving ads, integrate a Google-certified consent management platform for the affected regions and update the privacy and cookie policies to reflect the actual ad setup. Configure accessible consent controls and validate the ad behavior for the user's choice.
4. The source includes hidden, configurable positions below introductory content and below calculators. Add consent-aware ad loading and render the slots as labeled **Advertisement** regions once the site is ready.

[Add a site to AdSense](https://support.google.com/adsense/answer/12169212) · [Google consent management requirements](https://support.google.com/adsense/answer/13554116)

## Calculator scope

- The sensitivity converter matches unscoped mouse travel at the same DPI for Counter-Strike 2, Valorant, Apex Legends, and Overwatch 2. Its assumptions are on the tool page.
- The crosshair builder exports a settings note for manual entry into a game.
- Minecraft XP uses Java Edition level thresholds. Portal calculations return ideal alignment coordinates.
- Roblox calculators use user-entered rates. The default fee and exchange figures are worked examples.


## Earning guides and events

- `lib/competitions.ts` stores publisher or organizer references. Keep dates, prize tables and eligibility current. The event directory links to organizer calendars and does not use a live feed.
- `lib/earnings.ts` pairs verified programs with game-specific tutorials and optional independent work. Age and region filters screen known restrictions. Players still need to confirm their account, country, and event requirements with the organizer.
- Favorite games, tournament preparation and income are saved on the current browser. Income totals are kept separately by currency; CSV exports the selected month or all entries.

## Game artwork

Publisher assets are mapped in `lib/game-art.ts` and optimized copies live under `public/games/`. Each entry links its origin on the game hub. Titles without confirmed, available artwork use an accessible genre icon. Confirm terms before adding any future asset, especially on an ad-supported page.

The logo is mapped on every catalog entry in `lib/catalog.ts` through `lib/game-logos.ts`. See [game logo audit](GAME_LOGOS.md) for the provenance, use terms, and fallback status of every title.
