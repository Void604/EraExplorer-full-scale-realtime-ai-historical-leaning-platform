import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, MapPin, Star } from 'lucide-react';
import { HistoricalEvent, TimelineEvent } from '../types';

interface TimelineProps {
  event: HistoricalEvent;
  currentYear: number;
  progress: number;
  isPlaying: boolean;
  playbackSpeed: number;
  currentEvents: TimelineEvent[];
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onJumpToYear: (year: number) => void;
  onJumpToEvent: (event: TimelineEvent) => void;
  onSpeedChange: (speed: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  event,
  currentYear,
  progress,
  isPlaying,
  playbackSpeed,
  currentEvents,
  onPlay,
  onPause,
  onReset,
  onJumpToYear,
  onJumpToEvent,
  onSpeedChange
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const targetYear = event.startYear + (event.endYear - event.startYear) * percentage;
    
    onJumpToYear(Math.round(targetYear));
  };

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  const getEventPosition = (eventYear: number) => {
    const totalYears = event.endYear - event.startYear;
    const yearFromStart = eventYear - event.startYear;
    return (yearFromStart / totalYears) * 100;
  };

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-yellow-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Timeline Control</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Speed:</span>
          {[0.5, 1, 2, 4].map(speed => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                playbackSpeed === speed
                  ? 'bg-yellow-400 text-black'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Current Year Display */}
      <div className="text-center mb-6">
        <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-xl font-bold text-2xl shadow-lg">
          {formatYear(currentYear)}
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {currentEvents.length} events have occurred
        </p>
      </div>

      {/* Timeline */}
      <div className="relative mb-6">
        {/* Timeline Track */}
        <div
          ref={timelineRef}
          className="h-4 bg-slate-700 rounded-full cursor-pointer relative overflow-hidden"
          onClick={handleTimelineClick}
        >
          {/* Progress Bar */}
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 shadow-lg"
            style={{ width: `${progress}%` }}
          />
          
          {/* Current Position Indicator */}
          <div
            className="absolute top-1/2 w-6 h-6 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg border-2 border-yellow-400"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Timeline Events */}
        <div className="relative h-8 mt-2">
          {event.timeline.map(timelineEvent => {
            const position = getEventPosition(timelineEvent.year);
            const isActive = timelineEvent.year <= currentYear;
            
            return (
              <div
                key={timelineEvent.id}
                className="absolute transform -translate-x-1/2 cursor-pointer group"
                style={{ left: `${position}%` }}
                onClick={() => onJumpToEvent(timelineEvent)}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? timelineEvent.type === 'milestone'
                      ? 'bg-yellow-400 scale-150'
                      : 'bg-orange-400 scale-125'
                    : 'bg-slate-500 scale-100'
                } hover:scale-150`}>
                  {timelineEvent.type === 'milestone' && (
                    <Star className="w-2 h-2 text-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap max-w-48">
                    <div className="font-bold">{timelineEvent.title}</div>
                    <div className="text-gray-400">{formatYear(timelineEvent.year)}</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Year Labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-4">
          <span>{formatYear(event.startYear)}</span>
          <span>{formatYear(event.endYear)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>
        
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Play
            </>
          )}
        </button>
      </div>

      {/* Recent Events */}
      {currentEvents.length > 0 && (
        <div className="mt-6 border-t border-slate-700 pt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Recent Events
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {currentEvents.slice(-3).reverse().map(evt => (
              <div
                key={evt.id}
                className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                onClick={() => onJumpToEvent(evt)}
              >
                <div>
                  <div className="text-sm font-medium text-white">{evt.title}</div>
                  <div className="text-xs text-gray-400">{formatYear(evt.year)}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  evt.type === 'milestone' ? 'bg-yellow-400' : 'bg-orange-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};