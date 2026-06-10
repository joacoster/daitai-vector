/**
 * daitai-vector → Canvas2D renderer
 * 
 * Kompilerar algebraiskt vektorträd till Canvas2D API-anrop.
 * Ren funktion: (VTree, CanvasRenderingContext2D) → void
 */

import type { VTree, VNode, Shape, Transform, StyleAttrs, FillStyle, StrokeStyle, Color, Segment } from './types';

// ── Image cache for async image loading ──
const _imageCache = new Map<string, HTMLImageElement>();

/** Clear the image cache (useful for testing/cleanup) */
export function clearImageCache(): void { _imageCache.clear(); }

// ── Huvudexport ──

export function renderToCanvas(tree: VTree, ctx: CanvasRenderingContext2D): void {
  renderTree(tree, ctx);
}

// ── Tree → Canvas ──

function renderTree(tree: VTree, ctx: CanvasRenderingContext2D): void {
  switch (tree.kind) {
    case 'Canvas':
      ctx.save();
      // Applicera viewBox-transform
      if (tree.size) {
        const sx = tree.size.w / tree.viewBox.w;
        const sy = tree.size.h / tree.viewBox.h;
        ctx.scale(sx, sy);
        ctx.translate(-tree.viewBox.x, -tree.viewBox.y);
      }
      for (const child of tree.children) renderTree(child, ctx);
      ctx.restore();
      break;

    case 'Group':
      ctx.save();
      applyTransforms(tree.transforms, ctx);
      // Applicera gruppens stil (opacity, fill etc)
      if (tree.style.opacity !== undefined) ctx.globalAlpha *= tree.style.opacity;
      for (const child of tree.children) renderTree(child, ctx);
      ctx.restore();
      break;

    case 'Leaf':
      renderNode(tree.node, ctx);
      break;

    case 'Defs':
      // Defs hanteras vid referens (gradient-skapande sker inline)
      break;
  }
}

// ── VNode → Canvas ──

function renderNode(n: VNode, ctx: CanvasRenderingContext2D): void {
  ctx.save();
  applyTransforms(n.transforms, ctx);
  if (n.style.opacity !== undefined) ctx.globalAlpha *= n.style.opacity;
  renderShape(n.shape, n.style, ctx);
  ctx.restore();
}

// ── Shape → Canvas ──

function renderShape(s: Shape, style: StyleAttrs, ctx: CanvasRenderingContext2D): void {
  switch (s.kind) {
    case 'Circle':
      ctx.beginPath();
      ctx.arc(s.center.x, s.center.y, s.r, 0, Math.PI * 2);
      fillAndStroke(style, ctx);
      break;

    case 'Ellipse':
      ctx.beginPath();
      ctx.ellipse(s.center.x, s.center.y, s.rx, s.ry, 0, 0, Math.PI * 2);
      fillAndStroke(style, ctx);
      break;

    case 'Rect': {
      const { x, y } = s.origin;
      const { w, h } = s.size;
      if (s.round) {
        const r = typeof s.round === 'number' ? s.round : s.round[0];
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        fillAndStroke(style, ctx);
      } else {
        if (style.fill) {
          setFill(style.fill, ctx);
          ctx.fillRect(x, y, w, h);
        }
        if (style.stroke) {
          setStroke(style.stroke, ctx);
          ctx.strokeRect(x, y, w, h);
        }
      }
      break;
    }

    case 'Line':
      ctx.beginPath();
      ctx.moveTo(s.from.x, s.from.y);
      ctx.lineTo(s.to.x, s.to.y);
      if (style.stroke) {
        setStroke(style.stroke, ctx);
        ctx.stroke();
      }
      break;

    case 'Polyline':
      if (s.points.length === 0) break;
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
      fillAndStroke(style, ctx);
      break;

    case 'Polygon':
      if (s.points.length === 0) break;
      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i].x, s.points[i].y);
      ctx.closePath();
      fillAndStroke(style, ctx);
      break;

    case 'Path':
      ctx.beginPath();
      applySegments(s.segments, ctx);
      fillAndStroke(style, ctx);
      break;

    case 'Text': {
      const size = s.size || 16;
      const font = s.font || 'sans-serif';
      const weight = style.fontWeight === 'bold' ? 'bold ' : typeof style.fontWeight === 'number' ? `${style.fontWeight} ` : '';
      const italic = style.fontStyle === 'italic' ? 'italic ' : '';
      ctx.font = `${italic}${weight}${size}px ${font}`;
      if (style.textAnchor) {
        ctx.textAlign = style.textAnchor === 'middle' ? 'center' : style.textAnchor === 'end' ? 'right' : 'left';
      }
      if (style.dominantBaseline) {
        const map: Record<string, CanvasTextBaseline> = { 'auto': 'alphabetic', 'middle': 'middle', 'hanging': 'hanging', 'central': 'middle' };
        ctx.textBaseline = map[style.dominantBaseline] || 'alphabetic';
      }
      if (style.fill && style.fill.kind !== 'None') {
        setFill(style.fill, ctx);
        ctx.fillText(s.content, s.at.x, s.at.y);
      } else if (!style.fill) {
        ctx.fillStyle = '#000';
        ctx.fillText(s.content, s.at.x, s.at.y);
      }
      if (style.stroke) {
        setStroke(style.stroke, ctx);
        ctx.strokeText(s.content, s.at.x, s.at.y);
      }
      break;
    }

    case 'Image': {
      // Async image rendering — cache loaded images
      const src = s.href;
      if (src && _imageCache.has(src)) {
        const img = _imageCache.get(src)!;
        ctx.drawImage(img, s.origin.x, s.origin.y, s.size.w, s.size.h);
      } else if (src) {
        // Load and cache — will render on next frame
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          _imageCache.set(src, img);
          // Note: caller must re-render to see the image
        };
        img.src = src;
      }
      break;
    }
  }
}

