import { useState } from "react";
import CircleOfFifths from "@/components/circle-of-fifths/CircleOfFifths";
import ControlPanel from "@/components/circle-of-fifths/ControlPanel";
import { useAudio } from "@/hooks/use-audio";

export type Mode = 'scales' | 'intervals' | 'chords' | 'modes' | 'random' | 'cadences';
export type ScaleType = 'major' | 'minor';
export type PlaybackDirection = 'clockwise' | 'counterclockwise';
export type IntervalType = 'harmonic' | 'melodic';
export type GeometricShape = 'triangle' | 'square' | 'diamond' | 'hexagon';

export interface AppState {
  currentMode: Mode;
  selectedNotes: string[];
  scaleType: ScaleType;
  playbackDirection: PlaybackDirection;
  intervalType: IntervalType;
  activeShape: GeometricShape | null;
  drawingMode: boolean;
  volume: number;
  tempo: number;
}

export default function CircleOfFifthsPage() {
  const [state, setState] = useState<AppState>({
    currentMode: 'scales',
    selectedNotes: [],
    scaleType: 'major',
    playbackDirection: 'clockwise',
    intervalType: 'harmonic',
    activeShape: null,
    drawingMode: false,
    volume: 75,
    tempo: 120,
  });

  const [showHelp, setShowHelp] = useState(false);
  const { isPlaying, togglePlayback, stopPlayback, isInitialized, error } = useAudio();

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const switchMode = (mode: Mode) => {
    updateState({ 
      currentMode: mode, 
      selectedNotes: [], 
      drawingMode: false, 
      activeShape: null 
    });
  };

  const selectNote = (note: string) => {
    const { currentMode, selectedNotes } = state;
    
    if (selectedNotes.includes(note)) {
      // Deselect the note
      updateState({
        selectedNotes: selectedNotes.filter(n => n !== note)
      });
    } else {
      let newSelection = [...selectedNotes];
      
      // Mode-specific selection limits
      if (currentMode === 'scales') {
        newSelection = [note]; // Only one note allowed for scales mode
      } else if (currentMode === 'intervals' && selectedNotes.length >= 2) {
        return; // Max 2 notes for intervals
      } else {
        newSelection.push(note);
      }
      
      updateState({ selectedNotes: newSelection });
    }
  };

  const clearSelection = () => {
    updateState({ selectedNotes: [] });
  };

  const toggleShapeDrawing = (shape: GeometricShape) => {
    const isCurrentlyActive = state.activeShape === shape && state.drawingMode;
    updateState({
      activeShape: isCurrentlyActive ? null : shape,
      drawingMode: !isCurrentlyActive
    });
  };

  return (
    <div className="font-inter bg-neutral-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                <i className="fas fa-music text-sm"></i>
              </div>
              <h1 className="text-xl font-semibold text-neutral-900">Circle of Fifths Visualizer</h1>
            </div>
            
            {/* Mode Selector */}
            <nav className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
              {(['scales', 'intervals', 'chords', 'modes', 'random', 'cadences'] as Mode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => switchMode(mode)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    state.currentMode === mode
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel
              state={state}
              updateState={updateState}
              toggleShapeDrawing={toggleShapeDrawing}
              clearSelection={clearSelection}
              isPlaying={isPlaying}
              togglePlayback={togglePlayback}
              stopPlayback={stopPlayback}
              isAudioInitialized={isInitialized}
              audioError={error}
            />
          </div>

          {/* Circle of Fifths */}
          <div className="lg:col-span-3">
            <CircleOfFifths
              state={state}
              selectNote={selectNote}
            />
          </div>

        </div>

        {/* Help Panel */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="bg-white shadow-lg border border-neutral-200 rounded-full w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-primary transition-colors"
          >
            <i className="fas fa-keyboard text-sm"></i>
          </button>
          
          {showHelp && (
            <div className="absolute bottom-16 right-0 bg-white shadow-xl border border-neutral-200 rounded-lg p-4 w-80">
              <h4 className="font-semibold text-neutral-900 mb-3">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Switch to Scales mode</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">1</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Switch to Intervals mode</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">2</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Switch to Chords mode</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">3</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Play/Pause</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Clear selection</span>
                  <kbd className="px-2 py-1 bg-neutral-100 rounded text-xs">Esc</kbd>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
