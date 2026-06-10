/**
 * daitai-vector — Marker primitives (arrowheads, dots, diamonds)
 * 
 * SVG markers som algebraiska typer.
 * Kompileras till <marker> i <defs> och refereras via marker-start/mid/end.
 */

import type { Color, Vec2 } from './types';
import { v2, rgb, hex } from './types';

// ── Marker-typer ──

export type MarkerShape = 'arrow' | 'arrow-open' | 'dot' | 'diamond' | 'square' | 'bar' | 'custom';

export interface Marker {
  readonly id: string;
  readonly shape: MarkerShape;
  readonly size: number;
  readonly color: Color;
  readonly filled: boolean;
  /** Custom path data (only for shape='custom') */
  readonly customPath?: string;
}

export interface MarkerRef {
  readonly start?: string;  // marker id
  readonly mid?: string;
  readonly end?: string;
}

// ── Fabriksfunktioner ──

let _markerId = 0;
function nextMarkerId(): string { return `dv_marker_${_markerId++}`; }

export function arrowMarker(color: Color, size: number = 8): Marker {
  return { id: nextMarkerId(), shape: 'arrow', size, color, filled: true };
}

export function arrowOpenMarker(color: Color, size: number = 8): Marker {
  return { id: nextMarkerId(), shape: 'arrow-open', size, color, filled: false };
}

export function dotMarker(color: Color, size: number = 5): Marker {
  return { id: nextMarkerId(), shape: 'dot', size, color, filled: true };
}

export function diamondMarker(color: Color, size: number = 6): Marker {
  return { id: nextMarkerId(), shape: 'diamond', size, color, filled: true };
}

export function squareMarker(color: Color, size: number = 5): Marker {
  return { id: nextMarkerId(), shape: 'square', size, color, filled: true };
}

export function barMarker(color: Color, size: number = 6): Marker {
  return { id: nextMarkerId(), shape: 'bar', size, color, filled: false };
}

export function customMarker(color: Color, pathData: string, size: number = 8): Marker {
  return { id: nextMarkerId(), shape: 'custom', size, color, filled: true, customPath: pathData };
}

// ── Kompilera marker till SVG <marker> element ──

export function compileMarkerDef(m: Marker): string {
  const s = m.size;
  const half = s / 2;
  const colorHex = colorToHex(m.color);
  const fillAttr = m.filled ? `fill="${colorHex}"` : `fill="none" stroke="${colorHex}" stroke-width="1.5"`;

  let pathContent: string;

  switch (m.shape) {
    case 'arrow':
      pathContent = `<path d="M0 0 L${s} ${half} L0 ${s} Z" ${fillAttr}/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${s}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;

    case 'arrow-open':
      pathContent = `<path d="M0 0 L${s} ${half} L0 ${s}" ${fillAttr}/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${s}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;

    case 'dot':
      pathContent = `<circle cx="${half}" cy="${half}" r="${half * 0.8}" ${fillAttr}/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${half}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;

    case 'diamond': {
      const q = s * 0.25;
      pathContent = `<path d="M${half} 0 L${s} ${half} L${half} ${s} L0 ${half} Z" ${fillAttr}/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${half}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;
    }

    case 'square':
      pathContent = `<rect x="0" y="0" width="${s}" height="${s}" ${fillAttr}/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${half}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;

    case 'bar':
      pathContent = `<line x1="${half}" y1="0" x2="${half}" y2="${s}" stroke="${colorHex}" stroke-width="2"/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${half}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;

    case 'custom':
      pathContent = `<path d="${m.customPath || ''}" ${fillAttr}/>`;
      return `<marker id="${m.id}" markerWidth="${s}" markerHeight="${s}" refX="${half}" refY="${half}" orient="auto" markerUnits="strokeWidth">${pathContent}</marker>`;
  }
}

export function compileMarkerRefAttrs(ref: MarkerRef): string {
  let s = '';
  if (ref.start) s += ` marker-start="url(#${ref.start})"`;
  if (ref.mid) s += ` marker-mid="url(#${ref.mid})"`;
  if (ref.end) s += ` marker-end="url(#${ref.end})"`;
  return s;
}

// ── Preset: dubbelriktad pil ──

export function bidirectionalArrows(color: Color, size: number = 8): { start: Marker; end: Marker } {
  return {
    start: arrowMarker(color, size),
    end: arrowMarker(color, size),
  };
}

function colorToHex(c: Color): string {
  const r = Math.round(c.r).toString(16).padStart(2, '0');
  const g = Math.round(c.g).toString(16).padStart(2, '0');
  const b = Math.round(c.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
