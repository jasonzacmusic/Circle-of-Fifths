import * as Tone from 'tone';
import { getNoteFrequency, getScale, getChord, getInterval } from './music-theory';

export class AudioEngine {
  private synth: Tone.PolySynth;
  private volume: Tone.Volume;
  private isInitialized: boolean = false;

  constructor() {
    this.volume = new Tone.Volume(-12);
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    }).chain(this.volume, Tone.Destination);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await Tone.start();
      this.isInitialized = true;
      console.log('Audio engine initialized');
    } catch (error) {
      console.error('Failed to initialize audio engine:', error);
      throw error;
    }
  }

  setVolume(volume: number): void {
    // Convert 0-100 to decibels (-60 to 0)
    const db = volume === 0 ? -Infinity : -60 + (volume / 100) * 60;
    this.volume.volume.value = db;
  }

  setTempo(bpm: number): void {
    Tone.Transport.bpm.value = bpm;
  }

  playNote(note: string, duration: string = "8n", octave: number = 4): void {
    if (!this.isInitialized) {
      console.warn('Audio engine not initialized');
      return;
    }

    try {
      const frequency = getNoteFrequency(note, octave);
      this.synth.triggerAttackRelease(frequency, duration);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  playChord(notes: string[], duration: string = "2n", octave: number = 4): void {
    if (!this.isInitialized) {
      console.warn('Audio engine not initialized');
      return;
    }

    try {
      const frequencies = notes.map(note => getNoteFrequency(note, octave));
      this.synth.triggerAttackRelease(frequencies, duration);
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }

  playScale(
    rootNote: string, 
    scaleType: 'major' | 'minor',
    direction: 'clockwise' | 'counterclockwise' = 'clockwise',
    octave: number = 4
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isInitialized) {
        console.warn('Audio engine not initialized');
        resolve();
        return;
      }

      try {
        const scale = getScale(rootNote, scaleType);
        const notesToPlay = direction === 'counterclockwise' ? [...scale].reverse() : scale;
        
        let index = 0;
        const playNext = () => {
          if (index < notesToPlay.length) {
            this.playNote(notesToPlay[index], "4n", octave);
            index++;
            setTimeout(playNext, 300); // 300ms between notes
          } else {
            resolve();
          }
        };

        playNext();
      } catch (error) {
        console.error('Error playing scale:', error);
        resolve();
      }
    });
  }

  playInterval(
    note1: string, 
    note2: string, 
    type: 'harmonic' | 'melodic' = 'harmonic',
    octave: number = 4
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isInitialized) {
        console.warn('Audio engine not initialized');
        resolve();
        return;
      }

      try {
        if (type === 'harmonic') {
          // Play both notes simultaneously
          this.playChord([note1, note2], "2n", octave);
          setTimeout(resolve, 2000);
        } else {
          // Play notes in sequence
          this.playNote(note1, "4n", octave);
          setTimeout(() => {
            this.playNote(note2, "4n", octave);
            setTimeout(resolve, 500);
          }, 500);
        }
      } catch (error) {
        console.error('Error playing interval:', error);
        resolve();
      }
    });
  }

  playArpeggio(notes: string[], octave: number = 4): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isInitialized) {
        console.warn('Audio engine not initialized');
        resolve();
        return;
      }

      try {
        let index = 0;
        const playNext = () => {
          if (index < notes.length) {
            this.playNote(notes[index], "8n", octave);
            index++;
            setTimeout(playNext, 200);
          } else {
            resolve();
          }
        };

        playNext();
      } catch (error) {
        console.error('Error playing arpeggio:', error);
        resolve();
      }
    });
  }

  playGeometricPattern(notes: string[], octave: number = 4): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isInitialized) {
        console.warn('Audio engine not initialized');
        resolve();
        return;
      }

      try {
        // Play as a chord first, then as an arpeggio
        this.playChord(notes, "1n", octave);
        
        setTimeout(() => {
          this.playArpeggio(notes, octave).then(resolve);
        }, 1500);
      } catch (error) {
        console.error('Error playing geometric pattern:', error);
        resolve();
      }
    });
  }

  stop(): void {
    if (this.isInitialized) {
      Tone.Transport.stop();
      this.synth.releaseAll();
    }
  }

  dispose(): void {
    if (this.isInitialized) {
      this.synth.dispose();
      this.volume.dispose();
      this.isInitialized = false;
    }
  }
}

// Singleton instance
let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine();
  }
  return audioEngineInstance;
}
