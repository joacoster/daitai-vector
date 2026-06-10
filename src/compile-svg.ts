/**
 * daitai-vector → SVG kompilator
 * 
 * Kompilerar algebraiskt vektorträd till SVG-strängar.
 * Ren funktion: VTree → string
 */

import type { VTree, VNode, Shape, Transform, StyleAttrs, FillStyle, StrokeStyle, Color, Segment, GradientStop, Vec2, VDef } from './types';

// ── Huvudexport ──

export function compileToSvg(tree: VTree): string {
  const ctx = createCompileCtx();
  const body = compileTree(tree, ctx);
  return body;
}

// ── Intern kompileringskontext (för gradient-defs etc) ──

interface CompileCtx {
  defs: string[];
  defId: number;
  nextDefId(): string;
}

function createCompileCtx(): CompileCtx {
  return {
    defs: [],
    defId: 0,
    nextDefId() { return `dv_${this.defId++}`; },
  };
}

// ── Tree → SVG ──

function compileTree(tree: VTree, ctx: CompileCtx): string {
  switch (tree.kind) {
    case 'Canvas': {
      const { viewBox: vb, children, size } = tree;
      const sizeAttr = size ? ` width="${size.w}" height="${size.h}"` : '';
      const inner = children.map(c => compileTree(c, ctx)).join('');
      const defsStr = ctx.defs.length > 0 ? `<defs>${ctx.defs.join('')}</defs>` : '';
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}"${sizeAttr}>${defsStr}${inner}</svg>`;
    }

    case 'Group': {
      const attrs = compileGroupAttrs(tree.transforms, tree.style, tree.id, ctx);
      const inner = tree.children.map(c => compileTree(c, ctx)).join('');
      return `<g${attrs}>${inner}</g>`;
    }

    case 'Leaf':
      return compileNode(tree.node, ctx);

    case 'Defs': {
      for (const def of tree.definitions) {
        ctx.defs.push(compileDef(def, ctx));
      }
      return '';
    }
  }
}

// ── VNode → SVG element ──

function compileNode(n: VNode, ctx: CompileCtx): string {
  const transformAttr = compileTransforms(n.transforms);
  const styleAttrs = compileStyleAttrs(n.style, ctx);
  const idAttr = n.id ? ` id="${esc(n.id)}"` : '';
  const shapeStr = compileShape(n.shape, transformAttr + styleAttrs + idAttr);
  return shapeStr;
}

// ── Shape → SVG element ──

function compileShape(s: Shape, attrs: string): string {
  switch (s.kind) {
    case 'Circle':
      return `<circle cx="${s.center.x}" cy="${s.center.y}" r="${s.r}"${attrs}/>`;

    case 'Ellipse':
      return `<ellipse cx="${s.center.x}" cy="${s.center.y}" rx="${s.rx}" ry="${s.ry}"${attrs}/>`;

    case 'Rect': {
      const rx = typeof s.round === 'number' ? ` rx="${s.round}"` : '';
      return `<rect x="${s.origin.x}" y="${s.origin.y}" width="${s.size.w}" height="${s.size.h}"${rx}${attrs}/>`;
    }

    case 'Line':
      return `<line x1="${s.from.x}" y1="${s.from.y}" x2="${s.to.x}" y2="${s.to.y}"${attrs}/>`;

    case 'Polyline': {
      const pts = s.points.map(p => `${p.x},${p.y}`).join(' ');
      return `<polyline points="${pts}"${attrs}/>`;
    }

    case 'Polygon': {
      const pts = s.points.map(p => `${p.x},${p.y}`).join(' ');
      return `<polygon points="${pts}"${attrs}/>`;
    }

    case 'Path': {
      const d = compileSegments(s.segments);
      return `<path d="${d}"${attrs}/>`;
    }

    case 'Text': {
      const fontAttr = s.font ? ` font-family="${esc(s.font)}"` : '';
      const sizeAttr = s.size ? ` font-size="${s.size}"` : '';
      return `<text x="${s.at.x}" y="${s.at.y}"${fontAttr}${sizeAttr}${attrs}>${esc(s.content)}</text>`;
    }

    case 'Image':
      return `<image href="${esc(s.href)}" x="${s.origin.x}" y="${s.origin.y}" width="${s.size.w}" height="${s.size.h}"${attrs}/>`;
  }
}

// ── Segments → SVG path d ──

function compileSegments(segs: readonly Segment[]): string {
  return segs.map(seg => {
    switch (seg.kind) {
      case 'MoveTo': return `M${seg.to.x} ${seg.to.y}`;
      case 'LineTo': return `L${seg.to.x} ${seg.to.y}`;
      case 'CubicTo': return `C${seg.c1.x} ${seg.c1.y} ${seg.c2.x} ${seg.c2.y} ${seg.to.x} ${seg.to.y}`;
      case 'QuadTo': return `Q${seg.c.x} ${seg.c.y} ${seg.to.x} ${seg.to.y}`;
      case 'ArcTo': return `A${seg.rx} ${seg.ry} ${seg.rotation} ${seg.large ? 1 : 0} ${seg.sweep ? 1 : 0} ${seg.to.x} ${seg.to.y}`;
      case 'Close': return 'Z';
    }
  }).join(' ');
}

// ── Transform → SVG transform attr ──

