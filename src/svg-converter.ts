/**
 * SVG Auto-Converter Trait
 * 
 * Konverterar SVG-strängar till algebraiska VTree-representationer.
 * Cachear resultat för prestanda.
 * 
 * Användning:
 *   const tree = svgToVector(svgString);
 *   const html = compileToSvg(tree);  // roundtrip
 */

import { parseSvgPath } from './parse-svg';
import { v2, sz, node, leaf, group, canvas } from './types';
import type { VTree, VNode, Shape, StyleAttrs, FillStyle, StrokeStyle, Color, Transform } from './types';

// ── Cache ──

const cache = new Map<string, VTree>();
const MAX_CACHE = 512;

/** Konvertera SVG-sträng → VTree (cachad) */
export function svgToVector(svg: string): VTree {
  let cached = cache.get(svg);
  if (cached) return cached;

  const tree = parseSvgToVTree(svg);
  
  // LRU-liknande: kasta äldsta om cachen är full
  if (cache.size >= MAX_CACHE) {
    const first = cache.keys().next().value;
    if (first !== undefined) cache.delete(first);
  }
  cache.set(svg, tree);
  return tree;
}

/** Rensa cachen */
export function clearSvgCache(): void {
  cache.clear();
}

/** Antal cachade ikoner */
export function svgCacheSize(): number {
  return cache.size;
}

// ── Parser: SVG-sträng → VTree ──

function parseSvgToVTree(svg: string): VTree {
  // Extrahera viewBox
  const vbMatch = svg.match(/viewBox="([^"]+)"/);
  const vb = vbMatch
    ? parseViewBox(vbMatch[1])
    : { x: 0, y: 0, w: 24, h: 24 };

  // Extrahera width/height
  const wMatch = svg.match(/width="(\d+)"/);
  const hMatch = svg.match(/height="(\d+)"/);
  const size = wMatch && hMatch
    ? sz(parseInt(wMatch[1]), parseInt(hMatch[1]))
    : undefined;

  // Extrahera SVG-element
  const children = parseElements(svg);

  return canvas(vb, children, size);
}

function parseViewBox(s: string): { x: number; y: number; w: number; h: number } {
  const [x, y, w, h] = s.split(/[\s,]+/).map(Number);
  return { x: x || 0, y: y || 0, w: w || 24, h: h || 24 };
}

function parseElements(svg: string): VTree[] {
  const trees: VTree[] = [];

  // Match alla <path d="..."> element
  const pathRe = /<path\s+([^>]*?)\/?\s*>/g;
  let m: RegExpExecArray | null;
  while ((m = pathRe.exec(svg)) !== null) {
    const attrs = m[1];
    const dMatch = attrs.match(/d="([^"]+)"/);
    if (dMatch) {
      const segments = parseSvgPath(dMatch[1]);
      const style = parseStyleAttrs(attrs);
      trees.push(leaf(node({ kind: 'Path', segments }, style)));
    }
  }

  // Match <circle> element
  const circleRe = /<circle\s+([^>]*?)\/?\s*>/g;
  while ((m = circleRe.exec(svg)) !== null) {
    const attrs = m[1];
    const cx = parseFloat(attrVal(attrs, 'cx') || '0');
    const cy = parseFloat(attrVal(attrs, 'cy') || '0');
    const r = parseFloat(attrVal(attrs, 'r') || '0');
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({ kind: 'Circle', center: v2(cx, cy), r }, style)));
  }

  // Match <rect> element
  const rectRe = /<rect\s+([^>]*?)\/?\s*>/g;
  while ((m = rectRe.exec(svg)) !== null) {
    const attrs = m[1];
    const x = parseFloat(attrVal(attrs, 'x') || '0');
    const y = parseFloat(attrVal(attrs, 'y') || '0');
    const w = parseFloat(attrVal(attrs, 'width') || '0');
    const h = parseFloat(attrVal(attrs, 'height') || '0');
    const rx = attrVal(attrs, 'rx');
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({ kind: 'Rect', origin: v2(x, y), size: sz(w, h), round: rx ? parseFloat(rx) : undefined }, style)));
  }

  // Match <line> element
  const lineRe = /<line\s+([^>]*?)\/?\s*>/g;
  while ((m = lineRe.exec(svg)) !== null) {
    const attrs = m[1];
    const x1 = parseFloat(attrVal(attrs, 'x1') || '0');
    const y1 = parseFloat(attrVal(attrs, 'y1') || '0');
    const x2 = parseFloat(attrVal(attrs, 'x2') || '0');
    const y2 = parseFloat(attrVal(attrs, 'y2') || '0');
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({ kind: 'Line', from: v2(x1, y1), to: v2(x2, y2) }, style)));
  }

  // Match <ellipse> element
  const ellipseRe = /<ellipse\s+([^>]*?)\/?\s*>/g;
  while ((m = ellipseRe.exec(svg)) !== null) {
    const attrs = m[1];
    const cx = parseFloat(attrVal(attrs, 'cx') || '0');
    const cy = parseFloat(attrVal(attrs, 'cy') || '0');
    const rx = parseFloat(attrVal(attrs, 'rx') || '0');
    const ry = parseFloat(attrVal(attrs, 'ry') || '0');
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({ kind: 'Ellipse', center: v2(cx, cy), rx, ry }, style)));
  }

  // Match <polygon> element
  const polygonRe = /<polygon\s+([^>]*?)\/?\s*>/g;
  while ((m = polygonRe.exec(svg)) !== null) {
    const attrs = m[1];
    const ptsStr = attrVal(attrs, 'points') || '';
    const points = parsePoints(ptsStr);
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({ kind: 'Polygon', points }, style)));
  }

  // Match <polyline> element
  const polylineRe = /<polyline\s+([^>]*?)\/?\s*>/g;
  while ((m = polylineRe.exec(svg)) !== null) {
    const attrs = m[1];
    const ptsStr = attrVal(attrs, 'points') || '';
    const points = parsePoints(ptsStr);
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({ kind: 'Polyline', points }, style)));
  }

  // Match <text> element
  const textRe = /<text\s+([^>]*?)>([^<]*)<\/text>/g;
  while ((m = textRe.exec(svg)) !== null) {
    const attrs = m[1];
    const content = m[2];
    const x = parseFloat(attrVal(attrs, 'x') || '0');
    const y = parseFloat(attrVal(attrs, 'y') || '0');
    const fontSize = attrVal(attrs, 'font-size');
    const fontFamily = attrVal(attrs, 'font-family');
    const style = parseStyleAttrs(attrs);
    trees.push(leaf(node({
      kind: 'Text', content, at: v2(x, y),
      font: fontFamily || undefined,
      size: fontSize ? parseFloat(fontSize) : undefined,
    }, style)));
  }

  return trees;
}

