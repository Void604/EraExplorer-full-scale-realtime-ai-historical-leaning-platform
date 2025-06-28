import { useState, useCallback, useEffect, useMemo } from 'react';
import { HistoricalEvent, TimelineEvent, UserProgress, AudioSettings } from '../types';

interface UseTimeTravelOptions {
  autoSave?: boolean;
  enableAudio?: boolean;
}

export const useTimeTravel = (
  event: HistoricalEvent | null,
  options: UseTimeTravelOptions = {}
) => {
  const { autoSave = true, enableAudio = false } = options;

  // Core state
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // User state
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<Map<number, string>>(new Map());
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: enableAudio,
    volume: 0.7,
    narration: true,
    soundEffects: true,
    ambientSounds: true
  });

  // Initialize when event changes
  useEffect(() => {
    if (event) {
      setCurrentYear(event.startYear);
      setIsPlaying(false);
      loadUserProgress(event.id);
    }
  }, [event]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !event) return;

    const interval = setInterval(() => {
      setCurrentYear(prev => {
        const next = prev + playbackSpeed;
        
        // Auto-pause at milestones
        const milestone = event.timeline.find(e => 
          e.year === Math.floor(next) && e.type === 'milestone'
        );
        if (milestone) {
          setIsPlaying(false);
        }

        if (next >= event.endYear) {
          setIsPlaying(false);
          return event.endYear;
        }

        // Auto-save progress
        if (autoSave && Math.floor(next) % 10 === 0) {
          saveProgress(event.id, Math.floor(next));
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, event, autoSave]);

  // Load user progress
  const loadUserProgress = useCallback(async (eventId: string) => {
    try {
      const saved = localStorage.getItem(`progress_${eventId}`);
      if (saved) {
        const progress: UserProgress = JSON.parse(saved);
        setCurrentYear(progress.currentYear);
        setBookmarks(progress.bookmarks);
        
        // Convert notes array back to Map
        const notesMap = new Map();
        progress.notes.forEach((note: any) => {
          notesMap.set(note.year, note.content);
        });
        setNotes(notesMap);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }, []);

  // Save progress
  const saveProgress = useCallback(async (eventId: string, year: number) => {
    try {
      const progress: UserProgress = {
        userId: 'user-1',
        eventId,
        currentYear: year,
        bookmarks,
        notes,
        timeSpent: 0,
        lastVisited: new Date().toISOString()
      };
      
      localStorage.setItem(`progress_${eventId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [bookmarks, notes]);

  // Get current timeline events
  const currentEvents = useMemo(() => {
    if (!event) return [];
    return event.timeline.filter(e => e.year <= currentYear);
  }, [event, currentYear]);

  // Get current map data
  const currentMapData = useMemo(() => {
    if (!event) return null;
    const validMapData = event.mapData.filter(m => m.year <= currentYear);
    return validMapData[validMapData.length - 1] || null;
  }, [event, currentYear]);

  // Get current artifacts
  const currentArtifacts = useMemo(() => {
    if (!event) return [];
    return event.artifacts.filter(a => a.year <= currentYear);
  }, [event, currentYear]);

  // Progress calculation
  const progress = useMemo(() => {
    if (!event) return 0;
    const totalYears = event.endYear - event.startYear;
    const currentProgress = currentYear - event.startYear;
    return Math.max(0, Math.min(100, (currentProgress / totalYears) * 100));
  }, [event, currentYear]);

  // Controls
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    if (event) {
      setCurrentYear(event.startYear);
      setIsPlaying(false);
    }
  }, [event]);

  const jumpToYear = useCallback((year: number) => {
    if (event && year >= event.startYear && year <= event.endYear) {
      setCurrentYear(year);
    }
  }, [event]);

  const jumpToEvent = useCallback((timelineEvent: TimelineEvent) => {
    jumpToYear(timelineEvent.year);
  }, [jumpToYear]);

  // Bookmark management
  const toggleBookmark = useCallback((year?: number) => {
    const targetYear = year || currentYear;
    setBookmarks(prev => {
      const isBookmarked = prev.includes(targetYear);
      return isBookmarked
        ? prev.filter(y => y !== targetYear)
        : [...prev, targetYear];
    });
  }, [currentYear]);

  // Notes management
  const addNote = useCallback((year: number, content: string) => {
    setNotes(prev => new Map(prev.set(year, content)));
  }, []);

  const removeNote = useCallback((year: number) => {
    setNotes(prev => {
      const newNotes = new Map(prev);
      newNotes.delete(year);
      return newNotes;
    });
  }, []);

  return {
    // Core state
    currentYear,
    currentEvents,
    currentMapData,
    currentArtifacts,
    progress,
    isPlaying,
    playbackSpeed,
    isLoading,

    // User state
    bookmarks,
    notes,
    audioSettings,

    // Controls
    play,
    pause,
    reset,
    jumpToYear,
    jumpToEvent,
    setPlaybackSpeed,

    // User features
    toggleBookmark,
    addNote,
    removeNote,
    setAudioSettings
  };
};