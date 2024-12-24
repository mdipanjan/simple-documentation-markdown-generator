import * as cheerio from 'cheerio';

export function cleanHtml(html) {
  const $ = cheerio.load(html);
  
  // Remove navigation elements and unnecessary content
  $('.sidebar, .navbar, .pagination, .table-of-contents').remove();
  $('a[href^="#"]').remove(); // Remove anchor links
  $('[aria-hidden="true"]').remove(); // Remove hidden elements
  $('a').each((_, el) => {
    const $el = $(el);
    if ($el.attr('href')?.includes('#')) {
      $el.remove();
    }
  });

  // Clean up code blocks
  $('pre code').each((_, el) => {
    const $el = $(el);
    $el.html($el.html().replace(/\n\s*\n/g, '\n'));
  });

  return $('main, article, .content').first().html() || $.html();
}