// ── Segments → Canvas path ──

function applySegments(segs: readonly Segment[], ctx: CanvasRenderingContext2D): void {
  let cx = 0, cy = 0;
  for (const seg of segs) {
    switch (seg.kind) {
      case 'MoveTo': ctx.moveTo(seg.to.x, seg.to.y); cx = seg.to.x; cy = seg.to.y; break;
      case 'LineTo': ctx.lineTo(seg.to.x, seg.to.y); cx = seg.to.x; cy = seg.to.y; break;
      case 'CubicTo': ctx.bezierCurveTo(seg.c1.x, seg.c1.y, seg.c2.x, seg.c2.y, seg.to.x, seg.to.y); cx = seg.to.x; cy = seg.to.y; break;
      case 'QuadTo': ctx.quadraticCurveTo(seg.c.x, seg.c.y, seg.to.x, seg.to.y); cx = seg.to.x; cy = seg.to.y; break;
      case 'ArcTo': {
        svgArcToCanvas(ctx, cx, cy, seg.rx, seg.ry, seg.rotation, seg.large, seg.sweep, seg.to.x, seg.to.y);
        cx = seg.to.x; cy = seg.to.y;
        break;
      }
      case 'Close': ctx.closePath(); break;
    }
  }
}

// ── SVG Arc → Canvas Arc (endpoint-to-center parametrization) ──

function svgArcToCanvas(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  rxIn: number, ryIn: number,
  rotation: number,
  largeArc: boolean, sweep: boolean,
  x2: number, y2: number,
): void {
  // Degenerate: zero radii → line
  if (rxIn === 0 || ryIn === 0) { ctx.lineTo(x2, y2); return; }
  // Same point → skip
  if (x1 === x2 && y1 === y2) return;

  let rx = Math.abs(rxIn), ry = Math.abs(ryIn);
  const phi = (rotation * Math.PI) / 180;
  const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

  // Step 1: compute (x1', y1') in rotated frame
  const dx2 = (x1 - x2) / 2, dy2 = (y1 - y2) / 2;
  const x1p = cosPhi * dx2 + sinPhi * dy2;
  const y1p = -sinPhi * dx2 + cosPhi * dy2;

  // Step 2: ensure radii are large enough
  const x1p2 = x1p * x1p, y1p2 = y1p * y1p;
  let rx2 = rx * rx, ry2 = ry * ry;
  const lambda = x1p2 / rx2 + y1p2 / ry2;
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s; ry *= s;
    rx2 = rx * rx; ry2 = ry * ry;
  }

  // Step 3: compute center point (cx', cy')
  let sq = (rx2 * ry2 - rx2 * y1p2 - ry2 * x1p2) / (rx2 * y1p2 + ry2 * x1p2);
  if (sq < 0) sq = 0;
  const sign = (largeArc === sweep) ? -1 : 1;
  const root = sign * Math.sqrt(sq);
  const cxp = root * (rx * y1p) / ry;
  const cyp = root * -(ry * x1p) / rx;

  // Step 4: compute center (cx, cy) in original coords
  const cxo = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cyo = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  // Step 5: compute angles
  const vAngle = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
    let a = Math.acos(Math.max(-1, Math.min(1, dot / len)));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };
  const theta1 = vAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dTheta = vAngle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);

  if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI;
  if (sweep && dTheta < 0) dTheta += 2 * Math.PI;

  // Step 6: draw via ctx.ellipse
  ctx.ellipse(cxo, cyo, rx, ry, phi, theta1, theta1 + dTheta, !sweep);
}

// ── Transform → Canvas ──