function compileTransforms(ts: readonly Transform[]): string {
  if (ts.length === 0) return '';
  const parts = ts.map(t => {
    switch (t.kind) {
      case 'Translate': return `translate(${t.dx},${t.dy})`;
      case 'Scale': return t.sx === t.sy ? `scale(${t.sx})` : `scale(${t.sx},${t.sy})`;
      case 'Rotate': return t.cx !== undefined ? `rotate(${t.deg},${t.cx},${t.cy})` : `rotate(${t.deg})`;
      case 'SkewX': return `skewX(${t.deg})`;
      case 'SkewY': return `skewY(${t.deg})`;
      case 'Matrix': return `matrix(${t.a},${t.b},${t.c},${t.d},${t.e},${t.f})`;
    }
  });
  return ` transform="${parts.join(' ')}"`;
}

// ── Style → SVG attribut ──

function compileStyleAttrs(style: StyleAttrs, ctx: CompileCtx): string {
  let s = '';
  if (style.fill) {
    s += ` fill="${compileFill(style.fill, ctx)}"`;
    if (style.fill.kind === 'Solid' && style.fill.color.a < 1) {
      s += ` fill-opacity="${style.fill.color.a}"`;
    }
  }
  if (style.stroke) {
    s += compileStroke(style.stroke);
  }
  if (style.opacity !== undefined) {
    s += ` opacity="${style.opacity}"`;
  }
  if (style.markerStart) s += ` marker-start="url(#${style.markerStart})"`;
  if (style.markerMid) s += ` marker-mid="url(#${style.markerMid})"`;
  if (style.markerEnd) s += ` marker-end="url(#${style.markerEnd})"`;
  if (style.textAnchor) s += ` text-anchor="${style.textAnchor}"`;
  if (style.dominantBaseline) s += ` dominant-baseline="${style.dominantBaseline}"`;
  if (style.fontStyle && style.fontStyle !== 'normal') s += ` font-style="${style.fontStyle}"`;
  if (style.fontWeight && style.fontWeight !== 'normal') s += ` font-weight="${style.fontWeight}"`;
  return s;
}

function compileFill(f: FillStyle, ctx: CompileCtx): string {
  switch (f.kind) {
    case 'Solid': return colorToHex(f.color);
    case 'None': return 'none';
    case 'LinearGradient': {
      const id = ctx.nextDefId();
      ctx.defs.push(
        `<linearGradient id="${id}" x1="${f.from.x}" y1="${f.from.y}" x2="${f.to.x}" y2="${f.to.y}">${compileStops(f.stops)}</linearGradient>`
      );
      return `url(#${id})`;
    }
    case 'RadialGradient': {
      const id = ctx.nextDefId();
      ctx.defs.push(
        `<radialGradient id="${id}" cx="${f.center.x}" cy="${f.center.y}" r="${f.r}">${compileStops(f.stops)}</radialGradient>`
      );
      return `url(#${id})`;
    }
  }
}

function compileStops(stops: readonly GradientStop[]): string {
  return stops.map(s => `<stop offset="${s.offset}" stop-color="${colorToHex(s.color)}"${s.color.a < 1 ? ` stop-opacity="${s.color.a}"` : ''}/>`).join('');
}

function compileStroke(s: StrokeStyle): string {
  let str = ` stroke="${colorToHex(s.color)}" stroke-width="${s.width}"`;
  if (s.cap && s.cap !== 'butt') str += ` stroke-linecap="${s.cap}"`;
  if (s.join && s.join !== 'miter') str += ` stroke-linejoin="${s.join}"`;
  if (s.dash && s.dash.length > 0) str += ` stroke-dasharray="${s.dash.join(',')}"`;
  if (s.dashOffset) str += ` stroke-dashoffset="${s.dashOffset}"`;
  if (s.color.a < 1) str += ` stroke-opacity="${s.color.a}"`;
  return str;
}

function compileGroupAttrs(transforms: readonly Transform[], style: StyleAttrs, id: string | undefined, ctx: CompileCtx): string {
  let s = '';
  if (id) s += ` id="${esc(id)}"`;
  s += compileTransforms(transforms);
  s += compileStyleAttrs(style, ctx);
  return s;
}

function compileDef(def: VDef, ctx: CompileCtx): string {
  // Raw SVG (markers etc.)
  if (def.rawSvg) return def.rawSvg;
  // VDef innehåller gradient-definitioner med explicit id
  if (def.content.kind === 'LinearGradient') {
    return `<linearGradient id="${def.id}" x1="${def.content.from.x}" y1="${def.content.from.y}" x2="${def.content.to.x}" y2="${def.content.to.y}">${compileStops(def.content.stops)}</linearGradient>`;
  }
  if (def.content.kind === 'RadialGradient') {
    return `<radialGradient id="${def.id}" cx="${def.content.center.x}" cy="${def.content.center.y}" r="${def.content.r}">${compileStops(def.content.stops)}</radialGradient>`;
  }
  return '';
}

// ── Hjälpfunktioner ──

function colorToHex(c: Color): string {
  const r = Math.round(c.r).toString(16).padStart(2, '0');
  const g = Math.round(c.g).toString(16).padStart(2, '0');
  const b = Math.round(c.b).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Utility: kompilera en enskild VNode till SVG (utan canvas-wrapper) ──

export function nodeToSvg(n: VNode): string {
  const ctx = createCompileCtx();
  return compileNode(n, ctx);
}

// ── Utility: SVG path d-sträng från segments ──

export function segmentsToD(segs: readonly Segment[]): string {
  return compileSegments(segs);
}
