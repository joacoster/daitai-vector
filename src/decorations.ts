/**
 * daitai-vector — Decorations
 * 
 * Procedural path decorations: wavy lines, braces, zigzag, coils.
 * Generates Path segments from two endpoints — like TikZ decorations.
 */

import type { Segment, Vec2, Shape, VTree, Color, StyleAttrs } from './types';
import { v2, node, leaf } from './types';

// ── Decoration types ──

export type DecorationType = 'wavy' | 'zigzag' | 'coil' | 'brace' | 'ticks';

export interface DecorationConfig {
  readonly type: DecorationType;
  readonly amplitude: number;    // height of wave/zigzag
  readonly wavelength: number;   // distance per cycle
  readonly segments?: number;    // override: exact number of cycles
}

// ── Factories ──

export function wavy(amplitude: number = 4, wavelength: number = 12): DecorationConfig {
  return { type: 'wavy', amplitude, wavelength };
}

export function zigzag(amplitude: number = 4, wavelength: number = 10): DecorationConfig {
  return { type: 'zigzag', amplitude, wavelength };
}

export function coil(amplitude: number = 5, wavelength: number = 14): DecorationConfig {
  return { type: 'coil', amplitude, wavelength };
}

export function brace(amplitude: number = 8): DecorationConfig {
  return { type: 'brace', amplitude, wavelength: 0 };
}

export function ticks(amplitude: number = 4, wavelength: number = 8): DecorationConfig {
  return { type: 'ticks', amplitude, wavelength };
}

// ── Generate decorated path segments ──

export function decorateLine(
  from: Vec2, to: Vec2,
  config: DecorationConfig,
): Segment[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 1) return [{ kind: 'MoveTo', to: from }, { kind: 'LineTo', to }];

  // Unit vectors: tangent and normal
  const tx = dx / length;
  const ty = dy / length;
  const nx = -ty;
  const ny = tx;

  switch (config.type) {
    case 'wavy': return generateWavy(from, tx, ty, nx, ny, length, config);
    case 'zigzag': return generateZigzag(from, tx, ty, nx, ny, length, config);
    case 'coil': return generateCoil(from, tx, ty, nx, ny, length, config);
    case 'brace': return generateBrace(from, to, tx, ty, nx, ny, length, config);
    case 'ticks': return generateTicks(from, tx, ty, nx, ny, length, config);
  }
}

/** Convenience: decoration → VTree leaf */
export function decoratedLine(
  from: Vec2, to: Vec2,
  config: DecorationConfig,
  style: StyleAttrs = {},
): VTree {
  const segs = decorateLine(from, to, config);
  const shape: Shape = { kind: 'Path', segments: segs };
  return leaf(node(shape, style));
}

// ── Generators ──

function generateWavy(
  from: Vec2, tx: number, ty: number, nx: number, ny: number,
  length: number, cfg: DecorationConfig,
): Segment[] {
  const cycles = cfg.segments ?? Math.max(1, Math.round(length / cfg.wavelength));
  const stepLen = length / cycles;
  const segs: Segment[] = [{ kind: 'MoveTo', to: from }];
  const amp = cfg.amplitude;

  for (let i = 0; i < cycles; i++) {
    const t0 = i * stepLen;
    const t1 = (i + 0.25) * stepLen;
    const t2 = (i + 0.5) * stepLen;
    const t3 = (i + 0.75) * stepLen;
    const t4 = (i + 1) * stepLen;

    // Cubic Bézier for half-wave up, then half-wave down
    segs.push({
      kind: 'CubicTo',
      c1: ptAt(from, tx, ty, nx, ny, t1, amp),
      c2: ptAt(from, tx, ty, nx, ny, t2 - stepLen * 0.1, amp),
      to: ptAt(from, tx, ty, nx, ny, t2, 0),
    });
    segs.push({
      kind: 'CubicTo',
      c1: ptAt(from, tx, ty, nx, ny, t2 + stepLen * 0.1, -amp),
      c2: ptAt(from, tx, ty, nx, ny, t3, -amp),
      to: ptAt(from, tx, ty, nx, ny, t4, 0),
    });
  }

  return segs;
}

