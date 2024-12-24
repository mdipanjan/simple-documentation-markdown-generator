import { fetchAndCleanHtml } from '../utils/scraper.js';
import { convertToMarkdown, formatForLLM } from '../utils/markdown.js';
import { collectInternalLinks } from '../utils/linkCollector.js';
import { UrlCache } from '../utils/cache.js';

const cache = new UrlCache();
let allContent = '';

async function scrapeDocumentationPage(url, depth = 0, maxDepth = 3) {
  if (cache.hasVisited(url) || depth > maxDepth) {
    return;
  }

  try {
    cache.markVisited(url);
    const html = await fetchAndCleanHtml(url);
    const markdown = convertToMarkdown(html);
    const formattedContent = formatForLLM(markdown, url);
    allContent += formattedContent + '\n\n';

    const links = collectInternalLinks(html, url);
    for (const link of links) {
      await scrapeDocumentationPage(link, depth + 1, maxDepth);
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
  }
}

export async function scrapeDocumentation(startUrl) {
  if (!startUrl) {
    throw new Error('Please provide a URL to scrape');
  }

  // Reset state for new scrape
  allContent = '';
  cache.visited.clear();
  
  await scrapeDocumentationPage(startUrl);
  return allContent;
}