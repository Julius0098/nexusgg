import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable, paths } from '../lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return isIndexable ? paths.map(path => ({ url: absoluteUrl(path) })) : [];
}
