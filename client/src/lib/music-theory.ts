export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10]
};

export const CHORD_TYPES = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10]
};

export interface Note {
  name: string;
  frequency: number;
  octave: number;
}

export function noteToMidi(noteName: string, octave: number = 4): number {
  const noteIndex = NOTES.indexOf(noteName);
  if (noteIndex === -1) throw new Error(`Invalid note: ${noteName}`);
  
  return (octave + 1) * 12 + noteIndex;
}

export function midiToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function getScale(rootNote: string, scaleType: keyof typeof SCALES): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${rootNote}`);
  
  const intervals = SCALES[scaleType];
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
}

export function getChord(rootNote: string, chordType: keyof typeof CHORD_TYPES): string[] {
  const rootIndex = NOTES.indexOf(rootNote);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${rootNote}`);
  
  const intervals = CHORD_TYPES[chordType];
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
}

export function getInterval(note1: string, note2: string): { name: string, semitones: number } {
  const index1 = NOTES.indexOf(note1);
  const index2 = NOTES.indexOf(note2);
  
  if (index1 === -1 || index2 === -1) {
    throw new Error(`Invalid notes: ${note1}, ${note2}`);
  }
  
  const semitones = (index2 - index1 + 12) % 12;
  
  const intervalNames = [
    'Unison', 'Minor 2nd', 'Major 2nd', 'Minor 3rd', 'Major 3rd', 'Perfect 4th',
    'Tritone', 'Perfect 5th', 'Minor 6th', 'Major 6th', 'Minor 7th', 'Major 7th'
  ];
  
  return {
    name: intervalNames[semitones],
    semitones
  };
}

export function getNoteFrequency(noteName: string, octave: number = 4): number {
  const midiNote = noteToMidi(noteName, octave);
  return midiToFrequency(midiNote);
}

export function getEnharmonicEquivalent(note: string, preferSharps: boolean = true): string {
  const enharmonics: { [key: string]: string } = {
    'C#': 'Db',
    'Db': 'C#',
    'D#': 'Eb',
    'Eb': 'D#',
    'F#': 'Gb',
    'Gb': 'F#',
    'G#': 'Ab',
    'Ab': 'G#',
    'A#': 'Bb',
    'Bb': 'A#'
  };
  
  if (note in enharmonics) {
    return preferSharps ? 
      (note.includes('#') ? note : enharmonics[note]) :
      (note.includes('b') ? note : enharmonics[note]);
  }
  
  return note;
}

export function getCircleOfFifthsPosition(note: string): number {
  return CIRCLE_OF_FIFTHS.indexOf(note);
}

export function getRelativeMinor(majorKey: string): string {
  const majorIndex = NOTES.indexOf(majorKey);
  if (majorIndex === -1) throw new Error(`Invalid major key: ${majorKey}`);
  
  const minorIndex = (majorIndex + 9) % 12; // Minor 6th down
  return NOTES[minorIndex];
}

export function getRelativeMajor(minorKey: string): string {
  const minorIndex = NOTES.indexOf(minorKey);
  if (minorIndex === -1) throw new Error(`Invalid minor key: ${minorKey}`);
  
  const majorIndex = (minorIndex + 3) % 12; // Minor 3rd up
  return NOTES[majorIndex];
}
