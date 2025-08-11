import { AppState, Mode, ScaleType, PlaybackDirection, IntervalType, GeometricShape } from "@/pages/circle-of-fifths";

interface ControlPanelProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  toggleShapeDrawing: (shape: GeometricShape) => void;
  clearSelection: () => void;
  isPlaying: boolean;
  togglePlayback: () => void;
  stopPlayback: () => void;
  isAudioInitialized: boolean;
  audioError: string | null;
}

export default function ControlPanel({
  state,
  updateState,
  toggleShapeDrawing,
  clearSelection,
  isPlaying,
  togglePlayback,
  stopPlayback,
  isAudioInitialized,
  audioError
}: ControlPanelProps) {
  const { currentMode, scaleType, playbackDirection, intervalType, activeShape, volume, tempo } = state;

  const switchScaleType = (type: ScaleType) => {
    updateState({ scaleType: type });
  };

  const switchDirection = (direction: PlaybackDirection) => {
    updateState({ playbackDirection: direction });
  };

  const switchIntervalType = (type: IntervalType) => {
    updateState({ intervalType: type });
  };

  const handleVolumeChange = (value: number) => {
    updateState({ volume: value });
  };

  const handleTempoChange = (value: number) => {
    updateState({ tempo: value });
  };

  const getIntervalDisplay = () => {
    if (state.selectedNotes.length === 2) {
      return `${state.selectedNotes[0]} to ${state.selectedNotes[1]}`;
    }
    return "Click two notes to create an interval";
  };

  const getChordDisplay = () => {
    if (state.selectedNotes.length > 0) {
      return `${state.selectedNotes[0]} chord`;
    }
    return "No chord selected";
  };

  return (
    <div className="space-y-6">
      
      {/* Audio Status Indicator */}
      {!isAudioInitialized && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-amber-800">
              {audioError ? audioError : "Click any button to enable audio playback"}
            </span>
          </div>
        </div>
      )}
      
      {/* Scale Settings (Scales Mode) */}
      {currentMode === 'scales' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Scale Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Scale Type</label>
              <div className="flex space-x-2">
                {(['major', 'minor'] as ScaleType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => switchScaleType(type)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      scaleType === type
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Playback Direction</label>
              <div className="flex space-x-2">
                {([
                  { value: 'clockwise', icon: 'fa-arrow-rotate-right', label: 'Clockwise' },
                  { value: 'counterclockwise', icon: 'fa-arrow-rotate-left', label: 'Counter' }
                ] as const).map(({ value, icon, label }) => (
                  <button
                    key={value}
                    onClick={() => switchDirection(value)}
                    className={`px-3 py-2 text-sm rounded-md flex items-center space-x-2 transition-colors ${
                      playbackDirection === value
                        ? 'bg-secondary text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <i className={`fas ${icon} text-xs`}></i>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interval Controls (Intervals Mode) */}
      {currentMode === 'intervals' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Interval Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Playback Type</label>
              <div className="flex space-x-2">
                {(['harmonic', 'melodic'] as IntervalType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => switchIntervalType(type)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      intervalType === type
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Selected Interval</label>
              <div className="text-sm text-neutral-600">
                {getIntervalDisplay()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chord Controls (Chords Mode) */}
      {currentMode === 'chords' && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Chord Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Chord Type</label>
              <select className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Major Triad</option>
                <option>Minor Triad</option>
                <option>Diminished</option>
                <option>Augmented</option>
                <option>Major 7th</option>
                <option>Minor 7th</option>
                <option>Dominant 7th</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-neutral-700 mb-2 block">Current Chord</label>
              <div className="text-sm text-neutral-600">
                {getChordDisplay()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawing Tools */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Geometric Shapes</h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {([
              { shape: 'triangle', icon: 'fa-play', label: 'Triangle' },
              { shape: 'square', icon: 'far fa-square', label: 'Square' },
              { shape: 'diamond', icon: 'far fa-gem', label: 'Diamond' },
              { shape: 'hexagon', icon: 'fa-stop', label: 'Hexagon' }
            ] as const).map(({ shape, icon, label }) => (
              <button
                key={shape}
                onClick={() => toggleShapeDrawing(shape)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeShape === shape
                    ? 'bg-secondary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <i className={`${icon} text-xs mb-1 block`}></i>
                <div>{label}</div>
              </button>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <button
              onClick={clearSelection}
              className="w-full px-3 py-2 text-sm font-medium bg-neutral-100 text-neutral-600 rounded-md hover:bg-neutral-200 transition-colors"
            >
              <i className="fas fa-eraser text-xs mr-2"></i>
              Clear Shapes
            </button>
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Audio Controls</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Volume</span>
            <div className="flex items-center space-x-2">
              <i className="fas fa-volume-down text-neutral-400"></i>
              <input
                type="range"
                className="w-20 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              />
              <i className="fas fa-volume-up text-neutral-400"></i>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Tempo</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-500">60</span>
              <input
                type="range"
                className="w-20 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                min="60"
                max="200"
                value={tempo}
                onChange={(e) => handleTempoChange(parseInt(e.target.value))}
              />
              <span className="text-xs text-neutral-500">200</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={togglePlayback}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isPlaying
                  ? 'bg-secondary text-white hover:bg-secondary/90'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-xs mr-2`}></i>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={stopPlayback}
              className="px-3 py-2 text-sm font-medium bg-neutral-100 text-neutral-600 rounded-md hover:bg-neutral-200 transition-colors"
            >
              <i className="fas fa-stop text-xs"></i>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
