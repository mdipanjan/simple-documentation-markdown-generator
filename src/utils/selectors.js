import * as cheerio from 'cheerio';

// Common documentation site selectors
export const commonSelectors = {
  mainContent: [
    'main',
    'article',
    '.documentation',
    '.docs-content',
    '.markdown-body',
    '#main-content',
    '.docs-container'
  ],
  
  removeElements: [
    'nav',
    'header',
    'footer',
    '.sidebar',
    '.navigation',
    '.ads',
    '.cookie-banner',
    'script',
    'style',
    'iframe'
  ],
  
  headings: 'h1, h2, h3, h4, h5, h6',
  codeBlocks: 'pre code',
  tables: 'table'
};

export function getMainContentSelector(html) {
  try {
    const $ = cheerio.load(html);
    
    // Find first matching selector that contains content
    const selector = commonSelectors.mainContent.find(selector => 
      $(selector).length > 0 && $(selector).text().trim().length > 100
    );
    
    return selector || 'body';
  } catch (error) {
    console.error('Error finding main content selector:', error);
    return 'body'; // Fallback to body if selector detection fails
  }
}