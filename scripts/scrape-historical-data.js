const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

class HistoricalDataScraper {
  constructor() {
    this.sources = [
      {
        name: 'Wikipedia',
        baseUrl: 'https://en.wikipedia.org',
        searchUrl: 'https://en.wikipedia.org/w/api.php',
        type: 'api'
      },
      {
        name: 'Britannica',
        baseUrl: 'https://www.britannica.com',
        searchPath: '/search?query=',
        type: 'scrape'
      },
      {
        name: 'History.com',
        baseUrl: 'https://www.history.com',
        searchPath: '/search?q=',
        type: 'scrape'
      }
    ];
    
    this.outputDir = path.join(__dirname, '../src/data/scraped');
    this.delay = 1000; // 1 second delay between requests
  }

  async init() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      console.log('✅ Output directory created');
    } catch (error) {
      console.error('❌ Failed to create output directory:', error);
    }
  }

  async scrapeHistoricalEvents(topics = []) {
    console.log('🚀 Starting historical data scraping...');
    
    const defaultTopics = [
      'Roman Empire',
      'Ancient Egypt',
      'World War II',
      'Renaissance',
      'Industrial Revolution',
      'American Civil War',
      'French Revolution',
      'Ancient Greece',
      'Medieval Period',
      'Cold War'
    ];

    const topicsToScrape = topics.length > 0 ? topics : defaultTopics;
    const results = {};

    for (const topic of topicsToScrape) {
      console.log(`\n📚 Scraping data for: ${topic}`);
      results[topic] = await this.scrapeTopicData(topic);
      
      // Delay between topics to be respectful
      await this.sleep(this.delay);
    }

    // Save results
    await this.saveResults(results);
    console.log('\n✅ Scraping completed successfully!');
    
    return results;
  }

  async scrapeTopicData(topic) {
    const topicData = {
      title: topic,
      sources: {},
      timeline: [],
      facts: [],
      images: [],
      relatedTopics: []
    };

    for (const source of this.sources) {
      try {
        console.log(`  📖 Scraping from ${source.name}...`);
        
        if (source.type === 'api' && source.name === 'Wikipedia') {
          const data = await this.scrapeWikipedia(topic);
          topicData.sources[source.name] = data;
        } else if (source.type === 'scrape') {
          const data = await this.scrapeWebsite(source, topic);
          topicData.sources[source.name] = data;
        }
        
        await this.sleep(500); // Short delay between sources
      } catch (error) {
        console.error(`    ❌ Failed to scrape ${source.name}:`, error.message);
        topicData.sources[source.name] = { error: error.message };
      }
    }

    // Process and combine data from all sources
    this.processTopicData(topicData);
    
    return topicData;
  }

  async scrapeWikipedia(topic) {
    try {
      // Search for the topic
      const searchResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          list: 'search',
          srsearch: topic,
          srlimit: 1
        }
      });

      if (!searchResponse.data.query.search.length) {
        throw new Error('No Wikipedia articles found');
      }

      const pageTitle = searchResponse.data.query.search[0].title;
      
      // Get page content
      const contentResponse = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          prop: 'extracts|images|categories',
          titles: pageTitle,
          exintro: true,
          explaintext: true,
          imlimit: 10
        }
      });

      const pages = contentResponse.data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      return {
        title: page.title,
        extract: page.extract,
        images: page.images || [],
        categories: page.categories || [],
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
      };
    } catch (error) {
      throw new Error(`Wikipedia scraping failed: ${error.message}`);
    }
  }

  async scrapeWebsite(source, topic) {
    try {
      const searchUrl = `${source.baseUrl}${source.searchPath}${encodeURIComponent(topic)}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract basic information
      const title = $('h1').first().text().trim();
      const description = $('p').first().text().trim();
      
      // Extract images
      const images = [];
      $('img').each((i, elem) => {
        const src = $(elem).attr('src');
        if (src && src.startsWith('http')) {
          images.push(src);
        }
      });

      // Extract facts/key points
      const facts = [];
      $('li, .fact, .highlight').each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.length > 20 && text.length < 200) {
          facts.push(text);
        }
      });

      return {
        title,
        description,
        images: images.slice(0, 5), // Limit images
        facts: facts.slice(0, 10), // Limit facts
        url: searchUrl
      };
    } catch (error) {
      throw new Error(`Website scraping failed: ${error.message}`);
    }
  }

  processTopicData(topicData) {
    // Combine facts from all sources
    Object.values(topicData.sources).forEach(source => {
      if (source.facts) {
        topicData.facts.push(...source.facts);
      }
      if (source.images) {
        topicData.images.push(...source.images);
      }
    });

    // Remove duplicates
    topicData.facts = [...new Set(topicData.facts)];
    topicData.images = [...new Set(topicData.images)];

    // Extract timeline events from text
    const timelineRegex = /(\d{1,4})\s*(AD|BC|CE|BCE)?\s*[:\-–]\s*([^.!?]+)/g;
    const allText = Object.values(topicData.sources)
      .map(source => source.extract || source.description || '')
      .join(' ');

    let match;
    while ((match = timelineRegex.exec(allText)) !== null) {
      const year = parseInt(match[1]);
      const era = match[2];
      const event = match[3].trim();
      
      if (event.length > 10) {
        topicData.timeline.push({
          year: era === 'BC' || era === 'BCE' ? -year : year,
          event: event
        });
      }
    }

    // Sort timeline by year
    topicData.timeline.sort((a, b) => a.year - b.year);
  }

  async saveResults(results) {
    try {
      // Save individual topic files
      for (const [topic, data] of Object.entries(results)) {
        const filename = topic.toLowerCase().replace(/\s+/g, '-') + '.json';
        const filepath = path.join(this.outputDir, filename);
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
        console.log(`💾 Saved ${topic} data to ${filename}`);
      }

      // Save combined results
      const combinedPath = path.join(this.outputDir, 'all-topics.json');
      await fs.writeFile(combinedPath, JSON.stringify(results, null, 2));
      console.log('💾 Saved combined data to all-topics.json');

      // Generate summary
      const summary = {
        totalTopics: Object.keys(results).length,
        scrapedAt: new Date().toISOString(),
        topics: Object.keys(results).map(topic => ({
          name: topic,
          factsCount: results[topic].facts.length,
          imagesCount: results[topic].images.length,
          timelineCount: results[topic].timeline.length,
          sourcesCount: Object.keys(results[topic].sources).length
        }))
      };

      const summaryPath = path.join(this.outputDir, 'summary.json');
      await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
      console.log('📊 Generated scraping summary');

    } catch (error) {
      console.error('❌ Failed to save results:', error);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function main() {
  const scraper = new HistoricalDataScraper();
  await scraper.init();

  const topics = process.argv.slice(2);
  if (topics.length > 0) {
    console.log(`🎯 Custom topics specified: ${topics.join(', ')}`);
  } else {
    console.log('📋 Using default historical topics');
  }

  try {
    await scraper.scrapeHistoricalEvents(topics);
  } catch (error) {
    console.error('💥 Scraping failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = HistoricalDataScraper;