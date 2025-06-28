import { HistoricalEvent, QuizQuestion, TimelineEvent } from '../types';
import { wikipediaAPI } from './wikipediaAPI';

interface GeneratedContent {
  event: HistoricalEvent;
  success: boolean;
  error?: string;
}

class ContentGenerator {
  private cache = new Map<string, HistoricalEvent>();

  async generateHistoricalEvent(query: string): Promise<GeneratedContent> {
    try {
      // Check cache first
      const cacheKey = query.toLowerCase().trim();
      if (this.cache.has(cacheKey)) {
        return { event: this.cache.get(cacheKey)!, success: true };
      }

      // Get Wikipedia data
      const searchResults = await wikipediaAPI.searchArticles(query, 1);
      if (searchResults.length === 0) {
        throw new Error('No historical information found');
      }

      const summary = await wikipediaAPI.getArticleSummary(searchResults[0].title);
      if (!summary) {
        throw new Error('Could not retrieve detailed information');
      }

      // Generate comprehensive historical event
      const event = await this.createHistoricalEvent(summary, searchResults[0]);
      
      // Cache the result
      this.cache.set(cacheKey, event);
      
      return { event, success: true };
    } catch (error) {
      console.error('Content generation error:', error);
      return { 
        event: this.createFallbackEvent(query), 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private async createHistoricalEvent(summary: any, searchResult: any): Promise<HistoricalEvent> {
    const title = summary.title;
    const description = summary.extract || 'Explore this fascinating period in history';
    
    // Extract years from content
    const years = this.extractYears(summary.extract);
    const startYear = years.start || this.estimateStartYear(title);
    const endYear = years.end || this.estimateEndYear(title, startYear);
    
    // Determine category
    const category = this.categorizeEvent(title, description);
    
    // Generate timeline events
    const timeline = this.generateTimeline(title, description, startYear, endYear);
    
    // Generate quiz questions
    const quiz = this.generateQuiz(title, description, timeline);
    
    // Generate learning objectives
    const learningObjectives = this.generateLearningObjectives(title, category);
    
    // Generate key facts
    const keyFacts = this.generateKeyFacts(description, timeline);

    return {
      id: this.generateId(title),
      title,
      description,
      period: this.formatPeriod(startYear, endYear),
      startYear,
      endYear,
      category,
      image: summary.thumbnail?.source || this.getDefaultImage(category),
      color: this.getCategoryColor(category),
      difficulty: this.determineDifficulty(title, description),
      tags: this.generateTags(title, description, category),
      learningObjectives,
      keyFacts,
      timeline,
      quiz
    };
  }

  private extractYears(text: string): { start?: number; end?: number } {
    if (!text) return {};
    
    const yearMatches = text.match(/\b(\d{1,4})\s*(AD|BC|CE|BCE)?\b/g) || [];
    const years = yearMatches.map(match => {
      const yearMatch = match.match(/(\d{1,4})\s*(AD|BC|CE|BCE)?/);
      if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        const era = yearMatch[2];
        return (era === 'BC' || era === 'BCE') ? -year : year;
      }
      return null;
    }).filter(Boolean) as number[];

    if (years.length === 0) return {};
    
    years.sort((a, b) => a - b);
    return {
      start: years[0],
      end: years[years.length - 1]
    };
  }

  private estimateStartYear(title: string): number {
    const titleLower = title.toLowerCase();
    
    // Ancient periods
    if (titleLower.includes('ancient') || titleLower.includes('prehistoric')) return -3000;
    if (titleLower.includes('stone age')) return -10000;
    if (titleLower.includes('bronze age')) return -3000;
    if (titleLower.includes('iron age')) return -1200;
    
    // Classical periods
    if (titleLower.includes('classical') || titleLower.includes('greece') || titleLower.includes('roman')) return -800;
    
    // Medieval
    if (titleLower.includes('medieval') || titleLower.includes('middle ages')) return 500;
    if (titleLower.includes('viking')) return 800;
    if (titleLower.includes('crusade')) return 1095;
    
    // Renaissance and Early Modern
    if (titleLower.includes('renaissance')) return 1400;
    if (titleLower.includes('reformation')) return 1517;
    if (titleLower.includes('enlightenment')) return 1650;
    
    // Modern periods
    if (titleLower.includes('industrial revolution')) return 1760;
    if (titleLower.includes('world war i') || titleLower.includes('first world war')) return 1914;
    if (titleLower.includes('world war ii') || titleLower.includes('second world war')) return 1939;
    if (titleLower.includes('cold war')) return 1947;
    
    // Default to a reasonable historical period
    return 1000;
  }

  private estimateEndYear(title: string, startYear: number): number {
    const titleLower = title.toLowerCase();
    
    // Calculate duration based on type
    let duration = 100; // Default duration
    
    if (titleLower.includes('empire') || titleLower.includes('civilization')) duration = 500;
    if (titleLower.includes('war') && !titleLower.includes('world war')) duration = 10;
    if (titleLower.includes('world war')) duration = 6;
    if (titleLower.includes('revolution') && !titleLower.includes('industrial')) duration = 15;
    if (titleLower.includes('industrial revolution')) duration = 100;
    if (titleLower.includes('age') || titleLower.includes('period')) duration = 300;
    if (titleLower.includes('dynasty')) duration = 200;
    
    const endYear = startYear + duration;
    
    // Don't go beyond current year
    return Math.min(endYear, new Date().getFullYear());
  }

  private categorizeEvent(title: string, description: string): HistoricalEvent['category'] {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('empire') || text.includes('kingdom') || text.includes('dynasty') || text.includes('civilization')) {
      return 'empire';
    }
    if (text.includes('exploration') || text.includes('discovery') || text.includes('voyage') || text.includes('expedition')) {
      return 'exploration';
    }
    if (text.includes('invention') || text.includes('technology') || text.includes('industrial') || text.includes('revolution')) {
      return 'technology';
    }
    if (text.includes('art') || text.includes('culture') || text.includes('renaissance') || text.includes('literature') || text.includes('philosophy')) {
      return 'cultural';
    }
    if (text.includes('war') || text.includes('battle') || text.includes('military') || text.includes('conquest') || text.includes('invasion')) {
      return 'military';
    }
    
    return 'empire'; // Default
  }

  private generateTimeline(title: string, description: string, startYear: number, endYear: number): TimelineEvent[] {
    const timeline: TimelineEvent[] = [];
    const duration = endYear - startYear;
    const eventCount = Math.min(8, Math.max(3, Math.floor(duration / 50)));
    
    // Generate key events throughout the period
    for (let i = 0; i < eventCount; i++) {
      const year = startYear + Math.floor((duration * i) / (eventCount - 1));
      const eventType = this.getTimelineEventType(i, eventCount);
      
      timeline.push({
        id: `${this.generateId(title)}-${i}`,
        year,
        title: this.generateEventTitle(title, i, eventCount),
        description: this.generateEventDescription(title, i, eventCount),
        type: eventType,
        significance: this.calculateSignificance(eventType, i, eventCount),
        keyFigures: this.generateKeyFigures(title, i),
        impact: this.generateImpact(title, i, eventCount)
      });
    }
    
    return timeline.sort((a, b) => a.year - b.year);
  }

  private getTimelineEventType(index: number, total: number): TimelineEvent['type'] {
    if (index === 0) return 'milestone'; // Beginning
    if (index === total - 1) return 'milestone'; // End
    if (index === Math.floor(total / 2)) return 'major'; // Middle major event
    
    const types: TimelineEvent['type'][] = ['major', 'battle', 'treaty', 'discovery'];
    return types[index % types.length];
  }

  private generateEventTitle(mainTitle: string, index: number, total: number): string {
    const templates = [
      `Beginning of ${mainTitle}`,
      `Early Development`,
      `Major Expansion`,
      `Peak Period`,
      `Significant Changes`,
      `Important Reforms`,
      `Cultural Flourishing`,
      `Decline and Transformation`,
      `End of ${mainTitle}`
    ];
    
    if (index === 0) return templates[0];
    if (index === total - 1) return templates[8];
    
    return templates[1 + (index % (templates.length - 2))];
  }

  private generateEventDescription(mainTitle: string, index: number, total: number): string {
    const templates = [
      `The initial establishment and founding of ${mainTitle} marked a significant turning point in history.`,
      `Early developments and organizational structures began to take shape during this period.`,
      `Major expansion and growth characterized this era, with significant territorial or cultural development.`,
      `This period represented the height of power and influence, with major achievements and accomplishments.`,
      `Significant changes and adaptations occurred in response to internal and external pressures.`,
      `Important reforms and innovations were implemented to address emerging challenges.`,
      `Cultural and intellectual achievements flourished during this remarkable period.`,
      `Gradual decline and transformation began as new forces and challenges emerged.`,
      `The conclusion of this historical period marked the end of an era and the beginning of new developments.`
    ];
    
    return templates[Math.min(index, templates.length - 1)];
  }

  private calculateSignificance(type: TimelineEvent['type'], index: number, total: number): number {
    const baseSignificance = {
      milestone: 9,
      major: 7,
      battle: 6,
      treaty: 6,
      discovery: 8,
      minor: 4
    };
    
    let significance = baseSignificance[type];
    
    // First and last events are more significant
    if (index === 0 || index === total - 1) significance = Math.min(10, significance + 1);
    
    return significance;
  }

  private generateKeyFigures(title: string, index: number): string[] {
    // Generate plausible historical figures based on the context
    const leaderTitles = ['Emperor', 'King', 'Queen', 'General', 'Admiral', 'Chancellor', 'Pope', 'Sultan'];
    const names = ['Alexander', 'Constantine', 'Augustus', 'Marcus', 'Julius', 'Helena', 'Theodora', 'Justinian'];
    
    const figures: string[] = [];
    const figureCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < figureCount; i++) {
      const title_prefix = leaderTitles[Math.floor(Math.random() * leaderTitles.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      figures.push(`${title_prefix} ${name}`);
    }
    
    return figures;
  }

  private generateImpact(title: string, index: number, total: number): string {
    const impacts = [
      'Established the foundation for future developments and set important precedents.',
      'Strengthened political and social structures that would endure for generations.',
      'Expanded influence and created lasting cultural and economic connections.',
      'Achieved remarkable progress in arts, sciences, and governance.',
      'Adapted to changing circumstances and implemented crucial reforms.',
      'Introduced innovations that influenced subsequent historical developments.',
      'Created a golden age of cultural and intellectual achievement.',
      'Faced challenges that led to significant transformations.',
      'Left a lasting legacy that influenced future civilizations and cultures.'
    ];
    
    return impacts[Math.min(index, impacts.length - 1)];
  }

  private generateQuiz(title: string, description: string, timeline: TimelineEvent[]): QuizQuestion[] {
    const quiz: QuizQuestion[] = [];
    
    // Question about the time period
    quiz.push({
      id: `${this.generateId(title)}-q1`,
      question: `When did ${title} primarily take place?`,
      options: this.generateYearOptions(timeline[0]?.year || 1000),
      correctAnswer: 0,
      explanation: `${title} occurred during this historical period, as evidenced by the major events and developments of the time.`,
      difficulty: 'easy'
    });
    
    // Question about significance
    quiz.push({
      id: `${this.generateId(title)}-q2`,
      question: `What was the primary significance of ${title}?`,
      options: this.generateSignificanceOptions(title),
      correctAnswer: 0,
      explanation: `${title} was significant for its major contributions to historical development and lasting impact on civilization.`,
      difficulty: 'medium'
    });
    
    // Question about key events
    if (timeline.length > 2) {
      const majorEvent = timeline.find(e => e.type === 'milestone') || timeline[1];
      quiz.push({
        id: `${this.generateId(title)}-q3`,
        question: `Which of the following was a major event during ${title}?`,
        options: [
          majorEvent.title,
          'The Great Fire of London',
          'The Boston Tea Party',
          'The Fall of the Berlin Wall'
        ],
        correctAnswer: 0,
        explanation: `${majorEvent.title} was indeed a significant event during this period, representing a crucial development in the historical narrative.`,
        difficulty: 'medium'
      });
    }
    
    return quiz;
  }

  private generateYearOptions(correctYear: number): string[] {
    const formatYear = (year: number) => {
      if (year < 0) return `${Math.abs(year)} BC`;
      return `${year} AD`;
    };
    
    const options = [formatYear(correctYear)];
    
    // Generate plausible wrong answers
    const offsets = [200, 500, 1000];
    for (const offset of offsets) {
      const wrongYear = correctYear + (Math.random() > 0.5 ? offset : -offset);
      options.push(formatYear(wrongYear));
    }
    
    return options;
  }

  private generateSignificanceOptions(title: string): string[] {
    const category = this.categorizeEvent(title, '');
    
    const significanceMap = {
      empire: [
        'Established lasting political and administrative systems',
        'Invented the printing press',
        'Discovered the Americas',
        'Built the first railways'
      ],
      exploration: [
        'Opened new trade routes and expanded geographical knowledge',
        'Established democratic governments',
        'Developed new artistic styles',
        'Created new religious movements'
      ],
      technology: [
        'Revolutionized production methods and daily life',
        'Established new empires',
        'Discovered new continents',
        'Created new art forms'
      ],
      cultural: [
        'Transformed art, literature, and intellectual thought',
        'Built new transportation systems',
        'Established new trade routes',
        'Developed new military tactics'
      ],
      military: [
        'Changed the balance of power and territorial control',
        'Invented new technologies',
        'Established new art movements',
        'Created new economic systems'
      ]
    };
    
    return significanceMap[category];
  }

  private generateLearningObjectives(title: string, category: HistoricalEvent['category']): string[] {
    const baseObjectives = [
      `Understand the historical context and significance of ${title}`,
      `Analyze the key factors that led to the development of ${title}`,
      `Evaluate the long-term impact and legacy of ${title}`,
      `Examine the major figures and their contributions during this period`
    ];
    
    const categorySpecific = {
      empire: `Explore the political and administrative systems that characterized ${title}`,
      exploration: `Investigate the geographical and cultural discoveries made during ${title}`,
      technology: `Assess the technological innovations and their societal impact during ${title}`,
      cultural: `Analyze the artistic and intellectual achievements of ${title}`,
      military: `Examine the military strategies and their consequences during ${title}`
    };
    
    return [...baseObjectives, categorySpecific[category]];
  }

  private generateKeyFacts(description: string, timeline: TimelineEvent[]): string[] {
    const facts = [
      `This period lasted approximately ${timeline.length > 1 ? Math.abs(timeline[timeline.length - 1].year - timeline[0].year) : 100} years`,
      `It involved ${timeline.length} major historical events and developments`,
      `The period saw significant changes in political, social, and cultural structures`,
      `Key developments during this time influenced subsequent historical periods`,
      `This era is considered crucial for understanding broader historical patterns`
    ];
    
    // Add specific facts based on description
    if (description.includes('empire') || description.includes('kingdom')) {
      facts.push('It involved the rise and development of significant political powers');
    }
    if (description.includes('war') || description.includes('battle')) {
      facts.push('Military conflicts played a major role in shaping events');
    }
    if (description.includes('culture') || description.includes('art')) {
      facts.push('Cultural and artistic achievements were particularly notable');
    }
    
    return facts.slice(0, 5);
  }

  private generateTags(title: string, description: string, category: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const tags = [category];
    
    // Add contextual tags
    if (text.includes('ancient')) tags.push('ancient');
    if (text.includes('medieval')) tags.push('medieval');
    if (text.includes('modern')) tags.push('modern');
    if (text.includes('war') || text.includes('battle')) tags.push('warfare');
    if (text.includes('culture') || text.includes('art')) tags.push('culture');
    if (text.includes('religion')) tags.push('religion');
    if (text.includes('trade') || text.includes('economic')) tags.push('economics');
    if (text.includes('politics') || text.includes('government')) tags.push('politics');
    
    return [...new Set(tags)]; // Remove duplicates
  }

  private determineDifficulty(title: string, description: string): 'beginner' | 'intermediate' | 'advanced' {
    const text = (title + ' ' + description).toLowerCase();
    
    // Simple/well-known topics are beginner
    if (text.includes('ancient rome') || text.includes('world war') || text.includes('renaissance')) {
      return 'beginner';
    }
    
    // Complex political/philosophical topics are advanced
    if (text.includes('philosophy') || text.includes('complex') || text.includes('theory')) {
      return 'advanced';
    }
    
    return 'intermediate'; // Default
  }

  private getCategoryColor(category: HistoricalEvent['category']): string {
    const colors = {
      empire: '#DC143C',
      exploration: '#4169E1',
      technology: '#32CD32',
      cultural: '#9932CC',
      military: '#FF8C00'
    };
    return colors[category];
  }

  private getDefaultImage(category: HistoricalEvent['category']): string {
    const images = {
      empire: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      exploration: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
      technology: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
      cultural: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg',
      military: 'https://images.pexels.com/photos/161936/castle-hohenzollern-baden-wuerttemberg-germany-161936.jpeg'
    };
    return images[category];
  }

  private formatPeriod(startYear: number, endYear: number): string {
    const formatYear = (year: number) => {
      if (year < 0) return `${Math.abs(year)} BC`;
      return `${year} AD`;
    };
    
    if (startYear === endYear) return formatYear(startYear);
    return `${formatYear(startYear)} - ${formatYear(endYear)}`;
  }

  private generateId(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  private createFallbackEvent(query: string): HistoricalEvent {
    return {
      id: this.generateId(query),
      title: query,
      description: `Explore the fascinating history of ${query}. This topic represents an important aspect of human civilization and historical development.`,
      period: '1000 - 1500 AD',
      startYear: 1000,
      endYear: 1500,
      category: 'empire',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg',
      color: '#DC143C',
      difficulty: 'intermediate',
      tags: ['history', 'civilization'],
      learningObjectives: [
        `Learn about the historical significance of ${query}`,
        'Understand the broader historical context',
        'Explore key developments and changes',
        'Analyze the lasting impact and legacy'
      ],
      keyFacts: [
        `${query} represents an important historical topic`,
        'This period saw significant developments',
        'Multiple factors contributed to its importance',
        'It had lasting effects on subsequent history',
        'Understanding this topic enhances historical knowledge'
      ],
      timeline: [
        {
          id: `${this.generateId(query)}-1`,
          year: 1000,
          title: `Beginning of ${query}`,
          description: `The initial development and establishment of ${query}.`,
          type: 'milestone',
          significance: 8,
          keyFigures: ['Historical Leaders'],
          impact: 'Established important foundations for future development'
        },
        {
          id: `${this.generateId(query)}-2`,
          year: 1250,
          title: 'Major Development',
          description: `Significant progress and expansion during the ${query} period.`,
          type: 'major',
          significance: 7,
          keyFigures: ['Key Figures'],
          impact: 'Led to important changes and developments'
        },
        {
          id: `${this.generateId(query)}-3`,
          year: 1500,
          title: `Conclusion of ${query}`,
          description: `The end of this historical period and transition to new developments.`,
          type: 'milestone',
          significance: 8,
          keyFigures: ['Later Leaders'],
          impact: 'Set the stage for subsequent historical periods'
        }
      ],
      quiz: [
        {
          id: `${this.generateId(query)}-q1`,
          question: `What time period is associated with ${query}?`,
          options: ['1000-1500 AD', '500-800 AD', '1600-1800 AD', '1900-2000 AD'],
          correctAnswer: 0,
          explanation: `${query} is associated with this historical period based on available historical evidence.`,
          difficulty: 'easy'
        }
      ]
    };
  }
}

export const contentGenerator = new ContentGenerator();