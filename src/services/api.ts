import axios from 'axios';
import { HistoricalEvent, ScrapedData, APIResponse, SearchResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.historicaltimetravel.com';
const WIKIPEDIA_API = 'https://en.wikipedia.org/api/rest_v1';
const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';

class HistoricalAPI {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Wikipedia API integration
  async searchWikipedia(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${WIKIPEDIA_API}/page/search/${encodeURIComponent(query)}`, {
        params: { limit }
      });

      return response.data.pages.map((page: any) => ({
        id: page.key,
        title: page.title,
        description: page.description || page.extract,
        type: 'event' as const,
        relevance: 1,
        eventId: page.key
      }));
    } catch (error) {
      console.error('Wikipedia search error:', error);
      return [];
    }
  }

  // Get Wikipedia page content
  async getWikipediaContent(title: string): Promise<ScrapedData | null> {
    try {
      const [summaryResponse, sectionsResponse] = await Promise.all([
        axios.get(`${WIKIPEDIA_API}/page/summary/${encodeURIComponent(title)}`),
        axios.get(`${WIKIPEDIA_API}/page/mobile-sections/${encodeURIComponent(title)}`)
      ]);

      const summary = summaryResponse.data;
      const sections = sectionsResponse.data;

      // Extract timeline events from sections
      const timeline: { year: number; event: string }[] = [];
      sections.remaining?.sections?.forEach((section: any) => {
        if (section.text) {
          const yearMatches = section.text.match(/\b(\d{1,4})\s*(AD|BC|CE|BCE)?\b/g);
          if (yearMatches) {
            yearMatches.forEach((match: string) => {
              const year = this.parseYear(match);
              if (year) {
                timeline.push({
                  year,
                  event: section.line || 'Historical event'
                });
              }
            });
          }
        }
      });

      return {
        title: summary.title,
        description: summary.extract,
        year: this.extractYearFromText(summary.extract),
        images: [summary.thumbnail?.source].filter(Boolean),
        facts: this.extractFacts(sections),
        timeline: timeline.sort((a, b) => a.year - b.year),
        sources: [summary.content_urls?.desktop?.page].filter(Boolean)
      };
    } catch (error) {
      console.error('Wikipedia content error:', error);
      return null;
    }
  }

  // Wikidata integration for structured data
  async getWikidataInfo(wikidataId: string): Promise<any> {
    try {
      const response = await axios.get(WIKIDATA_API, {
        params: {
          action: 'wbgetentities',
          ids: wikidataId,
          format: 'json',
          props: 'labels|descriptions|claims|sitelinks'
        }
      });

      return response.data.entities[wikidataId];
    } catch (error) {
      console.error('Wikidata error:', error);
      return null;
    }
  }

  // Historical events CRUD operations
  async getEvents(params?: {
    category?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<HistoricalEvent[]>> {
    const response = await this.axiosInstance.get('/events', { params });
    return response.data;
  }

  async getEvent(id: string): Promise<APIResponse<HistoricalEvent>> {
    const response = await this.axiosInstance.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(event: Partial<HistoricalEvent>): Promise<APIResponse<HistoricalEvent>> {
    const response = await this.axiosInstance.post('/events', event);
    return response.data;
  }

  async updateEvent(id: string, event: Partial<HistoricalEvent>): Promise<APIResponse<HistoricalEvent>> {
    const response = await this.axiosInstance.put(`/events/${id}`, event);
    return response.data;
  }

  async deleteEvent(id: string): Promise<APIResponse<void>> {
    const response = await this.axiosInstance.delete(`/events/${id}`);
    return response.data;
  }

  // Search functionality
  async searchEvents(query: string, filters?: {
    category?: string;
    yearRange?: [number, number];
    difficulty?: string;
  }): Promise<APIResponse<SearchResult[]>> {
    const response = await this.axiosInstance.get('/search', {
      params: { query, ...filters }
    });
    return response.data;
  }

  // User progress tracking
  async saveProgress(eventId: string, year: number, notes?: string): Promise<void> {
    await this.axiosInstance.post('/progress', {
      eventId,
      currentYear: year,
      notes,
      timestamp: new Date().toISOString()
    });
  }

  async getProgress(eventId: string): Promise<any> {
    const response = await this.axiosInstance.get(`/progress/${eventId}`);
    return response.data;
  }

  // Analytics and recommendations
  async getRecommendations(userId?: string): Promise<APIResponse<HistoricalEvent[]>> {
    const response = await this.axiosInstance.get('/recommendations', {
      params: { userId }
    });
    return response.data;
  }

  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    await this.axiosInstance.post('/analytics', {
      event: eventName,
      properties,
      timestamp: new Date().toISOString()
    });
  }

  // Utility methods
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

  private extractYearFromText(text: string): number | undefined {
    const yearMatch = text.match(/\b(\d{1,4})\s*(AD|BC|CE|BCE)?\b/);
    return yearMatch ? this.parseYear(yearMatch[0]) || undefined : undefined;
  }

  private extractFacts(sections: any): string[] {
    const facts: string[] = [];
    sections.remaining?.sections?.forEach((section: any) => {
      if (section.text) {
        // Extract sentences that look like facts
        const sentences = section.text.split(/[.!?]+/);
        sentences.forEach((sentence: string) => {
          if (sentence.length > 20 && sentence.length < 200) {
            facts.push(sentence.trim());
          }
        });
      }
    });
    return facts.slice(0, 10); // Limit to 10 facts
  }
}

export const historicalAPI = new HistoricalAPI();