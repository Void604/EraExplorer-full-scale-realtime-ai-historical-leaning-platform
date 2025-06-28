import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Brain,
  Clock,
  Star,
  Target,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { HistoricalEvent, TimelineEvent } from '../types';

interface TimeTravelProps {
  event: HistoricalEvent;
  onBack: () => void;
  onStartQuiz: () => void;
}

export const TimeTravel: React.FC<TimeTravelProps> = ({ 
  event, 
  onBack, 
  onStartQuiz 
}) => {
  const [currentYear, setCurrentYear] = useState(event.startYear);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentEvents, setCurrentEvents] = useState<TimelineEvent[]>([]);
  const [progress, setProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update current events and progress when year changes
  useEffect(() => {
    const events = event.timeline.filter(e => e.year <= currentYear);
    setCurrentEvents(events);
    
    const totalYears = event.endYear - event.startYear;
    const currentProgress = currentYear - event.startYear;
    setProgress(Math.max(0, Math.min(100, (currentProgress / totalYears) * 100)));
  }, [currentYear, event]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentYear(prev => {
        const next = prev + playbackSpeed;
        if (next >= event.endYear) {
          setIsPlaying(false);
          return event.endYear;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, event.endYear]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentYear(event.startYear);
    setIsPlaying(false);
  };

  const handleJumpToYear = (year: number) => {
    setCurrentYear(year);
  };

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
  };

  const getLatestEvent = () => {
    return currentEvents.length > 0 ? currentEvents[currentEvents.length - 1] : null;
  };

  const latestEvent = getLatestEvent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={onBack}
                className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{event.title}</h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">{event.period}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {event.quiz && (
                <button
                  onClick={onStartQuiz}
                  className="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <Brain className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Take Quiz</span>
                  <span className="sm:hidden">Quiz</span>
                </button>
              )}
              
              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Current Year Display */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            key={currentYear}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-2xl sm:text-4xl shadow-lg"
          >
            {formatYear(currentYear)}
          </motion.div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {currentEvents.length} events have occurred
          </p>
        </div>

        {/* Timeline Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Timeline Control</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Speed:</span>
              {[0.5, 1, 2, 4].map(speed => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-4 sm:mb-6">
            <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* Timeline Events */}
            <div className="relative h-6 sm:h-8 mt-2">
              {event.timeline.map(timelineEvent => {
                const position = ((timelineEvent.year - event.startYear) / (event.endYear - event.startYear)) * 100;
                const isActive = timelineEvent.year <= currentYear;
                
                return (
                  <button
                    key={timelineEvent.id}
                    className={`absolute transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                      isActive
                        ? timelineEvent.type === 'milestone'
                          ? 'bg-yellow-400 scale-125'
                          : 'bg-indigo-600 scale-110'
                        : 'bg-gray-300 scale-100'
                    }`}
                    style={{ left: `${position}%` }}
                    onClick={() => handleJumpToYear(timelineEvent.year)}
                    title={`${timelineEvent.title} (${formatYear(timelineEvent.year)})`}
                  />
                );
              })}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{formatYear(event.startYear)}</span>
              <span>{formatYear(event.endYear)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm sm:text-base"
            >
              <RotateCcw className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg text-sm sm:text-base"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Play
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Current Event */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Current Focus</h2>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            </div>
            
            {latestEvent ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    latestEvent.type === 'milestone' ? 'bg-yellow-400' : 
                    latestEvent.type === 'major' ? 'bg-indigo-600' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-500">{formatYear(latestEvent.year)}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{latestEvent.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{latestEvent.description}</p>
                
                {latestEvent.keyFigures && latestEvent.keyFigures.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Key Figures:</h4>
                    <div className="flex flex-wrap gap-2">
                      {latestEvent.keyFigures.map((figure, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm"
                        >
                          {figure}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {latestEvent.impact && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
                    <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Historical Impact:</h4>
                    <p className="text-blue-800 text-xs sm:text-sm">{latestEvent.impact}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-400">
                <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No events have occurred yet</p>
                <p className="text-xs mt-1">Press play to begin your journey through time</p>
              </div>
            )}
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Learning Objectives</h2>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            
            <div className="space-y-3">
              {event.learningObjectives?.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm sm:text-base">{objective}</p>
                </div>
              ))}
            </div>
            
            {event.keyFacts && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-500" />
                  Key Facts
                </h3>
                <div className="space-y-2">
                  {event.keyFacts.map((fact, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-gray-600">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Events List */}
        {currentEvents.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Timeline of Events</h2>
            
            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
              {currentEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleJumpToYear(event.year)}
                >
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    event.type === 'milestone' ? 'bg-yellow-400' : 
                    event.type === 'major' ? 'bg-indigo-600' : 'bg-gray-400'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{event.title}</h3>
                      <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{formatYear(event.year)}</span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
