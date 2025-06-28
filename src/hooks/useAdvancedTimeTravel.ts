import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { HistoricalEvent, TimelineEvent, UserProgress, AudioSettings } from '../types';
import { historicalAPI } from '../services/api';
import { debounce } from 'lodash';

interface UseAdvancedTimeTravelOptions {
  autoSave?: boolean;
  enableAnalytics?: boolean;
  preloadData?: boolean;
  audioEnabled?: boolean;
}

export const useAdvancedTimeTravel = (
  event: HistoricalEvent | null,
  options: UseAdvancedTimeTravelOptions = {}
) => {
  const {
    autoSave = true,
    enableAnalytics = true,
    preloadData = true,
    audioEnabled = false
  } = options;

  // Core state
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced state
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<Map<number, string>>(new Map());
  const [viewHistory, setViewHistory] = useState<number[]>([]);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: audioEnabled,
    volume: 0.7,
    narration: true,
    soundEffects: true,
    ambientSounds: true
  });

  // Performance optimization
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<number>(0);
  const preloadedDataRef = useRef<Map<number, any>>(new Map());

  // Debounced save function
  const debouncedSave = useMemo(
    () => debounce(async (eventId: string, year: number, notes?: string) => {
      if (autoSave) {
        try {
          await historicalAPI.saveProgress(eventId, year, notes);
          lastSaveRef.current = Date.now();
        } catch (error) {
          console.error('Failed to save progress:', error);
        }
      }
    }, 2000),
    [autoSave]
  );

  // Initialize when event changes
  useEffect(() => {
    if (event) {
      setCurrentYear(event.startYear);
      setIsPlaying(false);
      setError(null);
      loadUserProgress(event.id);
      
      if (preloadData) {
        preloadEventData(event);
      }

      if (enableAnalytics) {
        historicalAPI.trackEvent('event_started', {
          eventId: event.id,
          eventTitle: event.title
        });
      }
    }
  }, [event, preloadData, enableAnalytics]);

  // Auto-play functionality with enhanced features
  useEffect(() => {
    if (!isPlaying || !event) return;

    intervalRef.current = setInterval(() => {
      setCurrentYear(prev => {
        const next = prev + playbackSpeed;
        
        // Check for significant events at this year
        const eventsAtYear = event.timeline.filter(e => e.year === Math.floor(next));
        if (eventsAtYear.length > 0 && audioSettings.soundEffects) {
          playEventSound(eventsAtYear[0]);
        }

        // Auto-pause at major milestones
        const milestone = event.timeline.find(e => 
          e.year === Math.floor(next) && e.type === 'milestone'
        );
        if (milestone) {
          setIsPlaying(false);
          if (enableAnalytics) {
            historicalAPI.trackEvent('milestone_reached', {
              eventId: event.id,
              milestoneId: milestone.id,
              year: milestone.year
            });
          }
        }

        if (next >= event.endYear) {
          setIsPlaying(false);
          if (enableAnalytics) {
            historicalAPI.trackEvent('event_completed', {
              eventId: event.id,
              timeSpent: Date.now() - lastSaveRef.current
            });
          }
          return event.endYear;
        }

        // Add to view history
        setViewHistory(prev => [...prev.slice(-50), Math.floor(next)]);

        // Auto-save progress
        if (event && autoSave) {
          debouncedSave(event.id, Math.floor(next));
        }

        return next;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, event, audioSettings, enableAnalytics, autoSave, debouncedSave]);

  // Load user progress
  const loadUserProgress = async (eventId: string) => {
    try {
      setIsLoading(true);
      const progress = await historicalAPI.getProgress(eventId);
      if (progress.data) {
        setUserProgress(progress.data);
        setCurrentYear(progress.data.currentYear || event?.startYear || 0);
        setBookmarks(progress.data.bookmarks || []);
        
        // Load notes
        const notesMap = new Map();
        progress.data.notes?.forEach((note: any) => {
          notesMap.set(note.year, note.content);
        });
        setNotes(notesMap);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      setError('Failed to load your progress');
    } finally {
      setIsLoading(false);
    }
  };

  // Preload event data for smooth experience
  const preloadEventData = async (event: HistoricalEvent) => {
    try {
      const keyYears = event.timeline.map(e => e.year);
      const preloadPromises = keyYears.map(async (year) => {
        // Preload map data, artifacts, etc. for key years
        const data = {
          mapData: event.mapData.find(m => m.year <= year),
          artifacts: event.artifacts.filter(a => a.year <= year),
          multimedia: event.multimedia?.filter(m => (m.year || 0) <= year)
        };
        preloadedDataRef.current.set(year, data);
      });

      await Promise.all(preloadPromises);
    } catch (error) {
      console.error('Failed to preload data:', error);
    }
  };

  // Enhanced event filtering with preloaded data
  const currentEvents = useMemo(() => {
    if (!event) return [];
    
    const events = event.timeline.filter(e => e.year <= currentYear);
    
    // Add view analytics
    if (enableAnalytics && events.length > 0) {
      const latestEvent = events[events.length - 1];
      historicalAPI.trackEvent('timeline_event_viewed', {
        eventId: event.id,
        timelineEventId: latestEvent.id,
        year: currentYear
      });
    }
    
    return events;
  }, [event, currentYear, enableAnalytics]);

  // Get preloaded or compute current data
  const getCurrentData = useCallback((year: number) => {
    const preloaded = preloadedDataRef.current.get(year);
    if (preloaded) return preloaded;

    if (!event) return null;

    return {
      mapData: event.mapData.filter(m => m.year <= year).pop() || null,
      artifacts: event.artifacts.filter(a => a.year <= year),
      multimedia: event.multimedia?.filter(m => (m.year || 0) <= year) || []
    };
  }, [event]);

  const currentMapData = useMemo(() => {
    const data = getCurrentData(currentYear);
    return data?.mapData || null;
  }, [getCurrentData, currentYear]);

  const currentArtifacts = useMemo(() => {
    const data = getCurrentData(currentYear);
    return data?.artifacts || [];
  }, [getCurrentData, currentYear]);

  const currentMultimedia = useMemo(() => {
    const data = getCurrentData(currentYear);
    return data?.multimedia || [];
  }, [getCurrentData, currentYear]);

  // Progress calculation with analytics
  const progress = useMemo(() => {
    if (!event) return 0;
    const totalYears = event.endYear - event.startYear;
    const currentProgress = currentYear - event.startYear;
    const progressPercent = Math.max(0, Math.min(100, (currentProgress / totalYears) * 100));
    
    // Track progress milestones
    if (enableAnalytics && progressPercent > 0 && progressPercent % 25 === 0) {
      historicalAPI.trackEvent('progress_milestone', {
        eventId: event.id,
        progress: progressPercent
      });
    }
    
    return progressPercent;
  }, [event, currentYear, enableAnalytics]);

  // Enhanced controls
  const play = useCallback(() => {
    setIsPlaying(true);
    if (enableAnalytics && event) {
      historicalAPI.trackEvent('playback_started', {
        eventId: event.id,
        year: currentYear,
        speed: playbackSpeed
      });
    }
  }, [enableAnalytics, event, currentYear, playbackSpeed]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (enableAnalytics && event) {
      historicalAPI.trackEvent('playback_paused', {
        eventId: event.id,
        year: currentYear
      });
    }
  }, [enableAnalytics, event, currentYear]);

  const reset = useCallback(() => {
    if (event) {
      setCurrentYear(event.startYear);
      setIsPlaying(false);
      setViewHistory([]);
      if (enableAnalytics) {
        historicalAPI.trackEvent('timeline_reset', {
          eventId: event.id
        });
      }
    }
  }, [event, enableAnalytics]);

  const jumpToYear = useCallback((year: number) => {
    if (event && year >= event.startYear && year <= event.endYear) {
      setCurrentYear(year);
      setViewHistory(prev => [...prev.slice(-50), year]);
      
      if (enableAnalytics) {
        historicalAPI.trackEvent('year_jumped', {
          eventId: event.id,
          fromYear: currentYear,
          toYear: year
        });
      }
    }
  }, [event, currentYear, enableAnalytics]);

  const jumpToEvent = useCallback((timelineEvent: TimelineEvent) => {
    jumpToYear(timelineEvent.year);
    if (enableAnalytics && event) {
      historicalAPI.trackEvent('event_jumped', {
        eventId: event.id,
        timelineEventId: timelineEvent.id,
        year: timelineEvent.year
      });
    }
  }, [jumpToYear, enableAnalytics, event]);

  // Bookmark management
  const toggleBookmark = useCallback((year?: number) => {
    const targetYear = year || currentYear;
    setBookmarks(prev => {
      const isBookmarked = prev.includes(targetYear);
      const newBookmarks = isBookmarked
        ? prev.filter(y => y !== targetYear)
        : [...prev, targetYear];
      
      if (enableAnalytics && event) {
        historicalAPI.trackEvent('bookmark_toggled', {
          eventId: event.id,
          year: targetYear,
          action: isBookmarked ? 'removed' : 'added'
        });
      }
      
      return newBookmarks;
    });
  }, [currentYear, enableAnalytics, event]);

  // Notes management
  const addNote = useCallback((year: number, content: string) => {
    setNotes(prev => new Map(prev.set(year, content)));
    if (enableAnalytics && event) {
      historicalAPI.trackEvent('note_added', {
        eventId: event.id,
        year,
        noteLength: content.length
      });
    }
  }, [enableAnalytics, event]);

  const removeNote = useCallback((year: number) => {
    setNotes(prev => {
      const newNotes = new Map(prev);
      newNotes.delete(year);
      return newNotes;
    });
  }, []);

  // Audio functions
  const playEventSound = useCallback((event: TimelineEvent) => {
    if (!audioSettings.enabled || !audioSettings.soundEffects) return;
    
    // Play appropriate sound based on event type
    const soundMap = {
      battle: '/sounds/battle.mp3',
      treaty: '/sounds/treaty.mp3',
      discovery: '/sounds/discovery.mp3',
      milestone: '/sounds/milestone.mp3'
    };
    
    const soundFile = soundMap[event.type as keyof typeof soundMap] || '/sounds/default.mp3';
    
    try {
      const audio = new Audio(soundFile);
      audio.volume = audioSettings.volume;
      audio.play().catch(console.error);
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }, [audioSettings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with input fields
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case 'r':
          e.preventDefault();
          reset();
          break;
        case 'b':
          e.preventDefault();
          toggleBookmark();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          jumpToYear(Math.max(event?.startYear || 0, currentYear - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          jumpToYear(Math.min(event?.endYear || 0, currentYear + 10));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, play, pause, reset, toggleBookmark, jumpToYear, currentYear, event]);

  return {
    // Core state
    currentYear,
    currentEvents,
    currentMapData,
    currentArtifacts,
    currentMultimedia,
    progress,
    isPlaying,
    playbackSpeed,
    isLoading,
    error,

    // Advanced state
    userProgress,
    bookmarks,
    notes,
    viewHistory,
    audioSettings,

    // Core controls
    play,
    pause,
    reset,
    jumpToYear,
    jumpToEvent,
    setPlaybackSpeed,

    // Advanced controls
    toggleBookmark,
    addNote,
    removeNote,
    setAudioSettings,

    // Utility functions
    getCurrentData,
    playEventSound
  };
};