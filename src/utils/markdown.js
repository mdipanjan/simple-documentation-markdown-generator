import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  strongDelimiter: '**'
});

// Custom rules for better markdown conversion
turndownService.addRule('codeBlocks', {
  filter: 'pre',
  replacement: function(content, node) {
    const language = node.querySelector('code')?.className?.replace('language-', '') || '';
    return `\n\`\`\`${language}\n${content.trim()}\n\`\`\`\n\n`;
  }
});

export function convertToMarkdown(html) {
  return turndownService.turndown(html);
}

export function formatForLLM(markdown, sourceUrl) {
  let formatted = `Source: ${sourceUrl}\n`;
  formatted += `Date Scraped: ${new Date().toISOString()}\n\n`;
  formatted += '# Documentation Content\n\n';
  
  // Split content into sections while preserving code blocks
  const sections = markdown
    .split(/(?=^#{1,6} )/m)
    .filter(section => section.trim())
    .map(section => section.trim());
  
  sections.forEach(section => {
    formatted += '---\n';
    formatted += section + '\n\n';
  });

  return formatted;
}