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

    // Draw double circle around root note
    drawDoubleCircleAroundRoot(svg, rootIndex);

    // Get neighboring notes (previous and next in circle of fifths)
    const prevIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
    const nextIndex = (rootIndex + 1) % CIRCLE_NOTES.length;

    // Draw arc connecting the three notes
    drawScaleArc(svg, [prevIndex, rootIndex, nextIndex]);

    // Draw dotted arc for remaining notes
    drawRemainingNotesArc(svg, rootIndex);

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

  const drawDoubleCircleAroundRoot = (svg: SVGSVGElement, rootIndex: number) => {
    const position = getNotePosition(rootIndex);
    
    // Outer circle
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', position.x.toString());
    outerCircle.setAttribute('cy', position.y.toString());
    outerCircle.setAttribute('r', '40');
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', '#f97316');
    outerCircle.setAttribute('stroke-width', '3');
    outerCircle.setAttribute('opacity', '0.8');
    outerCircle.classList.add('scale-element');
    svg.appendChild(outerCircle);

    // Inner circle
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', position.x.toString());
    innerCircle.setAttribute('cy', position.y.toString());
    innerCircle.setAttribute('r', '35');
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', '#f97316');
    innerCircle.setAttribute('stroke-width', '2');
    innerCircle.setAttribute('opacity', '0.6');
    innerCircle.classList.add('scale-element');
    svg.appendChild(innerCircle);
  };

  const drawScaleArc = (svg: SVGSVGElement, noteIndices: number[]) => {
    if (noteIndices.length !== 3) return;

    const positions = noteIndices.map(index => getNotePosition(index));
    
    // Create a smooth arc path connecting the three notes
    const pathData = `M ${positions[0].x},${positions[0].y} Q ${positions[1].x},${positions[1].y} ${positions[2].x},${positions[2].y}`;
    
    const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arcPath.setAttribute('d', pathData);
    arcPath.setAttribute('fill', 'none');
    arcPath.setAttribute('stroke', '#16a34a');
    arcPath.setAttribute('stroke-width', '4');
    arcPath.setAttribute('opacity', '0.7');
    arcPath.setAttribute('stroke-linecap', 'round');
    arcPath.classList.add('scale-element');
    svg.appendChild(arcPath);

    // Add small circles at connection points
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
    // For Bb major example: remaining notes are C G D A (indices 0, 1, 2, 3)
    // These are all notes EXCEPT the root (Bb = index 10) and its neighbors (F = 11, Eb = 9)
    const remainingIndices = [];
    
    for (let i = 0; i < CIRCLE_NOTES.length; i++) {
      // Skip the root and its immediate neighbors
      const prevIndex = (rootIndex - 1 + CIRCLE_NOTES.length) % CIRCLE_NOTES.length;
      const nextIndex = (rootIndex + 1) % CIRCLE_NOTES.length;
      
      if (i !== rootIndex && i !== prevIndex && i !== nextIndex) {
        remainingIndices.push(i);
      }
    }

    if (remainingIndices.length === 0) return;

    // Sort indices to create a smooth arc
    remainingIndices.sort((a, b) => a - b);
    
    const positions = remainingIndices.map(index => getNotePosition(index));
    
    // Create curved path through these points
    if (positions.length > 1) {
      let pathData = `M ${positions[0].x},${positions[0].y}`;
      
      for (let i = 1; i < positions.length; i++) {
        pathData += ` L ${positions[i].x},${positions[i].y}`;
      }
      
      const dottedArcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      dottedArcPath.setAttribute('d', pathData);
      dottedArcPath.setAttribute('fill', 'none');
      dottedArcPath.setAttribute('stroke', '#dc2626');
      dottedArcPath.setAttribute('stroke-width', '3');
      dottedArcPath.setAttribute('stroke-dasharray', '8,4');
      dottedArcPath.setAttribute('opacity', '0.6');
      dottedArcPath.setAttribute('stroke-linecap', 'round');
      dottedArcPath.classList.add('scale-element');
      svg.appendChild(dottedArcPath);
    }

    // Add small dotted circles at these positions
    positions.forEach((position) => {
      const dottedCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dottedCircle.setAttribute('cx', position.x.toString());
      dottedCircle.setAttribute('cy', position.y.toString());
      dottedCircle.setAttribute('r', '4');
      dottedCircle.setAttribute('fill', 'none');
      dottedCircle.setAttribute('stroke', '#dc2626');
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 400"
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