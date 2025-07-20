import { useEffect } from "react";
import { AppState } from "@/pages/circle-of-fifths";
import GeometricShapeDrawer from "./GeometricShapeDrawer";
import ScaleVisualizer from "./ScaleVisualizer";

interface CircleOfFifthsProps {
  state: AppState;
  selectNote: (note: string) => void;
}

const CIRCLE_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const NOTE_POSITIONS = [
  { left: '50%', top: '0%', transform: 'translate(-50%, -50%)' },      // C - 12 o'clock
  { left: '75%', top: '6.7%', transform: 'translate(-50%, -50%)' },   // G - 1 o'clock
  { left: '93.3%', top: '25%', transform: 'translate(-50%, -50%)' },  // D - 2 o'clock
  { left: '100%', top: '50%', transform: 'translate(-50%, -50%)' },   // A - 3 o'clock
  { left: '93.3%', top: '75%', transform: 'translate(-50%, -50%)' },  // E - 4 o'clock
  { left: '75%', top: '93.3%', transform: 'translate(-50%, -50%)' },  // B - 5 o'clock
  { left: '50%', top: '100%', transform: 'translate(-50%, -50%)' },   // F# - 6 o'clock
  { left: '25%', top: '93.3%', transform: 'translate(-50%, -50%)' },  // Db - 7 o'clock
  { left: '6.7%', top: '75%', transform: 'translate(-50%, -50%)' },   // Ab - 8 o'clock
  { left: '0%', top: '50%', transform: 'translate(-50%, -50%)' },     // Eb - 9 o'clock
  { left: '6.7%', top: '25%', transform: 'translate(-50%, -50%)' },   // Bb - 10 o'clock
  { left: '25%', top: '6.7%', transform: 'translate(-50%, -50%)' },   // F - 11 o'clock
];

export default function CircleOfFifths({ state, selectNote }: CircleOfFifthsProps) {
  const { selectedNotes, scaleType, currentMode } = state;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Clear selection handled in parent
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  const getNoteLabel = (note: string) => {
    // Handle enharmonic equivalents based on scale type
    if (scaleType === 'minor') {
      // Minor scale spelling: F# C# G# D# Bb
      switch (note) {
        case 'Db': return 'C#';
        case 'Ab': return 'G#';
        case 'Eb': return 'D#';
        default: return note;
      }
    }
    return note; // Major scale spelling: F# Db Ab Eb Bb
  };

  const isNoteSelected = (note: string) => {
    return selectedNotes.includes(note);
  };

  const getKeySignature = () => {
    if (selectedNotes.length > 0) {
      const rootNote = selectedNotes[0];
      return `${rootNote} ${scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}`;
    }
    return `C ${scaleType.charAt(0).toUpperCase() + scaleType.slice(1)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
      <div className="relative w-full aspect-square max-w-2xl mx-auto">
        {/* Circle container */}
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200">
          
          {/* SVG for scale visualization */}
          <ScaleVisualizer
            selectedNotes={selectedNotes}
            currentMode={currentMode}
            scaleType={scaleType}
          />

          {/* SVG for geometric shapes */}
          <GeometricShapeDrawer
            selectedNotes={selectedNotes}
            activeShape={state.activeShape}
            drawingMode={state.drawingMode}
          />

          {/* Note positions */}
          {CIRCLE_NOTES.map((note, index) => {
            const position = NOTE_POSITIONS[index];
            const isSelected = isNoteSelected(note);
            const displayNote = getNoteLabel(note);

            return (
              <div
                key={note}
                className="note-position absolute w-16 h-16 -ml-8 -mt-8 cursor-pointer transition-all duration-200 hover:scale-110"
                style={position}
                onClick={() => selectNote(note)}
              >
                <div
                  className={`w-full h-full rounded-full flex items-center justify-center shadow-sm transition-all ${
                    isSelected
                      ? 'border-3 border-primary bg-primary text-white shadow-lg'
                      : 'bg-white border-2 border-neutral-300 text-neutral-700 hover:border-primary hover:shadow-md hover:scale-105'
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-neutral-700'
                    }`}
                  >
                    {displayNote}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-neutral-500 font-medium">Circle of</div>
              <div className="text-sm font-semibold text-neutral-700">Fifths</div>
            </div>
          </div>

        </div>
      </div>

      {/* Status and Information Panel */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-neutral-700">Selected Notes:</span>
            <span className="ml-2 text-neutral-600">
              {selectedNotes.length > 0 ? selectedNotes.join(', ') : 'None'}
            </span>
          </div>
          <div>
            <span className="font-medium text-neutral-700">Current Mode:</span>
            <span className="ml-2 text-primary font-medium">
              {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}
            </span>
          </div>
          <div>
            <span className="font-medium text-neutral-700">Key Signature:</span>
            <span className="ml-2 text-neutral-600">{getKeySignature()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
