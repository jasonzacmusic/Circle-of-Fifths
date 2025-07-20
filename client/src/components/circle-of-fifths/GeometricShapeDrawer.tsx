import { useEffect, useRef } from "react";
import { GeometricShape } from "@/pages/circle-of-fifths";

interface GeometricShapeDrawerProps {
  selectedNotes: string[];
  activeShape: GeometricShape | null;
  drawingMode: boolean;
}

const CIRCLE_NOTES = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

export default function GeometricShapeDrawer({ selectedNotes, activeShape, drawingMode }: GeometricShapeDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    
    // Clear existing shapes except defs
    const existingShapes = svg.querySelectorAll('line, polygon, circle:not(defs circle)');
    existingShapes.forEach(shape => shape.remove());

    if (selectedNotes.length < 3 || !activeShape || !drawingMode) return;

    // Calculate positions for selected notes
    const positions = selectedNotes.map(note => {
      const index = CIRCLE_NOTES.indexOf(note);
      const angle = (index * 30) - 90; // Start from top (12 o'clock)
      const radian = (angle * Math.PI) / 180;
      const radius = 160; // Adjusted for circle size
      const centerX = 200; // Half of SVG viewBox width
      const centerY = 200; // Half of SVG viewBox height
      
      return {
        x: centerX + radius * Math.cos(radian),
        y: centerY + radius * Math.sin(radian),
        note
      };
    });

    // Draw shape based on type
    switch (activeShape) {
      case 'triangle':
        if (positions.length >= 3) {
          drawTriangle(svg, positions.slice(0, 3));
        }
        break;
      case 'square':
        if (positions.length >= 4) {
          drawSquare(svg, positions.slice(0, 4));
        }
        break;
      case 'diamond':
        if (positions.length >= 4) {
          drawDiamond(svg, positions.slice(0, 4));
        }
        break;
      case 'hexagon':
        if (positions.length >= 6) {
          drawHexagon(svg, positions.slice(0, 6));
        }
        break;
    }
  }, [selectedNotes, activeShape, drawingMode]);

  const drawTriangle = (svg: SVGSVGElement, positions: Array<{x: number, y: number, note: string}>) => {
    const points = positions.map(p => `${p.x},${p.y}`).join(' ');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', 'none');
    polygon.setAttribute('stroke', '#f97316');
    polygon.setAttribute('stroke-width', '2');
    polygon.setAttribute('opacity', '0.7');
    svg.appendChild(polygon);
  };

  const drawSquare = (svg: SVGSVGElement, positions: Array<{x: number, y: number, note: string}>) => {
    const points = positions.map(p => `${p.x},${p.y}`).join(' ');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', 'none');
    polygon.setAttribute('stroke', '#16a34a');
    polygon.setAttribute('stroke-width', '2');
    polygon.setAttribute('opacity', '0.7');
    svg.appendChild(polygon);
  };

  const drawDiamond = (svg: SVGSVGElement, positions: Array<{x: number, y: number, note: string}>) => {
    const points = positions.map(p => `${p.x},${p.y}`).join(' ');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', 'none');
    polygon.setAttribute('stroke', '#dc2626');
    polygon.setAttribute('stroke-width', '2');
    polygon.setAttribute('opacity', '0.7');
    svg.appendChild(polygon);
  };

  const drawHexagon = (svg: SVGSVGElement, positions: Array<{x: number, y: number, note: string}>) => {
    const points = positions.map(p => `${p.x},${p.y}`).join(' ');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', points);
    polygon.setAttribute('fill', 'none');
    polygon.setAttribute('stroke', '#7c3aed');
    polygon.setAttribute('stroke-width', '2');
    polygon.setAttribute('opacity', '0.7');
    svg.appendChild(polygon);
  };

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 400"
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f97316"/>
        </marker>
      </defs>
    </svg>
  );
}
