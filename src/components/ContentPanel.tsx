import React, { useState } from 'react';
import { BookOpen, Image, Volume2, VolumeX, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { TimelineEvent } from '../types';

interface ContentPanelProps {
  currentEvents: TimelineEvent[];
  currentYear: number;
  eventTitle: string;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({ 
  currentEvents, 
  currentYear, 
  eventTitle 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'timeline' | 'media' | 'info'>('timeline');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BC`;
    return `${year} AD`;
  };

  const getLatestEvent = () => {
    if (currentEvents.length === 0) return null;
    return currentEvents[currentEvents.length - 1];
  };

  const latestEvent = getLatestEvent();

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: BookOpen },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'info', label: 'Context', icon: Info }
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <div className="flex items-center">
          <BookOpen className="w-6 h-6 text-green-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Historical Context</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              isAudioEnabled 
                ? 'bg-green-400 text-black' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Current Status */}
          <div className="p-6 bg-gradient-to-r from-slate-700/50 to-slate-800/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{eventTitle}</h3>
                <p className="text-green-400 font-medium">{formatYear(currentYear)}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{currentEvents.length}</div>
                <div className="text-xs text-gray-400">Events Witnessed</div>
              </div>
            </div>

            {latestEvent && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    latestEvent.type === 'milestone' ? 'bg-yellow-400' : 
                    latestEvent.type === 'major' ? 'bg-orange-400' : 'bg-blue-400'
                  }`} />
                  <h4 className="font-bold text-white">{latestEvent.title}</h4>
                  <span className="ml-auto text-xs text-gray-400">{formatYear(latestEvent.year)}</span>
                </div>
                <p className="text-sm text-gray-300">{latestEvent.description}</p>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700/50">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-400 border-b-2 border-green-400 bg-slate-700/30'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-80 overflow-y-auto">
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {currentEvents.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p>No events have occurred yet</p>
                    <p className="text-xs mt-1">Events will appear as you travel through time</p>
                  </div>
                ) : (
                  currentEvents.slice().reverse().map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative pl-8 pb-4 ${
                        index !== currentEvents.length - 1 ? 'border-l-2 border-slate-600' : ''
                      }`}
                    >
                      <div className={`absolute -left-2 w-4 h-4 rounded-full ${
                        event.type === 'milestone' ? 'bg-yellow-400' : 
                        event.type === 'major' ? 'bg-orange-400' : 'bg-blue-400'
                      }`} />
                      
                      <div className="bg-slate-700/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white">{event.title}</h4>
                          <span className="text-xs text-gray-400">{formatYear(event.year)}</span>
                        </div>
                        <p className="text-sm text-gray-300">{event.description}</p>
                        
                        {event.coordinates && (
                          <div className="mt-2 text-xs text-gray-400">
                            📍 {event.coordinates[0].toFixed(2)}°, {event.coordinates[1].toFixed(2)}°
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="text-center text-gray-400 py-8">
                  <Image className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p>Media Gallery</p>
                  <p className="text-xs mt-1">Images and videos will appear here based on the current timeline</p>
                </div>
                
                {/* Placeholder media items */}
                {currentEvents.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {currentEvents.slice(-4).map((event, index) => (
                      <div key={`media-${event.id}`} className="bg-slate-700/30 rounded-lg p-3">
                        <div className="w-full h-20 bg-slate-600 rounded mb-2 flex items-center justify-center">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-xs text-gray-300">{event.title}</div>
                        <div className="text-xs text-gray-400">{formatYear(event.year)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Historical Context</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    You are currently experiencing {eventTitle} in the year {formatYear(currentYear)}. 
                    This interactive timeline allows you to witness the progression of historical events 
                    as they unfold across centuries.
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-2">Navigation Tips</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Click on timeline markers to jump to specific events</li>
                    <li>• Use the play/pause controls for automatic progression</li>
                    <li>• Adjust playback speed for faster or slower exploration</li>
                    <li>• Watch the map and 3D views update as time progresses</li>
                  </ul>
                </div>

                {latestEvent && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Current Focus</h4>
                    <p className="text-sm text-gray-300">
                      The most recent event, <strong>{latestEvent.title}</strong>, occurred in {formatYear(latestEvent.year)}. 
                      This {latestEvent.type} event represents a significant moment in the timeline of {eventTitle}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};