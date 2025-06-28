import axios from 'axios';
import { WikipediaResult, SearchResult } from '../types';

const WIKIPEDIA_API_BASE = 'https://en.wikipedia.org/api/rest_v1';
const WIKIPEDIA_SEARCH_API = 'https://en.wikipedia.org/w/api.php';

class WikipediaAPI {
  private cache = new Map<string, any>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  async searchArticles(query: string, limit: number = 10): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    const cacheKey = `search_${query.toLowerCase()}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(WIKIPEDIA_SEARCH_API, {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: query,
          srlimit: limit,
          srprop: 'snippet|titlesnippet|size|wordcount|timestamp',
          origin: '*'
        },
        timeout: 8000
      });

      if (!response.data.query?.search) {
        return [];
      }

      const results: SearchResult[] = response.data.query.search.map((item: any) => ({
        id: item.pageid.toString(),
        title: item.title,
        description: this.cleanSnippet(item.snippet),
        type: this.categorizeResult(item.title, item.snippet),
        relevance: this.calculateRelevance(item, query),
        year: this.extractYear(item.snippet),
        eventId: item.pageid.toString(),
        imageUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`
      }));

      // Sort by relevance
      results.sort((a, b) => b.relevance - a.relevance);

      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  async getArticleSummary(title: string): Promise<WikipediaResult | null> {
    const cacheKey = `summary_${title.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${WIKIPEDIA_API_BASE}/page/summary/${encodeURIComponent(title)}`, {
        headers: {
          'User-Agent': 'HistoricalTimeTraveler/3.0 (Educational Platform)'
        },
        timeout: 8000
      });

      const data = response.data;
      const result: WikipediaResult = {
        title: data.title,
        extract: data.extract || data.description || 'No description available',
        thumbnail: data.thumbnail,
        pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        coordinates: data.coordinates ? [data.coordinates.lat, data.coordinates.lon] : undefined
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Wikipedia summary error:', error);
      return null;
    }
  }

  async getRandomHistoricalArticle(): Promise<WikipediaResult | null> {
    try {
      // Search for random historical topics
      const historicalTopics = [
        'ancient history', 'medieval history', 'renaissance', 'world war',
        'ancient civilization', 'historical battle', 'historical figure',
        'ancient empire', 'historical event', 'archaeological discovery'
      ];
      
      const randomTopic = historicalTopics[Math.floor(Math.random() * historicalTopics.length)];
      const searchResults = await this.searchArticles(randomTopic, 1);
      
      if (searchResults.length > 0) {
        return await this.getArticleSummary(searchResults[0].title);
      }
      
      return null;
    } catch (error) {
      console.error('Random article error:', error);
      return null;
    }
  }

  async getTrendingTopics(): Promise<string[]> {
    const cacheKey = 'trending_topics';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Get popular historical searches
      const historicalQueries = [
        'Ancient Rome', 'World War II', 'Renaissance', 'Ancient Egypt',
        'Medieval Europe', 'Industrial Revolution', 'American Civil War',
        'French Revolution', 'Ancient Greece', 'Cold War', 'Viking Age',
        'Byzantine Empire', 'Mongol Empire', 'Crusades', 'Age of Exploration'
      ];

      // Shuffle and return a subset
      const shuffled = historicalQueries.sort(() => 0.5 - Math.random());
      const trending = shuffled.slice(0, 8);
      
      this.setCache(cacheKey, trending);
      return trending;
    } catch (error) {
      console.error('Trending topics error:', error);
      return [
        'Ancient Rome',
        'World War II', 
        'Renaissance',
        'Ancient Egypt',
        'Medieval Europe',
        'Industrial Revolution'
      ];
    }
  }

  async getHistoricalSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];

    const cacheKey = `suggestions_${query.toLowerCase()}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(WIKIPEDIA_SEARCH_API, {
        params: {
          action: 'opensearch',
          search: query,
          limit: 8,
          namespace: 0,
          format: 'json',
          origin: '*'
        },
        timeout: 5000
      });

      const suggestions = response.data[1] || [];
      this.setCache(cacheKey, suggestions);
      return suggestions;
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  private cleanSnippet(snippet: string): string {
    return snippet
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private categorizeResult(title: string, snippet: string): 'event' | 'figure' | 'artifact' | 'location' {
    const text = (title + ' ' + snippet).toLowerCase();
    
    if (text.includes('war') || text.includes('battle') || text.includes('revolution') || 
        text.includes('treaty') || text.includes('empire') || text.includes('dynasty')) {
      return 'event';
    }
    
    if (text.includes('emperor') || text.includes('king') || text.includes('queen') || 
        text.includes('leader') || text.includes('general') || text.includes('philosopher')) {
      return 'figure';
    }
    
    if (text.includes('artifact') || text.includes('sculpture') || text.includes('painting') || 
        text.includes('monument') || text.includes('temple') || text.includes('palace')) {
      return 'artifact';
    }
    
    if (text.includes('city') || text.includes('country') || text.includes('region') || 
        text.includes('continent') || text.includes('civilization')) {
      return 'location';
    }
    
    return 'event';
  }

  private calculateRelevance(item: any, query: string): number {
    const queryLower = query.toLowerCase();
    const titleLower = item.title.toLowerCase();
    const snippetLower = (item.snippet || '').toLowerCase();
    
    let relevance = 0;
    
    // Title exact match
    if (titleLower === queryLower) relevance += 1.0;
    else if (titleLower.includes(queryLower)) relevance += 0.8;
    else if (queryLower.includes(titleLower)) relevance += 0.6;
    
    // Title word matches
    const queryWords = queryLower.split(' ');
    const titleWords = titleLower.split(' ');
    const titleMatches = queryWords.filter(word => titleWords.some(tw => tw.includes(word))).length;
    relevance += (titleMatches / queryWords.length) * 0.5;
    
    // Snippet matches
    if (snippetLower.includes(queryLower)) relevance += 0.3;
    
    // Article quality indicators
    if (item.wordcount > 1000) relevance += 0.1;
    if (item.size > 5000) relevance += 0.1;
    
    return Math.min(1, relevance);
  }

  private extractYear(text: string): number | undefined {
    if (!text) return undefined;
    
    const yearMatches = text.match(/\b(\d{1,4})\s*(AD|BC|CE|BCE)?\b/g);
    if (yearMatches && yearMatches.length > 0) {
      const yearMatch = yearMatches[0].match(/(\d{1,4})\s*(AD|BC|CE|BCE)?/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        const era = yearMatch[2];
        return (era === 'BC' || era === 'BCE') ? -year : year;
      }
    }
    
    return undefined;
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

export const wikipediaAPI = new WikipediaAPI();