import { useState, useEffect, useCallback } from 'react';
import { getAudioEngine } from '@/lib/audio-engine';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioEngine = getAudioEngine();

  // Initialize audio only when first needed (user interaction)
  const initializeAudioIfNeeded = useCallback(async () => {
    if (isInitialized) return true;
    
    try {
      await audioEngine.initialize();
      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to initialize audio system. Click to try again.');
      console.error('Audio initialization error:', err);
      return false;
    }
  }, [audioEngine, isInitialized]);

  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, [audioEngine]);

  const togglePlayback = useCallback(async () => {
    const initialized = await initializeAudioIfNeeded();
    if (!initialized) return;

    setIsPlaying(prev => {
      if (prev) {
        audioEngine.stop();
      }
      return !prev;
    });
  }, [audioEngine, initializeAudioIfNeeded]);

  const stopPlayback = useCallback(() => {
    audioEngine.stop();
    setIsPlaying(false);
  }, [audioEngine]);

  const playNote = useCallback(async (note: string, duration?: string, octave?: number) => {
    const initialized = await initializeAudioIfNeeded();
    if (!initialized) return;

    try {
      audioEngine.playNote(note, duration, octave);
      setError(null);
    } catch (err) {
      setError('Failed to play note');
      console.error('Note playback error:', err);
    }
  }, [audioEngine, initializeAudioIfNeeded]);

  const playChord = useCallback(async (notes: string[], duration?: string, octave?: number) => {
    const initialized = await initializeAudioIfNeeded();
    if (!initialized) return;

    try {
      audioEngine.playChord(notes, duration, octave);
      setError(null);
    } catch (err) {
      setError('Failed to play chord');
      console.error('Chord playback error:', err);
    }
  }, [audioEngine, initializeAudioIfNeeded]);

  const playScale = useCallback(async (
    rootNote: string,
    scaleType: 'major' | 'minor',
    direction?: 'clockwise' | 'counterclockwise',
    octave?: number
  ) => {
    const initialized = await initializeAudioIfNeeded();
    if (!initialized) return;

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
  }, [audioEngine, initializeAudioIfNeeded]);

  const playInterval = useCallback(async (
    note1: string,
    note2: string,
    type?: 'harmonic' | 'melodic',
    octave?: number
  ) => {
    const initialized = await initializeAudioIfNeeded();
    if (!initialized) return;

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
  }, [audioEngine, initializeAudioIfNeeded]);

  const playGeometricPattern = useCallback(async (notes: string[], octave?: number) => {
    const initialized = await initializeAudioIfNeeded();
    if (!initialized) return;

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
  }, [audioEngine, initializeAudioIfNeeded]);

  const setVolume = useCallback(async (volume: number) => {
    const initialized = await initializeAudioIfNeeded();
    if (initialized) {
      audioEngine.setVolume(volume);
    }
  }, [audioEngine, initializeAudioIfNeeded]);

  const setTempo = useCallback(async (tempo: number) => {
    const initialized = await initializeAudioIfNeeded();
    if (initialized) {
      audioEngine.setTempo(tempo);
    }
  }, [audioEngine, initializeAudioIfNeeded]);

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
