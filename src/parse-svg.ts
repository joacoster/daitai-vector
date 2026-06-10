/**
 * SVG path d-sträng → daitai-vector Segment[]
 * 
 * Parsear legacy SVG path-kommandon till algebraiska segment.
 * Stödjer: M, L, H, V, C, S, Q, T, A, Z (absoluta och relativa)
 */

import type { Segment } from './types';
import { v2 } from './types';

export function parseSvgPath(d: string): Segment[] {
  const segments: Segment[] = [];
  const tokens = tokenize(d);
  let i = 0;
  let cx = 0, cy = 0; // current point
  let sx = 0, sy = 0; // subpath start
  let lastC2x = 0, lastC2y = 0; // last cubic control point
  let lastCmd = '';

  function num(): number {
    if (i >= tokens.length) return 0;
    return parseFloat(tokens[i++]);
  }

  while (i < tokens.length) {
    let cmd = tokens[i];
    if (/[a-zA-Z]/.test(cmd)) {
      i++;
    } else {
      // Implicit repetition av föregående kommando
      cmd = lastCmd;
    }

    const abs = cmd === cmd.toUpperCase();
    const c = cmd.toUpperCase();

    switch (c) {
      case 'M': {
        const x = num(), y = num();
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'MoveTo', to: v2(px, py) });
        cx = px; cy = py; sx = px; sy = py;
        // Efterföljande koordinater behandlas som LineTo
        lastCmd = abs ? 'L' : 'l';
        break;
      }
      case 'L': {
        const x = num(), y = num();
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'LineTo', to: v2(px, py) });
        cx = px; cy = py;
        lastCmd = cmd;
        break;
      }
      case 'H': {
        const x = num();
        const px = abs ? x : cx + x;
        segments.push({ kind: 'LineTo', to: v2(px, cy) });
        cx = px;
        lastCmd = cmd;
        break;
      }
      case 'V': {
        const y = num();
        const py = abs ? y : cy + y;
        segments.push({ kind: 'LineTo', to: v2(cx, py) });
        cy = py;
        lastCmd = cmd;
        break;
      }
      case 'C': {
        const x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num();
        const c1x = abs ? x1 : cx + x1, c1y = abs ? y1 : cy + y1;
        const c2x = abs ? x2 : cx + x2, c2y = abs ? y2 : cy + y2;
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'CubicTo', c1: v2(c1x, c1y), c2: v2(c2x, c2y), to: v2(px, py) });
        lastC2x = c2x; lastC2y = c2y;
        cx = px; cy = py;
        lastCmd = cmd;
        break;
      }
      case 'S': {
        const x2 = num(), y2 = num(), x = num(), y = num();
        // Reflektera föregående c2
        const c1x = 2 * cx - lastC2x, c1y = 2 * cy - lastC2y;
        const c2x = abs ? x2 : cx + x2, c2y = abs ? y2 : cy + y2;
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'CubicTo', c1: v2(c1x, c1y), c2: v2(c2x, c2y), to: v2(px, py) });
        lastC2x = c2x; lastC2y = c2y;
        cx = px; cy = py;
        lastCmd = cmd;
        break;
      }
      case 'Q': {
        const x1 = num(), y1 = num(), x = num(), y = num();
        const qx = abs ? x1 : cx + x1, qy = abs ? y1 : cy + y1;
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'QuadTo', c: v2(qx, qy), to: v2(px, py) });
        lastC2x = qx; lastC2y = qy;
        cx = px; cy = py;
        lastCmd = cmd;
        break;
      }
      case 'T': {
        const x = num(), y = num();
        const qx = 2 * cx - lastC2x, qy = 2 * cy - lastC2y;
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'QuadTo', c: v2(qx, qy), to: v2(px, py) });
        lastC2x = qx; lastC2y = qy;
        cx = px; cy = py;
        lastCmd = cmd;
        break;
      }
      case 'A': {
        const rx = num(), ry = num(), rot = num(), large = num() !== 0, sweep = num() !== 0;
        const x = num(), y = num();
        const px = abs ? x : cx + x, py = abs ? y : cy + y;
        segments.push({ kind: 'ArcTo', rx, ry, rotation: rot, large, sweep, to: v2(px, py) });
        cx = px; cy = py;
        lastCmd = cmd;
        break;
      }
      case 'Z':
        segments.push({ kind: 'Close' });
        cx = sx; cy = sy;
        lastCmd = cmd;
        break;

      default:
        i++; // skip unknown
        break;
    }
  }

  return segments;
}

// ── Tokenizer ──

function tokenize(d: string): string[] {
  const tokens: string[] = [];
  const re = /([a-zA-Z])|([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(d)) !== null) {
    tokens.push(m[0]);
  }
  return tokens;
}
