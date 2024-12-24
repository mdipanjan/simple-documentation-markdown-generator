import axios from 'axios';
import { cleanHtml } from './contentCleaner.js';

export async function fetchAndCleanHtml(url) {
  try {
    const response = await axios.get(url);
    return cleanHtml(response.data);
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}