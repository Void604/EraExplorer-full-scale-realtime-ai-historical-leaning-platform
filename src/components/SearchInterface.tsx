import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  MapPin, 
  User, 
  X, 
  TrendingUp, 
  Loader,
  ExternalLink,
  BookOpen,
  Star,
  ChevronRight,
  Play,
  Brain,
  Sparkles
} from 'lucide-react';
import { SearchResult, WikipediaResult, HistoricalEvent } from '../types';
import { wikipediaAPI } from '../services/wikipediaAPI';
import { contentGenerator } from '../services/contentGenerator';

interface SearchInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (result: SearchResult) => void;
  onStartLearning?: (event: HistoricalEvent) => void;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  onStartLearning
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<WikipediaResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
        loadSuggestions(query);
      }, 300);
    } else {
      setResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const loadInitialData = async () => {
    try {
      const [trending, recent] = await Promise.all([
        wikipediaAPI.getTrendingTopics(),
        loadRecentSearches()
      ]);
      
      setTrendingTopics(trending);
      setRecentSearches(recent);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadRecentSearches = (): string[] => {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  };

  const saveRecentSearch = (searchQuery: string) => {
    try {
      const recent = loadRecentSearches();
      const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 10);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const searchResults = await wikipediaAPI.searchArticles(searchQuery, 15);
      setResults(searchResults);
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async (searchQuery: string) => {
    try {
      const suggestionResults = await wikipediaAPI.getHistoricalSuggestions(searchQuery);
      setSuggestions(suggestionResults);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleResultClick = async (result: SearchResult) => {
    try {
      setIsLoading(true);
      const summary = await wikipediaAPI.getArticleSummary(result.title);
      if (summary) {
        setSelectedResult(summary);
      }
      
      if (onSelectResult) {
        onSelectResult(result);
      }
    } catch (error) {
      console.error('Failed to load result details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartLearning = async (searchQuery: string) => {
    if (!onStartLearning) return;

    setIsGeneratingContent(true);
    try {
      const { event, success, error } = await contentGenerator.generateHistoricalEvent(searchQuery);
      
      if (success) {
        onStartLearning(event);
        onClose();
      } else {
        console.error('Content generation failed:', error);
        // Still provide the fallback event for learning
        onStartLearning(event);
        onClose();
      }
    } catch (error) {
      console.error('Failed to generate learning content:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedResult(null);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'event': return Clock;
      case 'figure': return User;
      case 'location': return MapPin;
      case 'artifact': return BookOpen;
      default: return Clock;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'event': return 'text-blue-600 bg-blue-100';
      case 'figure': return 'text-green-600 bg-green-100';
      case 'location': return 'text-purple-600 bg-purple-100';
      case 'artifact': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl border border-gray-200 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI-Powered Learning</h2>
                  <p className="text-gray-600">Search anything and start learning instantly</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any historical topic and start learning..."
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) {
                    handleStartLearning(query.trim());
                  }
                }}
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <Search className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-900">{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Quick Start Button */}
            {query.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <button
                  onClick={() => handleStartLearning(query.trim())}
                  disabled={isGeneratingContent}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating Learning Content...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Learning: "{query}"
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
                <span className="text-gray-600">Searching historical knowledge...</span>
              </div>
            )}

            {/* Selected Result Detail */}
            {selectedResult && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedResult.title}</h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedResult.thumbnail && (
                    <div className="md:col-span-1">
                      <img
                        src={selectedResult.thumbnail.source}
                        alt={selectedResult.title}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  
                  <div className={selectedResult.thumbnail ? 'md:col-span-2' : 'md:col-span-3'}>
                    <p className="text-gray-700 mb-4 leading-relaxed">{selectedResult.extract}</p>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleStartLearning(selectedResult.title)}
                        disabled={isGeneratingContent}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm disabled:opacity-50"
                      >
                        {isGeneratingContent ? (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4 mr-2" />
                        )}
                        Start Learning
                      </button>
                      
                      <a
                        href={selectedResult.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Wikipedia
                      </a>
                      
                      {selectedResult.coordinates && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedResult.coordinates[0].toFixed(2)}°, {selectedResult.coordinates[1].toFixed(2)}°
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Search Results */}
            {!query && !isLoading && (
              <div className="space-y-8">
                {/* How it Works */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    How AI Learning Works
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Search className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-blue-900 mb-1">1. Search Anything</h4>
                      <p className="text-blue-700">Type any historical topic, person, or event</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-blue-900 mb-1">2. AI Generates Content</h4>
                      <p className="text-blue-700">Creates timeline, quiz, and learning materials</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Play className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-blue-900 mb-1">3. Start Learning</h4>
                      <p className="text-blue-700">Interactive timeline and knowledge quiz</p>
                    </div>
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => setQuery(search)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Topics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    Trending Historical Topics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trendingTopics.map((topic, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleStartLearning(topic)}
                        className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-purple-50 rounded-xl text-left transition-all duration-200 group border border-gray-200 hover:border-indigo-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {topic}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Play className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && results.length > 0 && !isLoading && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Results ({results.length})
                </h3>
                <div className="space-y-3">
                  {results.map((result, index) => {
                    const IconComponent = getResultIcon(result.type);
                    const colorClass = getResultColor(result.type);
                    
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-indigo-200"
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-xl ${colorClass}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                                {result.title}
                              </h4>
                              <div className="flex items-center space-x-2 ml-2">
                                <span className="text-xs text-gray-500 capitalize bg-gray-200 px-2 py-1 rounded-full">
                                  {result.type}
                                </span>
                                {result.year && (
                                  <span className="text-xs text-gray-500">
                                    {result.year < 0 ? `${Math.abs(result.year)} BC` : `${result.year} AD`}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {result.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-gray-500">
                                  Relevance: {Math.round(result.relevance * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleStartLearning(result.title)}
                                  disabled={isGeneratingContent}
                                  className="flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-xs hover:shadow-md transition-all duration-200 disabled:opacity-50"
                                >
                                  {isGeneratingContent ? (
                                    <Loader className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <Play className="w-3 h-3 mr-1" />
                                  )}
                                  Learn
                                </button>
                                <button
                                  onClick={() => handleResultClick(result)}
                                  className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors"
                                >
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  Don't worry! Our AI can still create learning content for "{query}"
                </p>
                <button
                  onClick={() => handleStartLearning(query)}
                  disabled={isGeneratingContent}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                      Generating Content...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2 inline" />
                      Generate Learning Content
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};