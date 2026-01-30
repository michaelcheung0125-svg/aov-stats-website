const cheerio = require('cheerio');

/**
 * Parse HTML content with Cheerio
 */
const parseHTML = (html) => {
  return cheerio.load(html);
};

/**
 * Extract text content safely
 */
const extractText = ($element) => {
  return $element ? $element.text().trim() : '';
};

/**
 * Extract attribute safely
 */
const extractAttr = ($element, attr) => {
  return $element ? $element.attr(attr) : '';
};

/**
 * Parse percentage string to number
 */
const parsePercentage = (str) => {
  const match = str.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : 0;
};

/**
 * Parse number string with commas
 */
const parseNumber = (str) => {
  return parseInt(str.replace(/,/g, ''), 10) || 0;
};

/**
 * Delay execution for rate limiting
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = {
  parseHTML,
  extractText,
  extractAttr,
  parsePercentage,
  parseNumber,
  delay
};