function parsePoints(s: string): { readonly x: number; readonly y: number }[] {
  const nums = s.trim().split(/[\s,]+/).map(Number);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    pts.push(v2(nums[i], nums[i + 1]));
  }
  return pts;
}

function attrVal(attrs: string, name: string): string | null {
  const re = new RegExp(`${name}="([^"]*)"`, 'i');
  const m = re.exec(attrs);
  return m ? m[1] : null;
}

function parseStyleAttrs(attrs: string): StyleAttrs {
  const result: StyleAttrs = {};

  const fillVal = attrVal(attrs, 'fill');
  if (fillVal === 'none') {
    (result as any).fill = { kind: 'None' };
  } else if (fillVal) {
    const color = parseCssColor(fillVal);
    if (color) (result as any).fill = { kind: 'Solid', color };
  }

  const strokeVal = attrVal(attrs, 'stroke');
  const strokeWidth = attrVal(attrs, 'stroke-width');
  const strokeLinecap = attrVal(attrs, 'stroke-linecap') as StrokeStyle['cap'];
  const strokeLinejoin = attrVal(attrs, 'stroke-linejoin') as StrokeStyle['join'];

  if (strokeVal && strokeVal !== 'none') {
    const color = parseCssColor(strokeVal);
    if (color) {
      (result as any).stroke = {
        color,
        width: strokeWidth ? parseFloat(strokeWidth) : 1,
        ...(strokeLinecap ? { cap: strokeLinecap } : {}),
        ...(strokeLinejoin ? { join: strokeLinejoin } : {}),
      };
    }
  }

  const opacityVal = attrVal(attrs, 'opacity');
  if (opacityVal) (result as any).opacity = parseFloat(opacityVal);

  return result;
}

function parseCssColor(s: string): Color | null {
  if (s === 'currentColor') return { r: 0, g: 0, b: 0, a: 1 }; // placeholder
  if (s.startsWith('#')) {
    const h = s.slice(1);
    const full = h.length === 3
      ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2]
      : h.length === 4 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2]+h[3]+h[3] : h;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
    };
  }
  const rgbMatch = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }
  return null;
}

// ── Batch-konvertera och lagra ──

/** Auto-store: konvertera + cacha en batch SVG-strängar */
export function batchConvert(svgs: Record<string, string>): Record<string, VTree> {
  const result: Record<string, VTree> = {};
  for (const [name, svg] of Object.entries(svgs)) {
    result[name] = svgToVector(svg);
  }
  return result;
}
