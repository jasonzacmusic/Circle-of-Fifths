import { useEffect, useRef } from "react";

interface ScaleVisualizerProps {
  selectedNotes: string[];
  currentMode: string;
  scaleType: 'major' | 'minor';
}

const CIRCLE_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export default function ScaleVisualizer({ selectedNotes, currentMode, scaleType }: ScaleVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

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

    // Draw exactly like the hand-drawn picture
    drawHandDrawnScalePattern(svg, rootIndex);

  }, [selectedNotes, currentMode, scaleType]);

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
    // Draw the pattern exactly like the hand-drawn picture
    
    // 1. Double green circles around root (like Bb in the drawing)
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
    
    // 2. Blue curved line connecting 4th-root-5th (like F-Bb-Eb in drawing)
    const fourthIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
    const fifthIndex = (rootIndex + 1) % CIRCLE_NOTES.length;
    
    const fourthPos = getNotePosition(fourthIndex);
    const fifthPos = getNotePosition(fifthIndex);
    
    // Create blue curved path connecting the three notes
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
    
    // 3. Green dotted arcs for remaining scale notes
    drawRemainingScaleNotes(svg, rootIndex);
  };
  
  const drawRemainingScaleNotes = (svg: SVGSVGElement, rootIndex: number) => {
    // Get all major scale notes
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
    
    // Convert back to circle of fifths notation
    const reverseMap: { [key: string]: string } = {
      'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
    };
    
    const displayNotes = scaleNotes.map(note => {
      if (rootNote.includes('b') && reverseMap[note]) {
        return reverseMap[note];
      }
      return note;
    });
    
    // Get neighbors in circle of fifths  
    const prevIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
    const nextIndex = (rootIndex + 1) % CIRCLE_NOTES.length;
    const neighbors = [CIRCLE_NOTES[prevIndex], rootNote, CIRCLE_NOTES[nextIndex]];
    
    // Find remaining scale notes (excluding the 4th-root-5th group)
    const remainingScaleNotes = displayNotes.filter(note => !neighbors.includes(note));
    
    // Draw green dotted arcs to remaining notes
    remainingScaleNotes.forEach(note => {
      let noteIndex = CIRCLE_NOTES.indexOf(note);
      if (noteIndex === -1) {
        const enharmonic = reverseMap[note];
        if (enharmonic) noteIndex = CIRCLE_NOTES.indexOf(enharmonic);
      }
      
      if (noteIndex !== -1) {
        const notePos = getNotePosition(noteIndex);
        
        // Draw green dotted line from center area to this note
        const centerX = 200, centerY = 200;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (centerX + 50 * Math.cos((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('y1', (centerY + 50 * Math.sin((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('x2', (notePos.x - 20 * Math.cos((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('y2', (notePos.y - 20 * Math.sin((noteIndex * 30 - 90) * Math.PI / 180)).toString());
        line.setAttribute('stroke', '#22c55e');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '6,4');
        line.setAttribute('opacity', '0.7');
        line.classList.add('scale-element');
        svg.appendChild(line);
      }
    });
  };

  const drawDoubleCircleAroundRoot = (svg: SVGSVGElement, rootIndex: number) => {
    const position = getNotePosition(rootIndex);
    
    // Outer GREEN circle - like in the drawing
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', position.x.toString());
    outerCircle.setAttribute('cy', position.y.toString());
    outerCircle.setAttribute('r', '45');
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', '#16a34a');
    outerCircle.setAttribute('stroke-width', '4');
    outerCircle.setAttribute('opacity', '0.9');
    outerCircle.classList.add('scale-element');
    svg.appendChild(outerCircle);

    // Inner GREEN circle
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', position.x.toString());
    innerCircle.setAttribute('cy', position.y.toString());
    innerCircle.setAttribute('r', '38');
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#16a34a');
    innerCircle.setAttribute('stroke-width', '3');
    innerCircle.setAttribute('opacity', '0.7');
    innerCircle.classList.add('scale-element');
    svg.appendChild(innerCircle);
  };

  const drawScaleArc = (svg: SVGSVGElement, noteIndices: number[]) => {
    if (noteIndices.length !== 3) return;

    const positions = noteIndices.map(index => getNotePosition(index));
    const centerX = 200, centerY = 200;
    
    // Create a curved arc around the three notes (root + neighbors)
    // Calculate the arc that encompasses these three points
    const radius = 180; // Slightly larger than note positions
    const avgAngle = noteIndices.reduce((sum, index) => sum + (index * 30 - 90), 0) / 3;
    const startAngle = (noteIndices[0] * 30 - 90 - 20) * Math.PI / 180;
    const endAngle = (noteIndices[2] * 30 - 90 + 20) * Math.PI / 180;
    
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    // Create curved path
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const pathData = `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`;
    
    const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arcPath.setAttribute('d', pathData);
    arcPath.setAttribute('fill', 'none');
    arcPath.setAttribute('stroke', '#2563eb'); // BLUE like in the drawing
    arcPath.setAttribute('stroke-width', '4');
    arcPath.setAttribute('opacity', '0.8');
    arcPath.setAttribute('stroke-linecap', 'round');
    arcPath.classList.add('scale-element');
    svg.appendChild(arcPath);

    // Add small circles at note positions
    positions.forEach((position, index) => {
      const connectionCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      connectionCircle.setAttribute('cx', position.x.toString());
      connectionCircle.setAttribute('cy', position.y.toString());
      connectionCircle.setAttribute('r', index === 1 ? '6' : '4'); // Larger circle for root
      connectionCircle.setAttribute('fill', index === 1 ? '#f97316' : '#16a34a');
      connectionCircle.setAttribute('opacity', '0.9');
      connectionCircle.classList.add('scale-element');
      svg.appendChild(connectionCircle);
    });
  };

  const drawRemainingNotesArc = (svg: SVGSVGElement, rootIndex: number) => {
    const rootNote = CIRCLE_NOTES[rootIndex];
    
    // Calculate the major scale notes for the selected root
    // Major scale intervals: W-W-H-W-W-W-H (2-2-1-2-2-2-1 semitones)
    const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11]; // Root, 2nd, 3rd, 4th, 5th, 6th, 7th
    
    // Convert root note to chromatic index
    const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const enharmonicMap: { [key: string]: string } = {
      'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
    };
    
    const normalizedRoot = enharmonicMap[rootNote] || rootNote;
    const rootChromaticIndex = chromaticNotes.indexOf(normalizedRoot);
    
    // Get all major scale notes
    const scaleNotes = majorScaleIntervals.map(interval => {
      const chromaticIndex = (rootChromaticIndex + interval) % 12;
      return chromaticNotes[chromaticIndex];
    });
    
    // Get the neighbors in circle of fifths
    const prevIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
    const nextIndex = (rootIndex + 1) % CIRCLE_NOTES.length;
    const neighbors = [CIRCLE_NOTES[prevIndex], rootNote, CIRCLE_NOTES[nextIndex]];
    
    // Find remaining scale notes (excluding root and its circle-of-fifths neighbors)
    const remainingScaleNotes = scaleNotes.filter(note => !neighbors.includes(note));
    
    // Map back to circle indices, handling enharmonics
    const remainingIndices = remainingScaleNotes.map(note => {
      let index = CIRCLE_NOTES.indexOf(note);
      if (index === -1) {
        // Try enharmonic equivalent
        const reverseMap: { [key: string]: string } = {
          'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
        };
        const enharmonic = reverseMap[note];
        if (enharmonic) {
          index = CIRCLE_NOTES.indexOf(enharmonic);
        }
      }
      return index;
    }).filter(index => index !== -1);
    
    if (remainingIndices.length === 0) return;

    // Sort indices to create a smooth arc
    remainingIndices.sort((a, b) => a - b);
    
    const centerX = 200, centerY = 200;
    const radius = 190; // Larger radius than the main grouping
    
    // Calculate start and end angles for the arc
    const angles = remainingIndices.map(index => index * 30 - 90); // Convert to degrees
    const startAngle = (angles[0] - 15) * Math.PI / 180; // Add padding
    const endAngle = (angles[angles.length - 1] + 15) * Math.PI / 180;
    
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    
    // Create curved dotted arc
    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
    const pathData = `M ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY}`;
    
    const dottedArcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    dottedArcPath.setAttribute('d', pathData);
    dottedArcPath.setAttribute('fill', 'none');
    dottedArcPath.setAttribute('stroke', '#16a34a'); // GREEN like in the drawing
    dottedArcPath.setAttribute('stroke-width', '3');
    dottedArcPath.setAttribute('stroke-dasharray', '8,4');
    dottedArcPath.setAttribute('opacity', '0.7');
    dottedArcPath.setAttribute('stroke-linecap', 'round');
    dottedArcPath.classList.add('scale-element');
    svg.appendChild(dottedArcPath);

    // Add small dotted circles at note positions - GREEN
    remainingIndices.forEach((index) => {
      const position = getNotePosition(index);
      const dottedCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dottedCircle.setAttribute('cx', position.x.toString());
      dottedCircle.setAttribute('cy', position.y.toString());
      dottedCircle.setAttribute('r', '4');
      dottedCircle.setAttribute('fill', 'none');
      dottedCircle.setAttribute('stroke', '#16a34a'); // GREEN like in the drawing
      dottedCircle.setAttribute('stroke-width', '2');
      dottedCircle.setAttribute('stroke-dasharray', '4,2');
      dottedCircle.setAttribute('opacity', '0.8');
      dottedCircle.classList.add('scale-element');
      svg.appendChild(dottedCircle);
    });
  };

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