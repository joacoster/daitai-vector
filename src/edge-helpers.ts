/**
 * daitai-vector — Edge/connection helpers
 * 
 * Algebraiska hjälpfunktioner för att bygga VTree:er
 * som representerar grafer (kanter, pilar, markörer).
 * Ersätter raw SVG-strängar i graph-editor och page-graph.
 */

import {
  type VTree, type Color, type StyleAttrs, type StrokeStyle,
  v2, line, path, polygon, text, rect,
  node, leaf, group, canvas,
  hex, rgb,
} from './types';
import { compileToSvg } from './compile-svg';

// ─── Edge (linje med pilspets) ──────────────────────

export interface EdgeConfig {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  width?: number;
  dash?: readonly number[];
  arrowSize?: number;
}

/** Skapa en VTree för en rak kant med pilspets */
export function edgeLine(cfg: EdgeConfig): VTree {
  const { x1, y1, x2, y2, color, width = 1.5, dash, arrowSize = 6 } = cfg;
  const c = hex(color);
  const strokeStyle: StrokeStyle = { color: c, width, dash: dash ? [...dash] : undefined };
  const style: StyleAttrs = { stroke: strokeStyle, fill: { kind: 'None' } };

  const children: VTree[] = [
    leaf(node(line(v2(x1, y1), v2(x2, y2)), style)),
  ];

  // Pilspets (triangel vid slutpunkten)
  if (arrowSize > 0) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const ax = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const ay = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const bx = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const by = y2 - arrowSize * Math.sin(angle + Math.PI / 6);
    children.push(leaf(node(
      polygon(v2(x2, y2), v2(ax, ay), v2(bx, by)),
      { fill: { kind: 'Solid', color: c } },
    )));
  }

  return group(children);
}

/** Skapa en VTree för en Bézier-kant med pilspets och valfri etikett */
export interface BezierEdgeConfig {
  x1: number; y1: number;
  cx1: number; cy1: number;
  cx2: number; cy2: number;
  x2: number; y2: number;
  color: string;
  width?: number;
  dash?: readonly number[];
  arrowSize?: number;
  label?: string;
  labelBg?: string;
  labelColor?: string;
}

export function edgeBezier(cfg: BezierEdgeConfig): VTree {
  const { x1, y1, cx1, cy1, cx2, cy2, x2, y2, color, width = 1.5, dash, arrowSize = 6 } = cfg;
  const c = hex(color);
  const strokeStyle: StrokeStyle = { color: c, width, dash: dash ? [...dash] : undefined };
  const style: StyleAttrs = { stroke: strokeStyle, fill: { kind: 'None' } };

  const children: VTree[] = [
    leaf(node(
      path().moveTo(x1, y1).cubicTo(cx1, cy1, cx2, cy2, x2, y2).build(),
      style,
    )),
  ];

  // Pilspets
  if (arrowSize > 0) {
    // Approximera tangent vid slutpunkten via sista kontrollpunkt
    const angle = Math.atan2(y2 - cy2, x2 - cx2);
    const ax = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const ay = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const bx = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const by = y2 - arrowSize * Math.sin(angle + Math.PI / 6);
    children.push(leaf(node(
      polygon(v2(x2, y2), v2(ax, ay), v2(bx, by)),
      { fill: { kind: 'Solid', color: c } },
    )));
  }

  // Etikett
  if (cfg.label) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const bgColor = cfg.labelBg ? hex(cfg.labelBg) : rgb(30, 30, 30);
    const txtColor = cfg.labelColor ? hex(cfg.labelColor) : c;
    children.push(
      leaf(node(rect(v2(midX - 40, midY - 10), { w: 80, h: 20 }, 4), {
        fill: { kind: 'Solid', color: bgColor },
        stroke: { color: c, width: 1 },
      })),
      leaf(node(text(cfg.label, v2(midX, midY + 4), 'system-ui', 9), {
        fill: { kind: 'Solid', color: txtColor },
      })),
    );
  }

  return group(children);
}

// ─── Full SVG output ────────────────────────────────

/** Bygg en komplett SVG-sträng från edge-VTrees */
export function edgesToSvg(
  edges: VTree[],
  width: string | number = '100%',
  height: string | number = '100%',
): string {
  const w = typeof width === 'number' ? width : 9999;
  const h = typeof height === 'number' ? height : 9999;
  const vb = { x: 0, y: 0, w, h };
  // Canvas wraps edges; compileToSvg produces the full <svg> tag
  const tree = canvas(vb, edges, typeof width === 'number' && typeof height === 'number' ? { w, h } : undefined);
  let svg = compileToSvg(tree);
  // Override width/height if string percentages
  if (typeof width === 'string') svg = svg.replace(/width="\d+"/, `width="${width}"`);
  if (typeof height === 'string') svg = svg.replace(/height="\d+"/, `height="${height}"`);
  // Add pointer-events:none and overflow:visible
  svg = svg.replace('<svg ', '<svg style="pointer-events:none;overflow:visible" ');
  return svg;
}
