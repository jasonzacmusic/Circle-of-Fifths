import { useState, useEffect, useCallback } from 'react';
import { getAudioEngine } from '@/lib/audio-engine';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioEngine = getAudioEngine();

  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioEngine.initialize();
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError('Failed to initialize audio system');
        console.error('Audio initialization error:', err);
      }
    };

    initializeAudio();

    return () => {
      audioEngine.dispose();
    };
  }, [audioEngine]);

  const togglePlayback = useCallback(() => {
    if (!isInitialized) {
      setError('Audio system not ready');
      return;
    }

    setIsPlaying(prev => {
      if (prev) {
        audioEngine.stop();
      }
      return !prev;
    });
  }, [audioEngine, isInitialized]);

  const stopPlayback = useCallback(() => {
    audioEngine.stop();
    setIsPlaying(false);
  }, [audioEngine]);

  const playNote = useCallback((note: string, duration?: string, octave?: number) => {
    if (!isInitialized) {
      setError('Audio system not ready');
      return;
    }

    try {
      audioEngine.playNote(note, duration, octave);
      setError(null);
    } catch (err) {
      setError('Failed to play note');
      console.error('Note playback error:', err);
    }
  }, [audioEngine, isInitialized]);

  const playChord = useCallback((notes: string[], duration?: string, octave?: number) => {
    if (!isInitialized) {
      setError('Audio system not ready');
      return;
    }

    try {
      audioEngine.playChord(notes, duration, octave);
      setError(null);
    } catch (err) {
      setError('Failed to play chord');
      console.error('Chord playback error:', err);
    }
  }, [audioEngine, isInitialized]);

  const playScale = useCallback(async (
    rootNote: string,
    scaleType: 'major' | 'minor',
    direction?: 'clockwise' | 'counterclockwise',
    octave?: number
  ) => {
    if (!isInitialized) {
      setError('Audio system not ready');
      return;
    }

    try {
      setIsPlaying(true);
      await audioEngine.playScale(rootNote, scaleType, direction, octave);
      setIsPlaying(false);
      setError(null);
    } catch (err) {
      setError('Failed to play scale');
      setIsPlaying(false);
      console.error('Scale playback error:', err);
    }
  }, [audioEngine, isInitialized]);

  const playInterval = useCallback(async (
    note1: string,
    note2: string,
    type?: 'harmonic' | 'melodic',
    octave?: number
  ) => {
    if (!isInitialized) {
      setError('Audio system not ready');
      return;
    }

    try {
      setIsPlaying(true);
      await audioEngine.playInterval(note1, note2, type, octave);
      setIsPlaying(false);
      setError(null);
    } catch (err) {
      setError('Failed to play interval');
      setIsPlaying(false);
      console.error('Interval playback error:', err);
    }
  }, [audioEngine, isInitialized]);

  const playGeometricPattern = useCallback(async (notes: string[], octave?: number) => {
    if (!isInitialized) {
      setError('Audio system not ready');
      return;
    }

    try {
      setIsPlaying(true);
      await audioEngine.playGeometricPattern(notes, octave);
      setIsPlaying(false);
      setError(null);
    } catch (err) {
      setError('Failed to play pattern');
      setIsPlaying(false);
      console.error('Pattern playback error:', err);
    }
  }, [audioEngine, isInitialized]);

  const setVolume = useCallback((volume: number) => {
    if (isInitialized) {
      audioEngine.setVolume(volume);
    }
  }, [audioEngine, isInitialized]);

  const setTempo = useCallback((tempo: number) => {
    if (isInitialized) {
      audioEngine.setTempo(tempo);
    }
  }, [audioEngine, isInitialized]);

  return {
    isPlaying,
    isInitialized,
    error,
    togglePlayback,
    stopPlayback,
    playNote,
    playChord,
    playScale,
    playInterval,
    playGeometricPattern,
    setVolume,
    setTempo
  };
}
