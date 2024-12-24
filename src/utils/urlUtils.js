/**
 * Browser-compatible URL utilities
 */
export function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url, base) {
  try {
    return new URL(url, base).href;
  } catch {
    return null;
  }
}

export function isSameOrigin(url1, url2) {
  try {
    const a = new URL(url1);
    const b = new URL(url2);
    return a.origin === b.origin;
  } catch {
    return false;
  }
}

export function getPathSegments(urlString) {
  try {
    const { pathname } = new URL(urlString);
    return pathname.split('/').filter(Boolean);
  } catch {
    return [];
  }
}