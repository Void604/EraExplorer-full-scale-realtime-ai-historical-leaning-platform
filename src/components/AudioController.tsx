import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Music, Mic, Settings, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioSettings } from '../types';

interface AudioControllerProps {
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  currentYear: number;
  eventTitle: string;
  isPlaying: boolean;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  settings,
  onSettingsChange,
  currentYear,
  eventTitle,
  isPlaying
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);

  const playNarration = async () => {
    if (!settings.narration) return;

    try {
      const narrationText = generateNarrationText();
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(narrationText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = settings.volume;
        
        utterance.onstart = () => setIsNarrationPlaying(true);
        utterance.onend = () => setIsNarrationPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Failed to play narration:', error);
    }
  };

  const stopNarration = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsNarrationPlaying(false);
  };

  const generateNarrationText = (): string => {
    const year = currentYear < 0 ? `${Math.abs(currentYear)} BC` : `${currentYear} AD`;
    return `You are now in the year ${year}, during the ${eventTitle}. This was a significant period in human history, marked by important developments and changes that would shape the future.`;
  };

  const toggleMaster = () => {
    onSettingsChange({
      ...settings,
      enabled: !settings.enabled
    });
  };

  const updateSetting = (key: keyof AudioSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <button
        onClick={toggleMaster}
        className={`p-3 rounded-xl transition-all duration-300 ${
          settings.enabled
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
            : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
        }`}
      >
        {settings.enabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl p-4 w-80 shadow-xl z-50"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Audio Settings</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Master Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Master Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round(settings.volume * 100)}%
                </div>
              </div>

              {/* Audio Categories */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Music className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-sm text-white">Ambient Sounds</span>
                  </div>
                  <button
                    onClick={() => updateSetting('ambientSounds', !settings.ambientSounds)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      settings.ambientSounds ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.ambientSounds ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mic className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-sm text-white">Narration</span>
                  </div>
                  <button
                    onClick={() => updateSetting('narration', !settings.narration)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      settings.narration ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.narration ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="w-4 h-4 text-orange-400 mr-2" />
                    <span className="text-sm text-white">Sound Effects</span>
                  </div>
                  <button
                    onClick={() => updateSetting('soundEffects', !settings.soundEffects)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      settings.soundEffects ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.soundEffects ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Narration Controls */}
              {settings.narration && (
                <div className="border-t border-slate-700 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Current Context</span>
                    <button
                      onClick={isNarrationPlaying ? stopNarration : playNarration}
                      className={`flex items-center px-3 py-1 rounded-lg text-xs transition-colors ${
                        isNarrationPlaying
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isNarrationPlaying ? (
                        <>
                          <Pause className="w-3 h-3 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 p-2 bg-slate-700 hover:bg-slate-600 text-gray-400 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
};