import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Clock, MapPin, User, Bookmark, TrendingUp as Trending, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { historicalAPI } from '../../services/api';
import { SearchResult, HistoricalEvent } from '../../types';
import Fuse from 'fuse.js';

interface SearchInterfaceProps {
  onSelectEvent: (event: HistoricalEvent) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSelectEvent,
  onClose,
  isOpen
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    yearRange: [0, 2024] as [number, number],
    difficulty: '',
    type: 'all'
  });
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  // Fuzzy search configuration
  const fuse = useMemo(() => new Fuse(results, {
    keys: ['title', 'description'],
    threshold: 0.3,
    includeScore: true
  }), [results]);

  useEffect(() => {
    if (isOpen) {
      loadTrendingTopics();
      loadRecentSearches();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, filters]);

  const loadTrendingTopics = async () => {
    try {
      // Mock trending topics - in real app, this would come from analytics
      setTrendingTopics([
        'Roman Empire',
        'World War II',
        'Ancient Egypt',
        'Renaissance',
        'Industrial Revolution',
        'Cold War'
      ]);
    } catch (error) {
      console.error('Failed to load trending topics:', error);
    }
  };

  const loadRecentSearches = () => {
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const performSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Search Wikipedia first
      const wikipediaResults = await historicalAPI.searchWikipedia(query, 10);
      
      // Search our own database
      const apiResults = await historicalAPI.searchEvents(query, filters);
      
      // Combine and deduplicate results
      const combinedResults = [
        ...wikipediaResults,
        ...(apiResults.data || [])
      ];

      // Use fuzzy search for better matching
      const fuzzyResults = query.length > 0 
        ? fuse.search(query).map(result => result.item)
        : combinedResults;

      setResults(fuzzyResults.slice(0, 20));
      saveRecentSearch(query);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = async (result: SearchResult) => {
    try {
      if (result.eventId) {
        const eventResponse = await historicalAPI.getEvent(result.eventId);
        if (eventResponse.success) {
          onSelectEvent(eventResponse.data);
          onClose();
        }
      }
    } catch (error) {
      console.error('Failed to load event:', error);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'event': return Clock;
      case 'figure': return User;
      case 'location': return MapPin;
      case 'artifact': return Bookmark;
      default: return Clock;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Search Historical Events</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for historical events, figures, or periods..."
                className="w-full pl-12 pr-12 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                autoFocus
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-600 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400"
                >
                  <option value="">All Categories</option>
                  <option value="empire">Empires</option>
                  <option value="exploration">Exploration</option>
                  <option value="technology">Technology</option>
                  <option value="cultural">Cultural</option>
                  <option value="military">Military</option>
                  <option value="revolution">Revolution</option>
                </select>
              </div>

              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {!query && (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recent Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Topics */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Trending className="w-5 h-5 mr-2 text-yellow-400" />
                    Trending Topics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {trendingTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(topic)}
                        className="p-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 rounded-lg text-left transition-all duration-200 group"
                      >
                        <div className="text-white font-medium group-hover:text-yellow-400 transition-colors">
                          {topic}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && (
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                    <span className="ml-3 text-gray-400">Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Search Results ({results.length})
                    </h3>
                    {results.map((result, index) => {
                      const IconComponent = getResultIcon(result.type);
                      return (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result)}
                          className="w-full p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-left transition-all duration-200 group border border-transparent hover:border-yellow-400/30"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-yellow-400/20 rounded-lg group-hover:bg-yellow-400/30 transition-colors">
                              <IconComponent className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                                {result.title}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                {result.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="capitalize">{result.type}</span>
                                {result.year && <span>{result.year}</span>}
                                <span>Relevance: {Math.round(result.relevance * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : query.length > 2 ? (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                    <p className="text-gray-400">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};