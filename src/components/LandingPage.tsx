import React from 'react';
import { Clock, Globe, Sword, Compass, Cpu, Palette } from 'lucide-react';
import { HistoricalEvent } from '../types';

interface LandingPageProps {
  events: HistoricalEvent[];
  onSelectEvent: (event: HistoricalEvent) => void;
}

const categoryIcons = {
  empire: Sword,
  exploration: Compass,
  technology: Cpu,
  cultural: Palette,
  military: Sword
};

const categoryColors = {
  empire: 'from-red-600 to-red-800',
  exploration: 'from-blue-600 to-blue-800',
  technology: 'from-green-600 to-green-800',
  cultural: 'from-purple-600 to-purple-800',
  military: 'from-orange-600 to-orange-800'
};

export const LandingPage: React.FC<LandingPageProps> = ({ events, onSelectEvent }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-12 h-12 text-yellow-400 mr-4 animate-spin-slow" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              TimeTraveler
            </h1>
            <Globe className="w-12 h-12 text-yellow-400 ml-4 animate-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Journey through the most pivotal moments in human history. 
            Experience interactive timelines, explore ancient territories, 
            and witness the rise and fall of civilizations.
          </p>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => {
            const IconComponent = categoryIcons[event.category];
            const gradientClass = categoryColors[event.category];
            
            return (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 cursor-pointer"
                onClick={() => onSelectEvent(event)}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-300 uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-300 transition-colors duration-300">
                    {event.title}
                  </h3>

                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.period}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-400 font-medium">
                        {Math.abs(event.endYear - event.startYear)} year span
                      </span>
                      <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                        <span className="text-xs text-white font-medium">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-yellow-400/30 group-hover:shadow-lg group-hover:shadow-yellow-400/20 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm">
            Each historical event offers an immersive journey through time with interactive maps, 
            3D reconstructions, and multimedia content.
          </p>
        </div>
      </div>
    </div>
  );
};