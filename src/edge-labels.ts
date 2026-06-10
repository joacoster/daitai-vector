/**
 * daitai-vector — Edge Labels
 * 
 * Text positioned along lines or curves, with offset and anchor control.
 * Used for labeling arrows in commutative diagrams, graph edges, etc.
 */

import type { Vec2, Color, VTree } from './types';
import { v2, text, rect, node, leaf, group, rgb, hex } from './types';

// ── Types ──

export type LabelAnchor = 'start' | 'middle' | 'end';
export type LabelPosition = 'above' | 'below' | 'on' | 'left' | 'right';

export interface EdgeLabel {
  readonly content: string;
  readonly position: LabelPosition;
  readonly anchor: LabelAnchor;
  readonly offset: number;           // perpendicular offset in px
  readonly fontSize: number;
  readonly fontFamily: string;
  readonly color: Color;
  readonly background?: Color;       // optional background rect
  readonly backgroundPadding: number;
  readonly italic: boolean;
}

// ── Factory ──

export function edgeLabel(
  content: string,
  opts: Partial<Omit<EdgeLabel, 'content'>> = {},
): EdgeLabel {
  return {
    content,
    position: opts.position ?? 'above',
    anchor: opts.anchor ?? 'middle',
    offset: opts.offset ?? 4,
    fontSize: opts.fontSize ?? 10,
    fontFamily: opts.fontFamily ?? 'serif',
    color: opts.color ?? rgb(0, 0, 0),
    background: opts.background,
    backgroundPadding: opts.backgroundPadding ?? 3,
    italic: opts.italic ?? true,
  };
}

// ── Positioning: compute label position along a line segment ──

export function placeLabelOnLine(
  from: Vec2, to: Vec2,
  label: EdgeLabel,
): VTree {
  const t = label.anchor === 'start' ? 0.15 : label.anchor === 'end' ? 0.85 : 0.5;
  const px = from.x + (to.x - from.x) * t;
  const py = from.y + (to.y - from.y) * t;

  // Perpendicular direction
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len; // normal
  const ny = dx / len;

  const sign = (label.position === 'below' || label.position === 'right') ? 1 : -1;
  const off = label.position === 'on' ? 0 : label.offset;
  const lx = px + nx * off * sign;
  const ly = py + ny * off * sign;

  return buildLabelVTree(label, lx, ly);
}

export function placeLabelOnCurve(
  from: Vec2, c1: Vec2, c2: Vec2, to: Vec2,
  label: EdgeLabel,
): VTree {
  const t = label.anchor === 'start' ? 0.15 : label.anchor === 'end' ? 0.85 : 0.5;

  // De Casteljau for cubic Bézier at parameter t
  const px = cubicAt(from.x, c1.x, c2.x, to.x, t);
  const py = cubicAt(from.y, c1.y, c2.y, to.y, t);

  // Tangent at t for perpendicular
  const tx = cubicTangentAt(from.x, c1.x, c2.x, to.x, t);
  const ty = cubicTangentAt(from.y, c1.y, c2.y, to.y, t);
  const tlen = Math.sqrt(tx * tx + ty * ty) || 1;
  const nx = -ty / tlen;
  const ny = tx / tlen;

  const sign = (label.position === 'below' || label.position === 'right') ? 1 : -1;
  const off = label.position === 'on' ? 0 : label.offset;
  const lx = px + nx * off * sign;
  const ly = py + ny * off * sign;

  return buildLabelVTree(label, lx, ly);
}

// ── Internal ──

function buildLabelVTree(label: EdgeLabel, x: number, y: number): VTree {
  const children: VTree[] = [];

  // Approximate text width
  const approxWidth = label.content.length * label.fontSize * 0.55;
  const pad = label.backgroundPadding;

  if (label.background) {
    children.push(leaf(node(
      rect(v2(x - approxWidth / 2 - pad, y - label.fontSize * 0.8 - pad), {
        w: approxWidth + pad * 2,
        h: label.fontSize + pad * 2,
      }, 2),
      { fill: { kind: 'Solid', color: label.background } },
    )));
  }

  const fontSpec = label.italic ? `italic ${label.fontFamily}` : label.fontFamily;
  children.push(leaf(node(
    text(label.content, v2(x, y), fontSpec, label.fontSize),
    { fill: { kind: 'Solid', color: label.color } },
  )));

  return group(children);
}

function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

function cubicTangentAt(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const mt = 1 - t;
  return 3 * mt * mt * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}