function generateZigzag(
  from: Vec2, tx: number, ty: number, nx: number, ny: number,
  length: number, cfg: DecorationConfig,
): Segment[] {
  const cycles = cfg.segments ?? Math.max(1, Math.round(length / cfg.wavelength));
  const stepLen = length / cycles;
  const segs: Segment[] = [{ kind: 'MoveTo', to: from }];
  const amp = cfg.amplitude;

  for (let i = 0; i < cycles; i++) {
    const t0 = i * stepLen;
    const tMid = (i + 0.5) * stepLen;
    const t1 = (i + 1) * stepLen;

    segs.push({ kind: 'LineTo', to: ptAt(from, tx, ty, nx, ny, tMid, amp * (i % 2 === 0 ? 1 : -1)) });
    segs.push({ kind: 'LineTo', to: ptAt(from, tx, ty, nx, ny, t1, 0) });
  }

  return segs;
}

function generateCoil(
  from: Vec2, tx: number, ty: number, nx: number, ny: number,
  length: number, cfg: DecorationConfig,
): Segment[] {
  const cycles = cfg.segments ?? Math.max(1, Math.round(length / cfg.wavelength));
  const stepLen = length / cycles;
  const segs: Segment[] = [{ kind: 'MoveTo', to: from }];
  const amp = cfg.amplitude;

  for (let i = 0; i < cycles; i++) {
    const t0 = i * stepLen;
    const t1 = (i + 1) * stepLen;

    // Full loop via two cubic segments
    segs.push({
      kind: 'CubicTo',
      c1: ptAt(from, tx, ty, nx, ny, t0 + stepLen * 0.2, amp * 1.5),
      c2: ptAt(from, tx, ty, nx, ny, t0 + stepLen * 0.5, amp * 1.5),
      to: ptAt(from, tx, ty, nx, ny, t0 + stepLen * 0.5, 0),
    });
    segs.push({
      kind: 'CubicTo',
      c1: ptAt(from, tx, ty, nx, ny, t0 + stepLen * 0.5, -amp * 0.8),
      c2: ptAt(from, tx, ty, nx, ny, t0 + stepLen * 0.8, -amp * 0.3),
      to: ptAt(from, tx, ty, nx, ny, t1, 0),
    });
  }

  return segs;
}

function generateBrace(
  from: Vec2, to: Vec2,
  tx: number, ty: number, nx: number, ny: number,
  length: number, cfg: DecorationConfig,
): Segment[] {
  const amp = cfg.amplitude;
  const mid = length / 2;
  const q = length * 0.15; // curve tightness

  return [
    { kind: 'MoveTo', to: from },
    {
      kind: 'CubicTo',
      c1: ptAt(from, tx, ty, nx, ny, q, amp * 0.6),
      c2: ptAt(from, tx, ty, nx, ny, mid - q, amp * 0.6),
      to: ptAt(from, tx, ty, nx, ny, mid, amp),
    },
    {
      kind: 'CubicTo',
      c1: ptAt(from, tx, ty, nx, ny, mid + q, amp * 0.6),
      c2: ptAt(from, tx, ty, nx, ny, length - q, amp * 0.6),
      to,
    },
  ];
}

function generateTicks(
  from: Vec2, tx: number, ty: number, nx: number, ny: number,
  length: number, cfg: DecorationConfig,
): Segment[] {
  const count = cfg.segments ?? Math.max(1, Math.round(length / cfg.wavelength));
  const stepLen = length / (count + 1);
  const segs: Segment[] = [{ kind: 'MoveTo', to: from }];
  const amp = cfg.amplitude;

  // Main line
  for (let i = 1; i <= count; i++) {
    const t = i * stepLen;
    segs.push({ kind: 'LineTo', to: ptAt(from, tx, ty, nx, ny, t, 0) });
    // Tick
    segs.push({ kind: 'MoveTo', to: ptAt(from, tx, ty, nx, ny, t, -amp) });
    segs.push({ kind: 'LineTo', to: ptAt(from, tx, ty, nx, ny, t, amp) });
    segs.push({ kind: 'MoveTo', to: ptAt(from, tx, ty, nx, ny, t, 0) });
  }
  // Continue to end
  segs.push({ kind: 'LineTo', to: ptAt(from, tx, ty, nx, ny, length, 0) });

  return segs;
}

// ── Helper ──

function ptAt(
  origin: Vec2, tx: number, ty: number, nx: number, ny: number,
  along: number, perp: number,
): Vec2 {
  return v2(
    origin.x + tx * along + nx * perp,
    origin.y + ty * along + ny * perp,
  );
}
