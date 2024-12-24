import * as cheerio from 'cheerio';
import { isValidUrl, normalizeUrl, isSameOrigin, getPathSegments } from './urlUtils';

export function collectInternalLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const links = new Set();
  
  // Get base path segment for filtering (e.g., 'docs' from '/docs/section')
  const basePath = getPathSegments(baseUrl)[0];
  
  $('a').each((_, element) => {
    const href = $(element).attr('href');
    if (!href || href.startsWith('#')) return;
    
    const absoluteUrl = normalizeUrl(href, baseUrl);
    if (!absoluteUrl || !isValidUrl(absoluteUrl)) return;
    
    // Only collect links that:
    // 1. Are from the same origin
    // 2. Start with the same base path
    // 3. Don't contain hash fragments
    if (isSameOrigin(absoluteUrl, baseUrl) && 
        getPathSegments(absoluteUrl)[0] === basePath && 
        !absoluteUrl.includes('#')) {
      links.add(absoluteUrl);
    }
  });

  return Array.from(links);
}