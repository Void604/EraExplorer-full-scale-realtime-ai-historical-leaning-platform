import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Globe, 
  Search, 
  BookOpen, 
  Star, 
  TrendingUp,
  Play,
  Users,
  Award,
  Zap,
  ChevronRight,
  Sparkles,
  Brain,
  Target,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { HistoricalEvent } from '../types';
import { wikipediaAPI } from '../services/wikipediaAPI';
import { SearchInterface } from './SearchInterface';

interface ModernLandingPageProps {
  events: HistoricalEvent[];
  onSelectEvent: (event: HistoricalEvent) => void;
  onOpenDashboard: () => void;
}

export const ModernLandingPage: React.FC<ModernLandingPageProps> = ({ 
  events, 
  onSelectEvent,
  onOpenDashboard 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<HistoricalEvent | null>(null);
  const [randomFact, setRandomFact] = useState<string>('');

  useEffect(() => {
    loadInitialData();
    setFeaturedEvent(events[0] || null);
    loadRandomFact();
  }, [events]);

  const loadInitialData = async () => {
    try {
      const topics = await wikipediaAPI.getTrendingTopics();
      setTrendingTopics(topics.slice(0, 6));
    } catch (error) {
      console.error('Failed to load trending topics:', error);
    }
  };

  const loadRandomFact = () => {
    const facts = [
      "The Great Wall of China took over 2,000 years to build",
      "Ancient Rome had a population of over 1 million people",
      "The Renaissance began in 14th century Italy",
      "Vikings reached North America 500 years before Columbus",
      "The Library of Alexandria contained over 400,000 scrolls",
      "Ancient Egyptians invented paper, ink, and the calendar"
    ];
    setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categoryIcons = {
    empire: Globe,
    exploration: Search,
    technology: Zap,
    cultural: Star,
    military: Award
  };

  const categoryColors = {
    empire: 'from-red-500 to-pink-600',
    exploration: 'from-blue-500 to-cyan-600',
    technology: 'from-green-500 to-emerald-600',
    cultural: 'from-purple-500 to-violet-600',
    military: 'from-orange-500 to-amber-600'
  };

  const handleGlobalSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    EraExplorer
                  </h1>
                  <p className="text-sm text-gray-600">AI-Powered Historical Learning</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleGlobalSearch}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </button>
                <button
                  onClick={onOpenDashboard}
                  className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleGlobalSearch}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-indigo-700 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Learning • Search Anything • Learn Everything
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              >
                Learn Any
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Historical Topic
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              >
                Revolutionary AI creates personalized learning experiences for ANY historical topic you search. 
                Interactive timelines, smart quizzes, and real-time Wikipedia integration make history come alive.
              </motion.p>

              {/* AI Features Highlight */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Search Anything</h3>
                  <p className="text-sm text-gray-600">Type any historical topic and our AI instantly creates comprehensive learning content</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">AI-Generated Content</h3>
                  <p className="text-sm text-gray-600">Smart algorithms create timelines, quizzes, and learning objectives automatically</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-green-300 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Instant Learning</h3>
                  <p className="text-sm text-gray-600">Start learning immediately with interactive experiences and knowledge assessments</p>
                </div>
              </motion.div>

              {/* Main Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto mb-8"
              >
                <button
                  onClick={handleGlobalSearch}
                  className="w-full flex items-center px-6 py-4 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg shadow-lg transition-all duration-200 group"
                >
                  <Search className="w-5 h-5 text-gray-400 mr-4" />
                  <span className="text-gray-500 group-hover:text-gray-700 transition-colors">
                    Search any historical topic and start learning instantly...
                  </span>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs rounded-full font-medium">
                      AI-Powered
                    </div>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">⌘</kbd>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">K</kbd>
                  </div>
                </button>
              </motion.div>

              {/* Example Searches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <p className="text-sm text-gray-500 mb-3">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Napoleon Bonaparte', 'Ancient Mesopotamia', 'Industrial Revolution', 'Maya Civilization', 'Cold War', 'Renaissance Art'].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(example);
                        handleGlobalSearch();
                      }}
                      className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 border border-gray-200 hover:border-indigo-300"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Random Fact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center px-6 py-3 bg-yellow-100 rounded-full text-yellow-800 text-sm mb-8"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                <span className="font-medium">Did you know?</span>
                <span className="ml-2">{randomFact}</span>
                <button
                  onClick={loadRandomFact}
                  className="ml-3 p-1 hover:bg-yellow-200 rounded-full transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Event */}
        {featuredEvent && (
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={featuredEvent.image}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-yellow-400 text-black rounded-full text-sm font-medium">
                        Featured Learning
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium capitalize">
                        {featuredEvent.category}
                      </span>
                      <span className="ml-3 text-gray-500">{featuredEvent.period}</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {featuredEvent.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredEvent.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.abs(featuredEvent.endYear - featuredEvent.startYear)} years
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Target className="w-4 h-4 mr-1" />
                          {featuredEvent.difficulty}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {featuredEvent.timeline.length} events
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Brain className="w-4 h-4 mr-1" />
                          {featuredEvent.quiz?.length || 0} quiz questions
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onSelectEvent(featuredEvent)}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Learning
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Curated Events Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Curated Historical Journeys
              </h2>
              <p className="text-xl text-gray-600">
                Hand-picked historical events with comprehensive learning materials
              </p>
            </div>

            {/* Local Search */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter curated events..."
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredEvents.map((event, index) => {
                  const IconComponent = categoryIcons[event.category];
                  const gradientClass = categoryColors[event.category];
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => onSelectEvent(event)}
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-60`} />
                        <div className="absolute top-4 left-4">
                          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-medium capitalize">
                            {event.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                            {event.category}
                          </span>
                          <span className="text-xs text-gray-500">{event.period}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {Math.abs(event.endYear - event.startYear)}y
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {event.timeline.length} events
                            </div>
                            {event.quiz && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Brain className="w-3 h-3 mr-1" />
                                {event.quiz.length} quiz
                              </div>
                            )}
                          </div>
                          
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No curated events found</h3>
                <p className="text-gray-600 mb-4">Try our AI search to learn about "{searchQuery}" instead</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    handleGlobalSearch();
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Search with AI
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mr-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">EraExplorer</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Revolutionary AI-powered platform making any historical topic accessible and engaging for learners worldwide.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Search Interface */}
      <SearchInterface
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onStartLearning={onSelectEvent}
      />
    </div>
  );
};