export class UrlCache {
  constructor() {
    this.visited = new Set();
  }

  hasVisited(url) {
    return this.visited.has(url);
  }

  markVisited(url) {
    this.visited.add(url);
  }
}