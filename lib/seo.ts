import type { Metadata } from 'next';
import { basePages, games, guides } from './catalog';
import { categories, categorySlug, tools } from './tools';

function configuredOrigin(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be the canonical HTTPS origin, with no path or query.');
  }
  return url.origin;
}

export const siteUrl = configuredOrigin(process.env.NEXT_PUBLIC_SITE_URL);
export const isIndexable = Boolean(siteUrl) && process.env.NEXT_PUBLIC_NO_INDEX !== '1';
export const siteTitle = 'NEXUSGG';
export const siteDescription = 'Use free gaming tools and calculators for 50 games. Convert CS2 and Valorant sensitivity, link Minecraft portals, and estimate Roblox costs.';
const socialImage = { url: '/nexusgg-social.jpg', width: 1200, height: 630, alt: 'NEXUSGG gaming hub artwork' };

export function absoluteUrl(path: string) {
  return siteUrl ? new URL(path, siteUrl).href : undefined;
}

export function metadata(title: string, description: string, path: string, type: 'website' | 'article' = 'website'): Metadata {
  const brandedTitle = title + ' | ' + siteTitle;
  const url = absoluteUrl(path);
  return {
    title: { absolute: brandedTitle },
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: { title: brandedTitle, description, siteName: siteTitle, type, url, locale: 'en_US', images: url ? [socialImage] : undefined },
    twitter: { card: 'summary_large_image', title: brandedTitle, description, images: url ? [socialImage] : undefined },
  };
}

export const paths = [
  '/', '/games/', '/tools/', '/guides/', '/popular/', '/make-money/', '/make-money/tournaments/',
  '/make-money/tracker/', '/make-money/resources/',
  ...games.map(game => '/make-money/' + game.slug + '/'),
  ...Object.keys(basePages).map(slug => '/' + slug + '/'),
  ...games.map(game => '/games/' + game.slug + '/'),
  ...tools.map(tool => '/tools/' + tool.slug + '/'),
  ...guides.map(guide => '/guides/' + guide.slug + '/'),
  ...categories.map(category => '/categories/' + categorySlug(category) + '/'),
];
