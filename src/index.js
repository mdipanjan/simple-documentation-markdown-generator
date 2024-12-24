import { fetchAndCleanHtml } from './utils/scraper.js';
import { convertToMarkdown, formatForLLM } from './utils/markdown.js';
import { saveToFile } from './utils/file.js';
import { collectInternalLinks } from './utils/linkCollector.js';
import { UrlCache } from './utils/cache.js';

const cache = new UrlCache();
let allContent = '';

async function scrapeDocumentation(url, depth = 0, maxDepth = 3) {
  if (cache.hasVisited(url) || depth > maxDepth) {
    return;
  }

  try {
    console.log(`Scraping (depth ${depth}): ${url}`);
    cache.markVisited(url);

    const html = await fetchAndCleanHtml(url);
    const markdown = convertToMarkdown(html);
    const formattedContent = formatForLLM(markdown, url);
    allContent += formattedContent + '\n\n';

    // Collect and process internal links
    const links = collectInternalLinks(html, url);
    for (const link of links) {
      await scrapeDocumentation(link, depth + 1, maxDepth);
    }
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
  }
}

async function startScraping(startUrl) {
  if (!startUrl) {
    console.log('Please provide a URL to scrape');
    console.log('Example: node src/index.js https://docs.example.com');
    process.exit(1);
  }

  console.log('Starting documentation scraping...');
  const startTime = Date.now();
  
  await scrapeDocumentation(startUrl);
  
  // Save all collected content
  const filename = await saveToFile(allContent);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`\nScraping completed in ${duration} seconds`);
  console.log(`Documentation saved to ${filename}`);
}

const url = process.argv[2];
startScraping(url).catch(console.error);