function applyTransforms(ts: readonly Transform[], ctx: CanvasRenderingContext2D): void {
  for (const t of ts) {
    switch (t.kind) {
      case 'Translate': ctx.translate(t.dx, t.dy); break;
      case 'Scale': ctx.scale(t.sx, t.sy); break;
      case 'Rotate': {
        if (t.cx !== undefined && t.cy !== undefined) {
          ctx.translate(t.cx, t.cy);
          ctx.rotate(t.deg * Math.PI / 180);
          ctx.translate(-t.cx, -t.cy);
        } else {
          ctx.rotate(t.deg * Math.PI / 180);
        }
        break;
      }
      case 'SkewX': ctx.transform(1, 0, Math.tan(t.deg * Math.PI / 180), 1, 0, 0); break;
      case 'SkewY': ctx.transform(1, Math.tan(t.deg * Math.PI / 180), 0, 1, 0, 0); break;
      case 'Matrix': ctx.transform(t.a, t.b, t.c, t.d, t.e, t.f); break;
    }
  }
}

// ── Style-applicering ──

function fillAndStroke(style: StyleAttrs, ctx: CanvasRenderingContext2D): void {
  if (style.fill && style.fill.kind !== 'None') {
    setFill(style.fill, ctx);
    ctx.fill();
  }
  if (style.stroke) {
    setStroke(style.stroke, ctx);
    ctx.stroke();
  }
}

function setFill(f: FillStyle, ctx: CanvasRenderingContext2D): void {
  switch (f.kind) {
    case 'Solid':
      ctx.fillStyle = colorToCss(f.color);
      break;
    case 'LinearGradient': {
      const g = ctx.createLinearGradient(f.from.x, f.from.y, f.to.x, f.to.y);
      for (const s of f.stops) g.addColorStop(s.offset, colorToCss(s.color));
      ctx.fillStyle = g;
      break;
    }
    case 'RadialGradient': {
      const g = ctx.createRadialGradient(f.center.x, f.center.y, 0, f.center.x, f.center.y, f.r);
      for (const s of f.stops) g.addColorStop(s.offset, colorToCss(s.color));
      ctx.fillStyle = g;
      break;
    }
    case 'None': break;
  }
}

function setStroke(s: StrokeStyle, ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = colorToCss(s.color);
  ctx.lineWidth = s.width;
  if (s.cap) ctx.lineCap = s.cap;
  if (s.join) ctx.lineJoin = s.join;
  if (s.dash) ctx.setLineDash([...s.dash]);
  if (s.dashOffset) ctx.lineDashOffset = s.dashOffset;
}

function colorToCss(c: Color): string {
  return c.a < 1
    ? `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${c.a})`
    : `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
}

// ── Hit-testing ──

/** Test if a point hits any shape in the tree, returns node id or null */
export function hitTest(tree: VTree, ctx: CanvasRenderingContext2D, x: number, y: number): string | null {
  return hitTestTree(tree, ctx, x, y);
}

function hitTestTree(tree: VTree, ctx: CanvasRenderingContext2D, x: number, y: number): string | null {
  switch (tree.kind) {
    case 'Canvas':
    case 'Group': {
      const children = tree.children;
      for (let i = children.length - 1; i >= 0; i--) {
        const hit = hitTestTree(children[i], ctx, x, y);
        if (hit) return hit;
      }
      return null;
    }
    case 'Leaf': {
      const n = tree.node;
      ctx.save();
      applyTransforms(n.transforms, ctx);
      let hit = false;
      switch (n.shape.kind) {
        case 'Circle':
          ctx.beginPath();
          ctx.arc(n.shape.center.x, n.shape.center.y, n.shape.r, 0, Math.PI * 2);
          hit = ctx.isPointInPath(x, y);
          break;
        case 'Rect':
          hit = x >= n.shape.origin.x && x <= n.shape.origin.x + n.shape.size.w
             && y >= n.shape.origin.y && y <= n.shape.origin.y + n.shape.size.h;
          break;
        case 'Polygon':
        case 'Path':
          ctx.beginPath();
          if (n.shape.kind === 'Polygon' && n.shape.points.length > 0) {
            ctx.moveTo(n.shape.points[0].x, n.shape.points[0].y);
            for (let i = 1; i < n.shape.points.length; i++) ctx.lineTo(n.shape.points[i].x, n.shape.points[i].y);
            ctx.closePath();
          } else if (n.shape.kind === 'Path') {
            applySegments(n.shape.segments, ctx);
          }
          hit = ctx.isPointInPath(x, y);
          break;
      }
      ctx.restore();
      if (hit) return n.id || 'unnamed';
      return null;
    }
    case 'Defs':
      return null;
  }
}

// ── Convenience: render to offscreen canvas for export ──

export function renderToCanvasElement(tree: VTree, width: number, height: number): HTMLCanvasElement {
  const cvs = document.createElement('canvas');
  cvs.width = width;
  cvs.height = height;
  const c = cvs.getContext('2d')!;
  renderToCanvas(tree, c);
  return cvs;
}

/** Export as data URL (PNG) */
export function renderToDataURL(tree: VTree, width: number, height: number, type = 'image/png'): string {
  return renderToCanvasElement(tree, width, height).toDataURL(type);
}

/** Export as Blob */
export function renderToBlob(tree: VTree, width: number, height: number, type = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    renderToCanvasElement(tree, width, height).toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas toBlob failed'));
    }, type);
  });
}
