import { useEffect, useRef } from "react";

interface ScaleVisualizerProps {
  selectedNotes: string[];
  currentMode: string;
  scaleType: 'major' | 'minor';
}

const CIRCLE_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export default function ScaleVisualizer({ selectedNotes, currentMode, scaleType }: ScaleVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const getNotePosition = (index: number) => {
    const angle = (index * 30) - 90; // Start from top (12 o'clock)
    const radian = (angle * Math.PI) / 180;
    const radius = 160;
    const centerX = 200;
    const centerY = 200;
    
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  const drawHandDrawnScalePattern = (svg: SVGSVGElement, rootIndex: number) => {
    // 1. Double green circles around root (exactly like your drawing)
    const rootPos = getNotePosition(rootIndex);
    
    // Outer green circle
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', rootPos.x.toString());
    outerCircle.setAttribute('cy', rootPos.y.toString());
    outerCircle.setAttribute('r', '45');
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', '#22c55e');
    outerCircle.setAttribute('stroke-width', '3');
    outerCircle.classList.add('scale-element');
    svg.appendChild(outerCircle);
    
    // Inner green circle
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', rootPos.x.toString());
    innerCircle.setAttribute('cy', rootPos.y.toString());
    innerCircle.setAttribute('r', '38');
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#22c55e');
    innerCircle.setAttribute('stroke-width', '2');
    innerCircle.classList.add('scale-element');
    svg.appendChild(innerCircle);
    
    // 2. Blue curved line connecting 4th-root-5th (like F-Bb-Eb)
    const fourthIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
    const fifthIndex = (rootIndex + 1) % CIRCLE_NOTES.length;
    
    // Create blue curved path
    const centerX = 200, centerY = 200;
    const radius = 180;
    const startAngle = (fourthIndex * 30 - 90 - 20) * Math.PI / 180;
    const endAngle = (fifthIndex * 30 - 90 + 20) * Math.PI / 180;
    
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    const blueArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathData = `M ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY}`;
    blueArc.setAttribute('d', pathData);
    blueArc.setAttribute('fill', 'none');
    blueArc.setAttribute('stroke', '#3b82f6');
    blueArc.setAttribute('stroke-width', '4');
    blueArc.setAttribute('opacity', '0.8');
    blueArc.classList.add('scale-element');
    svg.appendChild(blueArc);
    
    // 3. Green dotted lines to remaining scale notes
    drawRemainingScaleNotes(svg, rootIndex);
  };
  
  const drawRemainingScaleNotes = (svg: SVGSVGElement, rootIndex: number) => {
    // Calculate major scale notes
    const rootNote = CIRCLE_NOTES[rootIndex];
    const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const enharmonicMap: { [key: string]: string } = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };
    
    const normalizedRoot = enharmonicMap[rootNote] || rootNote;
    const rootChromaticIndex = chromaticNotes.indexOf(normalizedRoot);
    
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
    const scaleNotes = majorScaleIntervals.map(interval => {
      const chromaticIndex = (rootChromaticIndex + interval) % 12;
      return chromaticNotes[chromaticIndex];
    });
    
    // Convert back to circle notation
    const reverseMap: { [key: string]: string } = {
      'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
    };
    
    const displayNotes = scaleNotes.map(note => {
      if (rootNote.includes('b') && reverseMap[note]) {
        return reverseMap[note];
      }
      return note;
    });
    
    // Get the 4th-root-5th group
    const prevIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
    const nextIndex = (rootIndex + 1) % CIRCLE_NOTES.length;
    const neighbors = [CIRCLE_NOTES[prevIndex], rootNote, CIRCLE_NOTES[nextIndex]];
    
    // Find remaining scale notes
    const remainingScaleNotes = displayNotes.filter(note => !neighbors.includes(note));
    
    // Draw green dotted lines to remaining notes
    remainingScaleNotes.forEach(note => {
      let noteIndex = CIRCLE_NOTES.indexOf(note);
      if (noteIndex === -1) {
        const enharmonic = reverseMap[note];
        if (enharmonic) noteIndex = CIRCLE_NOTES.indexOf(enharmonic);
      }
      
      if (noteIndex !== -1) {
        const notePos = getNotePosition(noteIndex);
        
        // Green dotted line from inner area to note
        const centerX = 200, centerY = 200;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (centerX + 60 * Math.cos((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('y1', (centerY + 60 * Math.sin((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('x2', (notePos.x - 25 * Math.cos((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('y2', (notePos.y - 25 * Math.sin((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('stroke', '#22c55e');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '6,4');
        line.setAttribute('opacity', '0.7');
        line.classList.add('scale-element');
        svg.appendChild(line);
      }
    });
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    
    // Clear existing scale visualizations
    const existingElements = svg.querySelectorAll('.scale-element');
    existingElements.forEach(element => element.remove());

    // Only show scale visualizations in scales mode
    if (currentMode !== 'scales' || selectedNotes.length === 0) return;

    const rootNote = selectedNotes[0];
    const rootIndex = CIRCLE_NOTES.indexOf(rootNote);
    
    if (rootIndex === -1) return;

    // Draw pattern like your hand-drawn picture
    drawHandDrawnScalePattern(svg, rootIndex);

  }, [selectedNotes, currentMode, scaleType]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 400 400"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}