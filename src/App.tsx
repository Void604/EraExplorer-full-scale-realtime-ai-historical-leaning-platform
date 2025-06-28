import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ModernLandingPage } from './components/ModernLandingPage';
import { LearningDashboard } from './components/LearningDashboard';
import { TimeTravel } from './components/TimeTravel';
import { QuizComponent } from './components/QuizComponent';
import { SearchInterface } from './components/SearchInterface';
import { enhancedHistoricalEvents } from './data/enhancedEvents';
import { HistoricalEvent, UserProgress } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Loader } from 'lucide-react';

type AppView = 'landing' | 'dashboard' | 'timetravel' | 'quiz';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load user progress on startup
  useEffect(() => {
    loadUserProgress();
    
    // Global keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (showQuiz) {
          setShowQuiz(false);
        } else if (currentView !== 'landing') {
          handleBackToLanding();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSearchOpen, showQuiz, currentView]);

  const loadUserProgress = () => {
    try {
      const saved = localStorage.getItem('userProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  const saveUserProgress = (progress: UserProgress[]) => {
    try {
      localStorage.setItem('userProgress', JSON.stringify(progress));
      setUserProgress(progress);
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  };

  const handleSelectEvent = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setCurrentView('timetravel');
    setIsLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLanding = () => {
    setSelectedEvent(null);
    setCurrentView('landing');
  };

  const handleOpenDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleStartQuiz = () => {
    if (selectedEvent?.quiz) {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number, answers: boolean[]) => {
    if (selectedEvent) {
      // Update user progress
      const existingProgress = userProgress.find(p => p.eventId === selectedEvent.id);
      if (existingProgress) {
        const updatedProgress = userProgress.map(p => 
          p.eventId === selectedEvent.id 
            ? { 
                ...p, 
                completedQuizzes: [...p.completedQuizzes, `quiz-${Date.now()}`],
                lastVisited: new Date().toISOString(),
                learningStreak: p.learningStreak + 1,
                achievements: score >= selectedEvent.quiz!.length * 0.8 
                  ? [...p.achievements, 'quiz_master'] 
                  : p.achievements
              }
            : p
        );
        saveUserProgress(updatedProgress);
      } else {
        const newProgress: UserProgress = {
          userId: 'user-1',
          eventId: selectedEvent.id,
          currentYear: selectedEvent.startYear,
          completedQuizzes: [`quiz-${Date.now()}`],
          bookmarks: [],
          notes: new Map(),
          timeSpent: 0,
          lastVisited: new Date().toISOString(),
          learningStreak: 1,
          achievements: score >= selectedEvent.quiz!.length * 0.8 ? ['quiz_master'] : []
        };
        saveUserProgress([...userProgress, newProgress]);
      }
    }
    setShowQuiz(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <LearningDashboard
            userProgress={userProgress}
            onStartLearning={() => setCurrentView('landing')}
          />
        );
      case 'timetravel':
        return selectedEvent ? (
          <TimeTravel
            event={selectedEvent}
            onBack={handleBackToLanding}
            onStartQuiz={handleStartQuiz}
          />
        ) : null;
      default:
        return (
          <ModernLandingPage
            events={enhancedHistoricalEvents}
            onSelectEvent={handleSelectEvent}
            onOpenDashboard={handleOpenDashboard}
          />
        );
    }
  };

  return (
    <HelmetProvider>
      <div className="App min-h-screen">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-200 max-w-md mx-4"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mr-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900">AI Learning Engine</h3>
                      <p className="text-gray-600 text-sm">Preparing your journey</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Loader className="w-4 h-4 mr-3 animate-spin text-indigo-600" />
                      Analyzing historical content...
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Sparkles className="w-4 h-4 mr-3 text-purple-600" />
                      Generating interactive timeline...
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Brain className="w-4 h-4 mr-3 text-green-600" />
                      Creating knowledge assessments...
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>

        {/* Quiz Modal */}
        {showQuiz && selectedEvent?.quiz && (
          <QuizComponent
            questions={selectedEvent.quiz}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        )}

        {/* Global Search Interface */}
        <SearchInterface
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onStartLearning={handleSelectEvent}
        />
      </div>
    </HelmetProvider>
  );
}

export default App;