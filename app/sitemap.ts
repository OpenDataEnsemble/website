import type { MetadataRoute } from 'next';
import { PUBLIC_SITE_URL } from '../src/site';

export const dynamic = 'force-static';


export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/about/',
    '/community/',
    '/community/kampala-2026/',
    '/contact/',
  ].map((path) => ({ url: `${PUBLIC_SITE_URL}${path}` }));
}
