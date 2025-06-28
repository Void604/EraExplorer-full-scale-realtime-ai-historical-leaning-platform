import axios from 'axios';
import { ScrapedData } from '../types';

interface ScrapingTarget {
  name: string;
  baseUrl: string;
  selectors: {
    title: string;
    description: string;
    images: string;
    facts: string;
    timeline: string;
  };
}

const SCRAPING_TARGETS: ScrapingTarget[] = [
  {
    name: 'Britannica',
    baseUrl: 'https://www.britannica.com',
    selectors: {
      title: 'h1.md-title',
      description: '.topic-paragraph p',
      images: '.media-overlay-link img',
      facts: '.fact-box li',
      timeline: '.timeline-item'
    }
  },
  {
    name: 'History.com',
    baseUrl: 'https://www.history.com',
    selectors: {
      title: 'h1.entry-title',
      description: '.entry-content p',
      images: '.wp-block-image img',
      facts: '.fact-list li',
      timeline: '.timeline-entry'
    }
  },
  {
    name: 'National Geographic',
    baseUrl: 'https://www.nationalgeographic.com',
    selectors: {
      title: 'h1.Article__Title',
      description: '.Article__Content p',
      images: '.Image img',
      facts: '.FactBox li',
      timeline: '.Timeline__Item'
    }
  }
];

class HistoricalScraper {
  private proxyUrl = 'https://api.allorigins.win/get?url=';

  async scrapeHistoricalData(query: string): Promise<ScrapedData[]> {
    const results: ScrapedData[] = [];

    for (const target of SCRAPING_TARGETS) {
      try {
        const data = await this.scrapeFromSource(target, query);
        if (data) {
          results.push(data);
        }
      } catch (error) {
        console.error(`Error scraping from ${target.name}:`, error);
      }
    }

    return results;
  }

  private async scrapeFromSource(target: ScrapingTarget, query: string): Promise<ScrapedData | null> {
    try {
      // Use a CORS proxy to bypass CORS restrictions
      const searchUrl = `${target.baseUrl}/search?q=${encodeURIComponent(query)}`;
      const proxyUrl = `${this.proxyUrl}${encodeURIComponent(searchUrl)}`;
      
      const response = await axios.get(proxyUrl);
      const html = response.data.contents;

      // Parse HTML using DOMParser (browser environment)
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const title = this.extractText(doc, target.selectors.title);
      const description = this.extractText(doc, target.selectors.description);
      const images = this.extractImages(doc, target.selectors.images, target.baseUrl);
      const facts = this.extractList(doc, target.selectors.facts);
      const timeline = this.extractTimeline(doc, target.selectors.timeline);

      if (!title && !description) {
        return null;
      }

      return {
        title: title || 'Unknown Title',
        description: description || 'No description available',
        images,
        facts,
        timeline,
        sources: [searchUrl]
      };
    } catch (error) {
      console.error(`Scraping error for ${target.name}:`, error);
      return null;
    }
  }

  private extractText(doc: Document, selector: string): string {
    const element = doc.querySelector(selector);
    return element?.textContent?.trim() || '';
  }

  private extractImages(doc: Document, selector: string, baseUrl: string): string[] {
    const images: string[] = [];
    const elements = doc.querySelectorAll(selector);
    
    elements.forEach(img => {
      const src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src) {
        const fullUrl = src.startsWith('http') ? src : `${baseUrl}${src}`;
        images.push(fullUrl);
      }
    });

    return images.slice(0, 5); // Limit to 5 images
  }

  private extractList(doc: Document, selector: string): string[] {
    const facts: string[] = [];
    const elements = doc.querySelectorAll(selector);
    
    elements.forEach(element => {
      const text = element.textContent?.trim();
      if (text && text.length > 10) {
        facts.push(text);
      }
    });

    return facts.slice(0, 10); // Limit to 10 facts
  }

  private extractTimeline(doc: Document, selector: string): { year: number; event: string }[] {
    const timeline: { year: number; event: string }[] = [];
    const elements = doc.querySelectorAll(selector);
    
    elements.forEach(element => {
      const text = element.textContent?.trim();
      if (text) {
        const yearMatch = text.match(/\b(\d{1,4})\s*(AD|BC|CE|BCE)?\b/);
        if (yearMatch) {
          const year = this.parseYear(yearMatch[0]);
          if (year) {
            timeline.push({
              year,
              event: text.replace(yearMatch[0], '').trim()
            });
          }
        }
      }
    });

    return timeline.sort((a, b) => a.year - b.year);
  }

  private parseYear(yearString: string): number | null {
    const match = yearString.match(/(\d{1,4})\s*(AD|BC|CE|BCE)?/);
    if (!match) return null;

    const year = parseInt(match[1]);
    const era = match[2];

    if (era === 'BC' || era === 'BCE') {
      return -year;
    }
    return year;
  }

  // Enhanced scraping for specific historical databases
  async scrapeMuseumData(query: string): Promise<ScrapedData[]> {
    const museumAPIs = [
      {
        name: 'Metropolitan Museum',
        url: 'https://collectionapi.metmuseum.org/public/collection/v1/search',
        params: { q: query, hasImages: true }
      },
      {
        name: 'Smithsonian',
        url: 'https://api.si.edu/openaccess/api/v1.0/search',
        params: { q: query, api_key: 'your-api-key' }
      }
    ];

    const results: ScrapedData[] = [];

    for (const api of museumAPIs) {
      try {
        const response = await axios.get(api.url, { params: api.params });
        const data = this.parseMuseumData(response.data, api.name);
        if (data) {
          results.push(data);
        }
      } catch (error) {
        console.error(`Error fetching from ${api.name}:`, error);
      }
    }

    return results;
  }

  private parseMuseumData(data: any, source: string): ScrapedData | null {
    // Parse museum API responses based on their specific formats
    try {
      if (source === 'Metropolitan Museum' && data.objectIDs) {
        return {
          title: 'Museum Artifacts',
          description: `Found ${data.objectIDs.length} related artifacts`,
          images: [],
          facts: [`${data.objectIDs.length} artifacts found in collection`],
          timeline: [],
          sources: ['Metropolitan Museum API']
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing museum data:', error);
      return null;
    }
  }
}

export const historicalScraper = new HistoricalScraper();