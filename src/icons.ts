/**
 * daitai-vector Icon Library
 * 
 * Algebraiska ikoner — inga SVG-strängar.
 * Varje ikon är en ren funktion: () → VTree
 * Kompileras till SVG/Canvas/CommandBuffer vid render.
 */

import { v2, path, canvas, leaf, node, group, circle as vCircle } from './types';
import type { VTree, Color, StrokeStyle } from './types';

// ── Ikon-konfiguration ──

export interface IconConfig {
  readonly size?: number;       // default 24
  readonly color?: Color;       // default currentColor (handled by compiler)
  readonly strokeWidth?: number; // default 2
}

const defaultStroke = (cfg?: IconConfig): StrokeStyle => ({
  color: cfg?.color ?? { r: 0.15, g: 0.45, b: 0.85, a: 1 },  // daitai blue — visible on light/dark
  width: cfg?.strokeWidth ?? 2,
  cap: 'round',
  join: 'round',
});

const S = (cfg?: IconConfig) => ({ stroke: defaultStroke(cfg), fill: { kind: 'None' as const } });
const vb = { x: 0, y: 0, w: 24, h: 24 };
const sz = (cfg?: IconConfig) => ({ w: cfg?.size ?? 24, h: cfg?.size ?? 24 });

// ── Ikoner ──

export function iconChevronDown(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(6, 9).lineTo(12, 15).lineTo(18, 9).build(), S(cfg)))
  ], sz(cfg));
}

export function iconChevronRight(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(9, 18).lineTo(15, 12).lineTo(9, 6).build(), S(cfg)))
  ], sz(cfg));
}

export function iconChevronUp(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 15).lineTo(12, 9).lineTo(6, 15).build(), S(cfg)))
  ], sz(cfg));
}

export function iconChevronLeft(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(15, 6).lineTo(9, 12).lineTo(15, 18).build(), S(cfg)))
  ], sz(cfg));
}

export function iconSearch(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(11, 11), 8), S(cfg))),
    leaf(node(path().moveTo(21, 21).lineTo(16.7, 16.7).build(), S(cfg))),
  ], sz(cfg));
}

export function iconFile(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(15, 2).lineTo(6, 2).cubicTo(5.45, 2, 4.98, 2.22, 4.59, 2.59).cubicTo(4.22, 2.98, 4, 3.45, 4, 4).lineTo(4, 20).cubicTo(4, 20.55, 4.22, 21.02, 4.59, 21.41).cubicTo(4.98, 21.78, 5.45, 22, 6, 22).lineTo(18, 22).cubicTo(18.55, 22, 19.02, 21.78, 19.41, 21.41).cubicTo(19.78, 21.02, 20, 20.55, 20, 20).lineTo(20, 7).close().build(), S(cfg))),
    leaf(node(path().moveTo(15, 2).lineTo(15, 6).cubicTo(15, 6.55, 15.22, 7.02, 15.59, 7.41).cubicTo(15.98, 7.78, 16.45, 8, 17, 8).lineTo(20, 8).build(), S(cfg))),
  ], sz(cfg));
}

export function iconFileCode(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(15, 2).lineTo(6, 2).cubicTo(4.9, 2, 4, 2.9, 4, 4).lineTo(4, 20).cubicTo(4, 21.1, 4.9, 22, 6, 22).lineTo(18, 22).cubicTo(19.1, 22, 20, 21.1, 20, 20).lineTo(20, 7).close().build(), S(cfg))),
    leaf(node(path().moveTo(14, 2).lineTo(14, 8).lineTo(20, 8).build(), S(cfg))),
    leaf(node(path().moveTo(10, 12).lineTo(8, 14).lineTo(10, 16).build(), S(cfg))),
    leaf(node(path().moveTo(14, 12).lineTo(16, 14).lineTo(14, 16).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCode(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 16).lineTo(22, 12).lineTo(18, 8).build(), S(cfg))),
    leaf(node(path().moveTo(6, 8).lineTo(2, 12).lineTo(6, 16).build(), S(cfg))),
    leaf(node(path().moveTo(14.5, 4).lineTo(9.5, 20).build(), S(cfg))),
  ], sz(cfg));
}

export function iconFolderOpen(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 20).lineTo(20, 20).cubicTo(21.1, 20, 22, 19.1, 22, 18).lineTo(22, 8).cubicTo(22, 6.9, 21.1, 6, 20, 6).lineTo(12.07, 6).cubicTo(11.45, 6, 10.86, 5.73, 10.41, 5.28).lineTo(9.59, 4.42).cubicTo(9.14, 3.97, 8.55, 3.7, 7.93, 3.7).lineTo(4, 3.7).cubicTo(2.9, 3.7, 2, 4.6, 2, 5.7).lineTo(2, 18).cubicTo(2, 19.1, 2.9, 20, 4, 20).close().build(), S(cfg))),
    leaf(node(path().moveTo(12, 10).lineTo(12, 16).build(), S(cfg))),
    leaf(node(path().moveTo(9, 13).lineTo(12, 10).lineTo(15, 13).build(), S(cfg))),
  ], sz(cfg));
}

export function iconFolder(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 20).lineTo(20, 20).cubicTo(21.1, 20, 22, 19.1, 22, 18).lineTo(22, 8).cubicTo(22, 6.9, 21.1, 6, 20, 6).lineTo(12.07, 6).cubicTo(11.45, 6, 10.86, 5.73, 10.41, 5.28).lineTo(9.59, 4.42).cubicTo(9.14, 3.97, 8.55, 3.7, 7.93, 3.7).lineTo(4, 3.7).cubicTo(2.9, 3.7, 2, 4.6, 2, 5.7).lineTo(2, 18).cubicTo(2, 19.1, 2.9, 20, 4, 20).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconGripVertical(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(9, 5), 1), S(cfg))),
    leaf(node(vCircle(v2(9, 12), 1), S(cfg))),
    leaf(node(vCircle(v2(9, 19), 1), S(cfg))),
    leaf(node(vCircle(v2(15, 5), 1), S(cfg))),
    leaf(node(vCircle(v2(15, 12), 1), S(cfg))),
    leaf(node(vCircle(v2(15, 19), 1), S(cfg))),
  ], sz(cfg));
}

export function iconStats(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(13, 2).lineTo(6, 2).cubicTo(4.9, 2, 4, 2.9, 4, 4).lineTo(4, 20).cubicTo(4, 21.1, 4.9, 22, 6, 22).lineTo(18, 22).cubicTo(19.1, 22, 20, 21.1, 20, 20).lineTo(20, 9).close().build(), S(cfg))),
    leaf(node(path().moveTo(13, 2).lineTo(13, 9).lineTo(20, 9).build(), S(cfg))),
  ], sz(cfg));
}

export function iconPlay(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(6, 4).lineTo(20, 12).lineTo(6, 20).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconStop(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(6, 4).lineTo(18, 4).lineTo(18, 20).lineTo(6, 20).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconPlus(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 5).lineTo(12, 19).build(), S(cfg))),
    leaf(node(path().moveTo(5, 12).lineTo(19, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconMinus(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(5, 12).lineTo(19, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconX(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 6).lineTo(6, 18).build(), S(cfg))),
    leaf(node(path().moveTo(6, 6).lineTo(18, 18).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCheck(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(20, 6).lineTo(9, 17).lineTo(4, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconSettings(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 3), S(cfg))),
    leaf(node(path().moveTo(12, 1).lineTo(12, 3).build(), S(cfg))),
    leaf(node(path().moveTo(12, 21).lineTo(12, 23).build(), S(cfg))),
    leaf(node(path().moveTo(4.22, 4.22).lineTo(5.64, 5.64).build(), S(cfg))),
    leaf(node(path().moveTo(18.36, 18.36).lineTo(19.78, 19.78).build(), S(cfg))),
    leaf(node(path().moveTo(1, 12).lineTo(3, 12).build(), S(cfg))),
    leaf(node(path().moveTo(21, 12).lineTo(23, 12).build(), S(cfg))),
    leaf(node(path().moveTo(4.22, 19.78).lineTo(5.64, 18.36).build(), S(cfg))),
    leaf(node(path().moveTo(18.36, 5.64).lineTo(19.78, 4.22).build(), S(cfg))),
  ], sz(cfg));
}

export function iconTrash(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(3, 6).lineTo(21, 6).build(), S(cfg))),
    leaf(node(path().moveTo(19, 6).lineTo(19, 20).cubicTo(19, 21.1, 18.1, 22, 17, 22).lineTo(7, 22).cubicTo(5.9, 22, 5, 21.1, 5, 20).lineTo(5, 6).build(), S(cfg))),
    leaf(node(path().moveTo(8, 6).lineTo(8, 4).cubicTo(8, 2.9, 8.9, 2, 10, 2).lineTo(14, 2).cubicTo(15.1, 2, 16, 2.9, 16, 4).lineTo(16, 6).build(), S(cfg))),
  ], sz(cfg));
}

export function iconRefresh(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(1, 4).lineTo(1, 10).lineTo(7, 10).build(), S(cfg))),
    leaf(node(path().moveTo(23, 20).lineTo(23, 14).lineTo(17, 14).build(), S(cfg))),
    leaf(node(path().moveTo(3.51, 9).cubicTo(4.01, 7.56, 4.99, 6.31, 6.29, 5.41).cubicTo(7.6, 4.51, 9.13, 4.01, 10.7, 3.97).cubicTo(12.27, 3.93, 13.82, 4.35, 15.16, 5.19).cubicTo(16.5, 6.03, 17.55, 7.26, 18.13, 8.71).lineTo(23, 14).build(), S(cfg))),
    leaf(node(path().moveTo(20.49, 15).cubicTo(19.99, 16.44, 19.01, 17.69, 17.71, 18.59).cubicTo(16.4, 19.49, 14.87, 19.99, 13.3, 20.03).cubicTo(11.73, 20.07, 10.18, 19.65, 8.84, 18.81).cubicTo(7.5, 17.97, 6.45, 16.74, 5.87, 15.29).lineTo(1, 10).build(), S(cfg))),
  ], sz(cfg));
}

export function iconMaximize(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(8, 3).lineTo(5, 3).cubicTo(3.9, 3, 3, 3.9, 3, 5).lineTo(3, 8).build(), S(cfg))),
    leaf(node(path().moveTo(21, 8).lineTo(21, 5).cubicTo(21, 3.9, 20.1, 3, 19, 3).lineTo(16, 3).build(), S(cfg))),
    leaf(node(path().moveTo(3, 16).lineTo(3, 19).cubicTo(3, 20.1, 3.9, 21, 5, 21).lineTo(8, 21).build(), S(cfg))),
    leaf(node(path().moveTo(16, 21).lineTo(19, 21).cubicTo(20.1, 21, 21, 20.1, 21, 19).lineTo(21, 16).build(), S(cfg))),
  ], sz(cfg));
}

export function iconMinimize(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 14).lineTo(10, 14).lineTo(10, 20).build(), S(cfg))),
    leaf(node(path().moveTo(20, 10).lineTo(14, 10).lineTo(14, 4).build(), S(cfg))),
    leaf(node(path().moveTo(14, 10).lineTo(21, 3).build(), S(cfg))),
    leaf(node(path().moveTo(3, 21).lineTo(10, 14).build(), S(cfg))),
  ], sz(cfg));
}

export function iconSend(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(22, 2).lineTo(11, 13).build(), S(cfg))),
    leaf(node(path().moveTo(22, 2).lineTo(15, 22).lineTo(11, 13).lineTo(2, 9).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconWarning(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(10.29, 3.86).lineTo(1.82, 18).cubicTo(1.36, 18.78, 1.36, 19.78, 1.82, 20.5).cubicTo(2.28, 21.22, 3.06, 21.64, 3.92, 21.64).lineTo(20.85, 21.64).cubicTo(21.71, 21.64, 22.49, 21.22, 22.95, 20.5).cubicTo(23.41, 19.78, 23.41, 18.78, 22.95, 18).lineTo(14.48, 3.86).cubicTo(14.02, 3.14, 13.24, 2.72, 12.38, 2.72).cubicTo(11.52, 2.72, 10.74, 3.14, 10.29, 3.86).close().build(), S(cfg))),
    leaf(node(path().moveTo(12, 9).lineTo(12, 13).build(), S(cfg))),
    leaf(node(path().moveTo(12, 17).lineTo(12.01, 17).build(), S(cfg))),
  ], sz(cfg));
}

export function iconInfo(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 10), S(cfg))),
    leaf(node(path().moveTo(12, 16).lineTo(12, 12).build(), S(cfg))),
    leaf(node(path().moveTo(12, 8).lineTo(12.01, 8).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCopy(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(16, 4).lineTo(16, 2).cubicTo(16, 2, 14, 2, 14, 2).lineTo(4, 2).cubicTo(2.9, 2, 2, 2.9, 2, 4).lineTo(2, 14).cubicTo(2, 14, 2, 16, 4, 16).build(), S(cfg))),
    leaf(node(path().moveTo(8, 8).lineTo(20, 8).cubicTo(21.1, 8, 22, 8.9, 22, 10).lineTo(22, 20).cubicTo(22, 21.1, 21.1, 22, 20, 22).lineTo(10, 22).cubicTo(8.9, 22, 8, 21.1, 8, 20).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconDownload(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(21, 15).lineTo(21, 19).cubicTo(21, 20.1, 20.1, 21, 19, 21).lineTo(5, 21).cubicTo(3.9, 21, 3, 20.1, 3, 19).lineTo(3, 15).build(), S(cfg))),
    leaf(node(path().moveTo(7, 10).lineTo(12, 15).lineTo(17, 10).build(), S(cfg))),
    leaf(node(path().moveTo(12, 15).lineTo(12, 3).build(), S(cfg))),
  ], sz(cfg));
}

export function iconUpload(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(21, 15).lineTo(21, 19).cubicTo(21, 20.1, 20.1, 21, 19, 21).lineTo(5, 21).cubicTo(3.9, 21, 3, 20.1, 3, 19).lineTo(3, 15).build(), S(cfg))),
    leaf(node(path().moveTo(17, 8).lineTo(12, 3).lineTo(7, 8).build(), S(cfg))),
    leaf(node(path().moveTo(12, 3).lineTo(12, 15).build(), S(cfg))),
  ], sz(cfg));
}

export function iconEye(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(1, 12).cubicTo(1, 12, 5, 4, 12, 4).cubicTo(19, 4, 23, 12, 23, 12).cubicTo(23, 12, 19, 20, 12, 20).cubicTo(5, 20, 1, 12, 1, 12).close().build(), S(cfg))),
    leaf(node(vCircle(v2(12, 12), 3), S(cfg))),
  ], sz(cfg));
}

export function iconExternalLink(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 13).lineTo(18, 19).cubicTo(18, 20.1, 17.1, 21, 16, 21).lineTo(5, 21).cubicTo(3.9, 21, 3, 20.1, 3, 19).lineTo(3, 8).cubicTo(3, 6.9, 3.9, 6, 5, 6).lineTo(11, 6).build(), S(cfg))),
    leaf(node(path().moveTo(15, 3).lineTo(21, 3).lineTo(21, 9).build(), S(cfg))),
    leaf(node(path().moveTo(10, 14).lineTo(21, 3).build(), S(cfg))),
  ], sz(cfg));
}

// ── Nya ikoner (batch 2) ──

export function iconArrowUp(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 19).lineTo(12, 5).build(), S(cfg))),
    leaf(node(path().moveTo(5, 12).lineTo(12, 5).lineTo(19, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconArrowDown(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 5).lineTo(12, 19).build(), S(cfg))),
    leaf(node(path().moveTo(5, 12).lineTo(12, 19).lineTo(19, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconArrowLeft(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 12).lineTo(5, 12).build(), S(cfg))),
    leaf(node(path().moveTo(12, 19).lineTo(5, 12).lineTo(12, 5).build(), S(cfg))),
  ], sz(cfg));
}

export function iconArrowRight(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(5, 12).lineTo(19, 12).build(), S(cfg))),
    leaf(node(path().moveTo(12, 5).lineTo(19, 12).lineTo(12, 19).build(), S(cfg))),
  ], sz(cfg));
}

export function iconHome(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(3, 9).lineTo(12, 2).lineTo(21, 9).lineTo(21, 20).cubicTo(21, 21.1, 20.1, 22, 19, 22).lineTo(5, 22).cubicTo(3.9, 22, 3, 21.1, 3, 20).close().build(), S(cfg))),
    leaf(node(path().moveTo(9, 22).lineTo(9, 12).lineTo(15, 12).lineTo(15, 22).build(), S(cfg))),
  ], sz(cfg));
}

export function iconMenu(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(3, 12).lineTo(21, 12).build(), S(cfg))),
    leaf(node(path().moveTo(3, 6).lineTo(21, 6).build(), S(cfg))),
    leaf(node(path().moveTo(3, 18).lineTo(21, 18).build(), S(cfg))),
  ], sz(cfg));
}

export function iconHeart(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(20.84, 4.61).cubicTo(20.33, 4.1, 19.72, 3.7, 19.05, 3.44).cubicTo(18.37, 3.18, 17.65, 3.04, 16.92, 3.04).cubicTo(16.19, 3.04, 15.47, 3.18, 14.8, 3.44).cubicTo(14.12, 3.7, 13.52, 4.1, 13, 4.61).lineTo(12, 5.67).lineTo(11, 4.61).cubicTo(9.95, 3.56, 8.55, 2.98, 7.08, 2.98).cubicTo(5.61, 2.98, 4.21, 3.56, 3.16, 4.61).cubicTo(2.11, 5.66, 1.53, 7.06, 1.53, 8.53).cubicTo(1.53, 10, 2.11, 11.4, 3.16, 12.45).lineTo(12, 21.35).lineTo(20.84, 12.45).cubicTo(21.35, 11.94, 21.75, 11.33, 22.01, 10.66).cubicTo(22.27, 9.98, 22.41, 9.26, 22.41, 8.53).cubicTo(22.41, 7.8, 22.27, 7.08, 22.01, 6.4).cubicTo(21.75, 5.73, 21.35, 5.12, 20.84, 4.61).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconStar(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 2).lineTo(15.09, 8.26).lineTo(22, 9.27).lineTo(17, 14.14).lineTo(18.18, 21.02).lineTo(12, 17.77).lineTo(5.82, 21.02).lineTo(7, 14.14).lineTo(2, 9.27).lineTo(8.91, 8.26).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconBell(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 8).cubicTo(18, 6.41, 17.37, 4.88, 16.24, 3.76).cubicTo(15.12, 2.63, 13.59, 2, 12, 2).cubicTo(10.41, 2, 8.88, 2.63, 7.76, 3.76).cubicTo(6.63, 4.88, 6, 6.41, 6, 8).cubicTo(6, 15, 3, 17, 3, 17).lineTo(21, 17).cubicTo(21, 17, 18, 15, 18, 8).close().build(), S(cfg))),
    leaf(node(path().moveTo(13.73, 21).cubicTo(13.55, 21.34, 13.27, 21.63, 12.92, 21.83).cubicTo(12.57, 22.02, 12.17, 22.12, 11.77, 22.12).cubicTo(11.36, 22.12, 10.97, 22.02, 10.62, 21.83).cubicTo(10.27, 21.63, 9.99, 21.34, 9.81, 21).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCalendar(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 4).lineTo(5, 4).cubicTo(3.9, 4, 3, 4.9, 3, 6).lineTo(3, 20).cubicTo(3, 21.1, 3.9, 22, 5, 22).lineTo(19, 22).cubicTo(20.1, 22, 21, 21.1, 21, 20).lineTo(21, 6).cubicTo(21, 4.9, 20.1, 4, 19, 4).close().build(), S(cfg))),
    leaf(node(path().moveTo(16, 2).lineTo(16, 6).build(), S(cfg))),
    leaf(node(path().moveTo(8, 2).lineTo(8, 6).build(), S(cfg))),
    leaf(node(path().moveTo(3, 10).lineTo(21, 10).build(), S(cfg))),
  ], sz(cfg));
}

export function iconLock(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 11).lineTo(5, 11).cubicTo(3.9, 11, 3, 11.9, 3, 13).lineTo(3, 20).cubicTo(3, 21.1, 3.9, 22, 5, 22).lineTo(19, 22).cubicTo(20.1, 22, 21, 21.1, 21, 20).lineTo(21, 13).cubicTo(21, 11.9, 20.1, 11, 19, 11).close().build(), S(cfg))),
    leaf(node(path().moveTo(7, 11).lineTo(7, 7).cubicTo(7, 5.67, 7.53, 4.4, 8.46, 3.46).cubicTo(9.4, 2.53, 10.67, 2, 12, 2).cubicTo(13.33, 2, 14.6, 2.53, 15.54, 3.46).cubicTo(16.47, 4.4, 17, 5.67, 17, 7).lineTo(17, 11).build(), S(cfg))),
  ], sz(cfg));
}

export function iconUnlock(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 11).lineTo(5, 11).cubicTo(3.9, 11, 3, 11.9, 3, 13).lineTo(3, 20).cubicTo(3, 21.1, 3.9, 22, 5, 22).lineTo(19, 22).cubicTo(20.1, 22, 21, 21.1, 21, 20).lineTo(21, 13).cubicTo(21, 11.9, 20.1, 11, 19, 11).close().build(), S(cfg))),
    leaf(node(path().moveTo(7, 11).lineTo(7, 7).cubicTo(7, 5.67, 7.53, 4.4, 8.46, 3.46).cubicTo(9.4, 2.53, 10.67, 2, 12, 2).cubicTo(13.33, 2, 14.6, 2.53, 15.54, 3.46).cubicTo(16.47, 4.4, 17, 5.67, 17, 7).build(), S(cfg))),
  ], sz(cfg));
}

export function iconUser(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(20, 21).lineTo(20, 19).cubicTo(20, 17.94, 19.58, 16.92, 18.83, 16.17).cubicTo(18.08, 15.42, 17.06, 15, 16, 15).lineTo(8, 15).cubicTo(6.94, 15, 5.92, 15.42, 5.17, 16.17).cubicTo(4.42, 16.92, 4, 17.94, 4, 19).lineTo(4, 21).build(), S(cfg))),
    leaf(node(vCircle(v2(12, 7), 4), S(cfg))),
  ], sz(cfg));
}

export function iconUsers(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(17, 21).lineTo(17, 19).cubicTo(17, 17.94, 16.58, 16.92, 15.83, 16.17).cubicTo(15.08, 15.42, 14.06, 15, 13, 15).lineTo(5, 15).cubicTo(3.94, 15, 2.92, 15.42, 2.17, 16.17).cubicTo(1.42, 16.92, 1, 17.94, 1, 19).lineTo(1, 21).build(), S(cfg))),
    leaf(node(vCircle(v2(9, 7), 4), S(cfg))),
    leaf(node(path().moveTo(23, 21).lineTo(23, 19).cubicTo(23, 18.15, 22.67, 17.35, 22.08, 16.76).cubicTo(21.49, 16.18, 20.7, 15.86, 19.85, 15.81).build(), S(cfg))),
    leaf(node(path().moveTo(16, 3.13).cubicTo(16.85, 3.38, 17.58, 3.94, 18.06, 4.71).cubicTo(18.55, 5.47, 18.76, 6.39, 18.64, 7.29).cubicTo(18.52, 8.19, 18.09, 9.02, 17.43, 9.62).cubicTo(16.76, 10.22, 15.91, 10.57, 15.02, 10.6).build(), S(cfg))),
  ], sz(cfg));
}

export function iconMail(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(20, 4).lineTo(4, 4).cubicTo(2.9, 4, 2, 4.9, 2, 6).lineTo(2, 18).cubicTo(2, 19.1, 2.9, 20, 4, 20).lineTo(20, 20).cubicTo(21.1, 20, 22, 19.1, 22, 18).lineTo(22, 6).cubicTo(22, 4.9, 21.1, 4, 20, 4).close().build(), S(cfg))),
    leaf(node(path().moveTo(22, 6).lineTo(12, 13).lineTo(2, 6).build(), S(cfg))),
  ], sz(cfg));
}

export function iconPhone(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(22, 16.92).lineTo(22, 19.92).cubicTo(22, 20.48, 21.78, 21.01, 21.39, 21.4).cubicTo(21, 21.79, 20.47, 22, 19.91, 22).cubicTo(16.74, 21.66, 13.7, 20.56, 11, 18.78).cubicTo(8.5, 17.17, 6.39, 15.06, 4.78, 12.56).cubicTo(3, 9.85, 1.9, 6.81, 1.56, 3.63).cubicTo(1.56, 3.07, 1.77, 2.53, 2.16, 2.14).cubicTo(2.55, 1.74, 3.08, 1.53, 3.64, 1.53).lineTo(6.64, 1.53).cubicTo(7.21, 1.53, 7.75, 1.77, 8.13, 2.19).cubicTo(8.52, 2.62, 8.71, 3.18, 8.67, 3.75).cubicTo(8.59, 4.87, 8.67, 5.99, 8.91, 7.09).cubicTo(9.01, 7.52, 8.95, 7.97, 8.75, 8.36).lineTo(7.39, 11.01).cubicTo(8.87, 13.89, 11.22, 16.24, 14.1, 17.72).lineTo(16.75, 16.36).cubicTo(17.14, 16.16, 17.59, 16.1, 18.02, 16.2).cubicTo(19.12, 16.44, 20.24, 16.52, 21.36, 16.44).cubicTo(21.93, 16.4, 22.48, 16.59, 22, 16.92).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconFilter(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(22, 3).lineTo(2, 3).lineTo(10, 12.46).lineTo(10, 19).lineTo(14, 21).lineTo(14, 12.46).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconEdit(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(11, 4).lineTo(4, 4).cubicTo(2.9, 4, 2, 4.9, 2, 6).lineTo(2, 20).cubicTo(2, 21.1, 2.9, 22, 4, 22).lineTo(18, 22).cubicTo(19.1, 22, 20, 21.1, 20, 20).lineTo(20, 13).build(), S(cfg))),
    leaf(node(path().moveTo(18.5, 2.5).cubicTo(19.33, 1.67, 20.67, 1.67, 21.5, 2.5).cubicTo(22.33, 3.33, 22.33, 4.67, 21.5, 5.5).lineTo(12, 15).lineTo(8, 16).lineTo(9, 12).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconSave(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 21).lineTo(5, 21).cubicTo(3.9, 21, 3, 20.1, 3, 19).lineTo(3, 5).cubicTo(3, 3.9, 3.9, 3, 5, 3).lineTo(16, 3).lineTo(21, 8).lineTo(21, 19).cubicTo(21, 20.1, 20.1, 21, 19, 21).close().build(), S(cfg))),
    leaf(node(path().moveTo(17, 21).lineTo(17, 13).lineTo(7, 13).lineTo(7, 21).build(), S(cfg))),
    leaf(node(path().moveTo(7, 3).lineTo(7, 8).lineTo(15, 8).build(), S(cfg))),
  ], sz(cfg));
}

export function iconTerminal(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 17).lineTo(10, 11).lineTo(4, 5).build(), S(cfg))),
    leaf(node(path().moveTo(12, 19).lineTo(20, 19).build(), S(cfg))),
  ], sz(cfg));
}

export function iconLayers(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 2).lineTo(2, 7).lineTo(12, 12).lineTo(22, 7).close().build(), S(cfg))),
    leaf(node(path().moveTo(2, 17).lineTo(12, 22).lineTo(22, 17).build(), S(cfg))),
    leaf(node(path().moveTo(2, 12).lineTo(12, 17).lineTo(22, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconZap(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(13, 2).lineTo(3, 14).lineTo(12, 14).lineTo(11, 22).lineTo(21, 10).lineTo(12, 10).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconGlobe(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 10), S(cfg))),
    leaf(node(path().moveTo(2, 12).lineTo(22, 12).build(), S(cfg))),
    leaf(node(path().moveTo(12, 2).cubicTo(14.5, 4.73, 16, 8.24, 16, 12).cubicTo(16, 15.76, 14.5, 19.27, 12, 22).build(), S(cfg))),
    leaf(node(path().moveTo(12, 2).cubicTo(9.5, 4.73, 8, 8.24, 8, 12).cubicTo(8, 15.76, 9.5, 19.27, 12, 22).build(), S(cfg))),
  ], sz(cfg));
}

export function iconDatabase(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 6).cubicTo(17.52, 6, 22, 4.66, 22, 3).cubicTo(22, 1.34, 17.52, 0, 12, 0).cubicTo(6.48, 0, 2, 1.34, 2, 3).cubicTo(2, 4.66, 6.48, 6, 12, 6).close().build(), S(cfg))),
    leaf(node(path().moveTo(2, 3).lineTo(2, 12).cubicTo(2, 13.66, 6.48, 15, 12, 15).cubicTo(17.52, 15, 22, 13.66, 22, 12).lineTo(22, 3).build(), S(cfg))),
    leaf(node(path().moveTo(2, 12).lineTo(2, 21).cubicTo(2, 22.66, 6.48, 24, 12, 24).cubicTo(17.52, 24, 22, 22.66, 22, 21).lineTo(22, 12).build(), S(cfg))),
  ], sz(cfg));
}

// ── Nya ikoner (batch 3) ──

export function iconClipboard(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(16, 4).lineTo(18, 4).cubicTo(19.1, 4, 20, 4.9, 20, 6).lineTo(20, 20).cubicTo(20, 21.1, 19.1, 22, 18, 22).lineTo(6, 22).cubicTo(4.9, 22, 4, 21.1, 4, 20).lineTo(4, 6).cubicTo(4, 4.9, 4.9, 4, 6, 4).lineTo(8, 4).build(), S(cfg))),
    leaf(node(path().moveTo(15, 2).lineTo(9, 2).cubicTo(8.45, 2, 8, 2.45, 8, 3).lineTo(8, 5).cubicTo(8, 5.55, 8.45, 6, 9, 6).lineTo(15, 6).cubicTo(15.55, 6, 16, 5.55, 16, 5).lineTo(16, 3).cubicTo(16, 2.45, 15.55, 2, 15, 2).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconImage(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 3).lineTo(5, 3).cubicTo(3.9, 3, 3, 3.9, 3, 5).lineTo(3, 19).cubicTo(3, 20.1, 3.9, 21, 5, 21).lineTo(19, 21).cubicTo(20.1, 21, 21, 20.1, 21, 19).lineTo(21, 5).cubicTo(21, 3.9, 20.1, 3, 19, 3).close().build(), S(cfg))),
    leaf(node(vCircle(v2(8.5, 8.5), 1.5), S(cfg))),
    leaf(node(path().moveTo(21, 15).lineTo(16, 10).lineTo(5, 21).build(), S(cfg))),
  ], sz(cfg));
}

export function iconLink(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(10, 13).cubicTo(10.87, 14.15, 12.18, 14.85, 13.62, 14.85).cubicTo(15.07, 14.85, 16.38, 14.15, 17.24, 13).lineTo(19.24, 11).cubicTo(21.17, 9.07, 21.17, 5.93, 19.24, 4).cubicTo(17.31, 2.07, 14.17, 2.07, 12.24, 4).lineTo(10.74, 5.5).build(), S(cfg))),
    leaf(node(path().moveTo(14, 11).cubicTo(13.13, 9.85, 11.82, 9.15, 10.38, 9.15).cubicTo(8.93, 9.15, 7.62, 9.85, 6.76, 11).lineTo(4.76, 13).cubicTo(2.83, 14.93, 2.83, 18.07, 4.76, 20).cubicTo(6.69, 21.93, 9.83, 21.93, 11.76, 20).lineTo(13.26, 18.5).build(), S(cfg))),
  ], sz(cfg));
}

export function iconBookmark(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 21).lineTo(12, 16).lineTo(5, 21).lineTo(5, 5).cubicTo(5, 3.9, 5.9, 3, 7, 3).lineTo(17, 3).cubicTo(18.1, 3, 19, 3.9, 19, 5).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconTag(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(20.59, 13.41).lineTo(13.42, 20.58).cubicTo(13.04, 20.96, 12.53, 21.18, 12, 21.18).cubicTo(11.47, 21.18, 10.96, 20.96, 10.59, 20.58).lineTo(2, 12).lineTo(2, 2).lineTo(12, 2).close().build(), S(cfg))),
    leaf(node(path().moveTo(7, 7).lineTo(7.01, 7).build(), S(cfg))),
  ], sz(cfg));
}

export function iconClock(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 10), S(cfg))),
    leaf(node(path().moveTo(12, 6).lineTo(12, 12).lineTo(16, 14).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCloud(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 10).lineTo(18, 10).cubicTo(19.93, 10, 21.5, 11.57, 21.5, 13.5).cubicTo(21.5, 15.43, 19.93, 17, 18, 17).lineTo(6.5, 17).cubicTo(4.01, 17, 2, 14.99, 2, 12.5).cubicTo(2, 10.01, 4.01, 8, 6.5, 8).cubicTo(6.52, 8, 6.53, 8, 6.55, 8).cubicTo(7.33, 5.67, 9.43, 4, 12, 4).cubicTo(15.04, 4, 17.5, 6.46, 18, 9.5).build(), S(cfg))),
  ], sz(cfg));
}

export function iconWifi(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(5, 12.55).cubicTo(7.09, 10.46, 9.46, 9.37, 12, 9.37).cubicTo(14.54, 9.37, 16.91, 10.46, 19, 12.55).build(), S(cfg))),
    leaf(node(path().moveTo(8.53, 16.11).cubicTo(9.57, 15.07, 10.74, 14.55, 12, 14.55).cubicTo(13.26, 14.55, 14.43, 15.07, 15.47, 16.11).build(), S(cfg))),
    leaf(node(path().moveTo(1.5, 9).cubicTo(4.35, 6.15, 8.03, 4.72, 12, 4.72).cubicTo(15.97, 4.72, 19.65, 6.15, 22.5, 9).build(), S(cfg))),
    leaf(node(path().moveTo(12, 20).lineTo(12.01, 20).build(), S(cfg))),
  ], sz(cfg));
}

export function iconBattery(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(17, 6).lineTo(5, 6).cubicTo(3.9, 6, 3, 6.9, 3, 8).lineTo(3, 16).cubicTo(3, 17.1, 3.9, 18, 5, 18).lineTo(17, 18).cubicTo(18.1, 18, 19, 17.1, 19, 16).lineTo(19, 8).cubicTo(19, 6.9, 18.1, 6, 17, 6).close().build(), S(cfg))),
    leaf(node(path().moveTo(22, 11).lineTo(22, 13).build(), S(cfg))),
  ], sz(cfg));
}

export function iconShield(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 22).cubicTo(12, 22, 20, 18, 20, 12).lineTo(20, 5).lineTo(12, 2).lineTo(4, 5).lineTo(4, 12).cubicTo(4, 18, 12, 22, 12, 22).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconFlag(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 15).cubicTo(4, 15, 5, 14, 8, 14).cubicTo(11, 14, 13, 16, 16, 16).cubicTo(19, 16, 20, 15, 20, 15).lineTo(20, 3).cubicTo(20, 3, 19, 4, 16, 4).cubicTo(13, 4, 11, 2, 8, 2).cubicTo(5, 2, 4, 3, 4, 3).close().build(), S(cfg))),
    leaf(node(path().moveTo(4, 22).lineTo(4, 15).build(), S(cfg))),
  ], sz(cfg));
}

export function iconPaperclip(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(21.44, 11.05).lineTo(12.25, 20.24).cubicTo(10.84, 21.65, 8.85, 22.44, 6.78, 22.44).cubicTo(4.71, 22.44, 2.72, 21.65, 1.31, 20.24).cubicTo(-0.1, 18.83, -0.1, 16.84, 1.31, 15.43).cubicTo(2.72, 14.02, 4.71, 13.23, 6.78, 13.23).lineTo(15.97, 4.04).cubicTo(16.91, 3.1, 18.17, 2.56, 19.49, 2.56).cubicTo(20.81, 2.56, 22.07, 3.1, 23.01, 4.04).build(), S(cfg))),
  ], sz(cfg));
}

export function iconHash(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 9).lineTo(20, 9).build(), S(cfg))),
    leaf(node(path().moveTo(4, 15).lineTo(20, 15).build(), S(cfg))),
    leaf(node(path().moveTo(10, 3).lineTo(8, 21).build(), S(cfg))),
    leaf(node(path().moveTo(16, 3).lineTo(14, 21).build(), S(cfg))),
  ], sz(cfg));
}

export function iconSliders(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(4, 21).lineTo(4, 14).build(), S(cfg))),
    leaf(node(path().moveTo(4, 10).lineTo(4, 3).build(), S(cfg))),
    leaf(node(path().moveTo(12, 21).lineTo(12, 12).build(), S(cfg))),
    leaf(node(path().moveTo(12, 8).lineTo(12, 3).build(), S(cfg))),
    leaf(node(path().moveTo(20, 21).lineTo(20, 16).build(), S(cfg))),
    leaf(node(path().moveTo(20, 12).lineTo(20, 3).build(), S(cfg))),
    leaf(node(path().moveTo(1, 14).lineTo(7, 14).build(), S(cfg))),
    leaf(node(path().moveTo(9, 8).lineTo(15, 8).build(), S(cfg))),
    leaf(node(path().moveTo(17, 16).lineTo(23, 16).build(), S(cfg))),
  ], sz(cfg));
}

export function iconActivity(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(22, 12).lineTo(18, 12).lineTo(15, 21).lineTo(9, 3).lineTo(6, 12).lineTo(2, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconBarChart(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(12, 20).lineTo(12, 10).build(), S(cfg))),
    leaf(node(path().moveTo(18, 20).lineTo(18, 4).build(), S(cfg))),
    leaf(node(path().moveTo(6, 20).lineTo(6, 16).build(), S(cfg))),
  ], sz(cfg));
}

export function iconPieChart(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(21.21, 15.89).cubicTo(20.12, 18.25, 18.24, 20.14, 15.89, 21.22).cubicTo(13.53, 22.31, 10.91, 22.54, 8.42, 21.87).cubicTo(5.92, 21.21, 3.73, 19.69, 2.22, 17.56).cubicTo(0.7, 15.43, -0.03, 12.86, 0.05, 10.24).cubicTo(0.13, 7.62, 1.01, 5.1, 2.64, 3.07).cubicTo(4.27, 1.04, 6.56, -0.34, 9.1, -0.85).cubicTo(11.63, -1.37, 14.27, -0.98, 16.56, 0.26).build(), S(cfg))),
    leaf(node(path().moveTo(22, 12).lineTo(12, 12).lineTo(12, 2).build(), S(cfg))),
  ], sz(cfg));
}

export function iconTarget(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 10), S(cfg))),
    leaf(node(vCircle(v2(12, 12), 6), S(cfg))),
    leaf(node(vCircle(v2(12, 12), 2), S(cfg))),
  ], sz(cfg));
}

export function iconAperture(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 10), S(cfg))),
    leaf(node(path().moveTo(14.31, 8).lineTo(20.05, 17.94).build(), S(cfg))),
    leaf(node(path().moveTo(9.69, 8).lineTo(21.17, 8).build(), S(cfg))),
    leaf(node(path().moveTo(7.38, 12).lineTo(13.12, 2.06).build(), S(cfg))),
    leaf(node(path().moveTo(9.69, 16).lineTo(3.95, 6.06).build(), S(cfg))),
    leaf(node(path().moveTo(14.31, 16).lineTo(2.83, 16).build(), S(cfg))),
    leaf(node(path().moveTo(16.62, 12).lineTo(10.88, 21.94).build(), S(cfg))),
  ], sz(cfg));
}

export function iconPackage(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(16.5, 9.4).lineTo(7.55, 4.24).build(), S(cfg))),
    leaf(node(path().moveTo(21, 16).lineTo(21, 8).cubicTo(21, 7.64, 20.87, 7.29, 20.63, 7.01).cubicTo(20.39, 6.73, 20.06, 6.55, 19.7, 6.5).lineTo(12.7, 2.5).cubicTo(12.27, 2.25, 11.73, 2.25, 11.3, 2.5).lineTo(4.3, 6.5).cubicTo(3.94, 6.55, 3.61, 6.73, 3.37, 7.01).cubicTo(3.13, 7.29, 3, 7.64, 3, 8).lineTo(3, 16).cubicTo(3, 16.71, 3.38, 17.37, 4, 17.71).lineTo(11, 21.71).cubicTo(11.62, 22.05, 12.38, 22.05, 13, 21.71).lineTo(20, 17.71).cubicTo(20.62, 17.37, 21, 16.71, 21, 16).close().build(), S(cfg))),
    leaf(node(path().moveTo(3.27, 6.96).lineTo(12, 12.01).lineTo(20.73, 6.96).build(), S(cfg))),
    leaf(node(path().moveTo(12, 22.08).lineTo(12, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCpu(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 4).lineTo(6, 4).cubicTo(4.9, 4, 4, 4.9, 4, 6).lineTo(4, 18).cubicTo(4, 19.1, 4.9, 20, 6, 20).lineTo(18, 20).cubicTo(19.1, 20, 20, 19.1, 20, 18).lineTo(20, 6).cubicTo(20, 4.9, 19.1, 4, 18, 4).close().build(), S(cfg))),
    leaf(node(path().moveTo(15, 9).lineTo(9, 9).lineTo(9, 15).lineTo(15, 15).close().build(), S(cfg))),
    leaf(node(path().moveTo(9, 1).lineTo(9, 4).build(), S(cfg))),
    leaf(node(path().moveTo(15, 1).lineTo(15, 4).build(), S(cfg))),
    leaf(node(path().moveTo(9, 20).lineTo(9, 23).build(), S(cfg))),
    leaf(node(path().moveTo(15, 20).lineTo(15, 23).build(), S(cfg))),
    leaf(node(path().moveTo(20, 9).lineTo(23, 9).build(), S(cfg))),
    leaf(node(path().moveTo(20, 14).lineTo(23, 14).build(), S(cfg))),
    leaf(node(path().moveTo(1, 9).lineTo(4, 9).build(), S(cfg))),
    leaf(node(path().moveTo(1, 14).lineTo(4, 14).build(), S(cfg))),
  ], sz(cfg));
}

export function iconGitBranch(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(6, 3).lineTo(6, 15).build(), S(cfg))),
    leaf(node(vCircle(v2(18, 18), 3), S(cfg))),
    leaf(node(vCircle(v2(6, 18), 3), S(cfg))),
    leaf(node(path().moveTo(18, 15).cubicTo(18, 12, 15, 9, 6, 9).build(), S(cfg))),
  ], sz(cfg));
}

export function iconGitCommit(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(12, 12), 4), S(cfg))),
    leaf(node(path().moveTo(1.05, 12).lineTo(8, 12).build(), S(cfg))),
    leaf(node(path().moveTo(16, 12).lineTo(22.95, 12).build(), S(cfg))),
  ], sz(cfg));
}

export function iconCommand(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(18, 3).cubicTo(19.66, 3, 21, 4.34, 21, 6).cubicTo(21, 7.66, 19.66, 9, 18, 9).lineTo(6, 9).cubicTo(4.34, 9, 3, 7.66, 3, 6).cubicTo(3, 4.34, 4.34, 3, 6, 3).cubicTo(7.66, 3, 9, 4.34, 9, 6).lineTo(9, 18).cubicTo(9, 19.66, 7.66, 21, 6, 21).cubicTo(4.34, 21, 3, 19.66, 3, 18).cubicTo(3, 16.34, 4.34, 15, 6, 15).lineTo(18, 15).cubicTo(19.66, 15, 21, 16.34, 21, 18).cubicTo(21, 19.66, 19.66, 21, 18, 21).cubicTo(16.34, 21, 15, 19.66, 15, 18).lineTo(15, 6).cubicTo(15, 4.34, 16.34, 3, 18, 3).close().build(), S(cfg))),
  ], sz(cfg));
}

export function iconShuffle(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(16, 3).lineTo(21, 3).lineTo(21, 8).build(), S(cfg))),
    leaf(node(path().moveTo(4, 20).lineTo(21, 3).build(), S(cfg))),
    leaf(node(path().moveTo(21, 16).lineTo(21, 21).lineTo(16, 21).build(), S(cfg))),
    leaf(node(path().moveTo(15, 15).lineTo(21, 21).build(), S(cfg))),
    leaf(node(path().moveTo(4, 4).lineTo(9, 9).build(), S(cfg))),
  ], sz(cfg));
}

export function iconRepeat(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(17, 1).lineTo(21, 5).lineTo(17, 9).build(), S(cfg))),
    leaf(node(path().moveTo(3, 11).lineTo(3, 9).cubicTo(3, 7.94, 3.42, 6.92, 4.17, 6.17).cubicTo(4.92, 5.42, 5.94, 5, 7, 5).lineTo(21, 5).build(), S(cfg))),
    leaf(node(path().moveTo(7, 23).lineTo(3, 19).lineTo(7, 15).build(), S(cfg))),
    leaf(node(path().moveTo(21, 13).lineTo(21, 15).cubicTo(21, 16.06, 20.58, 17.08, 19.83, 17.83).cubicTo(19.08, 18.58, 18.06, 19, 17, 19).lineTo(3, 19).build(), S(cfg))),
  ], sz(cfg));
}

export function iconBox(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(21, 16).lineTo(21, 8).cubicTo(21, 7.27, 20.62, 6.59, 20, 6.22).lineTo(13, 2.22).cubicTo(12.38, 1.85, 11.62, 1.85, 11, 2.22).lineTo(4, 6.22).cubicTo(3.38, 6.59, 3, 7.27, 3, 8).lineTo(3, 16).cubicTo(3, 16.73, 3.38, 17.41, 4, 17.78).lineTo(11, 21.78).cubicTo(11.62, 22.15, 12.38, 22.15, 13, 21.78).lineTo(20, 17.78).cubicTo(20.62, 17.41, 21, 16.73, 21, 16).close().build(), S(cfg))),
    leaf(node(path().moveTo(3.27, 6.96).lineTo(12, 12.01).lineTo(20.73, 6.96).build(), S(cfg))),
    leaf(node(path().moveTo(12, 22.08).lineTo(12, 12).build(), S(cfg))),
  ], sz(cfg));
}

// ── Nya ikoner (batch 4: editor actions) ──

export function iconUndo(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(3, 7).lineTo(7, 3).build(), S(cfg))),
    leaf(node(path().moveTo(3, 7).lineTo(7, 11).build(), S(cfg))),
    leaf(node(path().moveTo(3, 7).lineTo(14, 7).cubicTo(17.87, 7, 21, 10.13, 21, 14).cubicTo(21, 17.87, 17.87, 21, 14, 21).lineTo(9, 21).build(), S(cfg))),
  ], sz(cfg));
}

export function iconRedo(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(21, 7).lineTo(17, 3).build(), S(cfg))),
    leaf(node(path().moveTo(21, 7).lineTo(17, 11).build(), S(cfg))),
    leaf(node(path().moveTo(21, 7).lineTo(10, 7).cubicTo(6.13, 7, 3, 10.13, 3, 14).cubicTo(3, 17.87, 6.13, 21, 10, 21).lineTo(15, 21).build(), S(cfg))),
  ], sz(cfg));
}

export function iconZoomIn(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(11, 11), 8), S(cfg))),
    leaf(node(path().moveTo(21, 21).lineTo(16.65, 16.65).build(), S(cfg))),
    leaf(node(path().moveTo(11, 8).lineTo(11, 14).build(), S(cfg))),
    leaf(node(path().moveTo(8, 11).lineTo(14, 11).build(), S(cfg))),
  ], sz(cfg));
}

export function iconZoomOut(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(vCircle(v2(11, 11), 8), S(cfg))),
    leaf(node(path().moveTo(21, 21).lineTo(16.65, 16.65).build(), S(cfg))),
    leaf(node(path().moveTo(8, 11).lineTo(14, 11).build(), S(cfg))),
  ], sz(cfg));
}

export function iconTable(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(3, 3).lineTo(21, 3).cubicTo(21.55, 3, 22, 3.45, 22, 4).lineTo(22, 20).cubicTo(22, 20.55, 21.55, 21, 21, 21).lineTo(3, 21).cubicTo(2.45, 21, 2, 20.55, 2, 20).lineTo(2, 4).cubicTo(2, 3.45, 2.45, 3, 3, 3).close().build(), S(cfg))),
    leaf(node(path().moveTo(2, 9).lineTo(22, 9).build(), S(cfg))),
    leaf(node(path().moveTo(2, 15).lineTo(22, 15).build(), S(cfg))),
    leaf(node(path().moveTo(9, 3).lineTo(9, 21).build(), S(cfg))),
    leaf(node(path().moveTo(15, 3).lineTo(15, 21).build(), S(cfg))),
  ], sz(cfg));
}

export function iconBold(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(6, 4).lineTo(6, 20).build(), S(cfg))),
    leaf(node(path().moveTo(6, 4).lineTo(13, 4).cubicTo(15.21, 4, 17, 5.79, 17, 8).cubicTo(17, 10.21, 15.21, 12, 13, 12).lineTo(6, 12).build(), S(cfg))),
    leaf(node(path().moveTo(6, 12).lineTo(14, 12).cubicTo(16.21, 12, 18, 13.79, 18, 16).cubicTo(18, 18.21, 16.21, 20, 14, 20).lineTo(6, 20).build(), S(cfg))),
  ], sz(cfg));
}

export function iconItalic(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(19, 4).lineTo(10, 4).build(), S(cfg))),
    leaf(node(path().moveTo(14, 20).lineTo(5, 20).build(), S(cfg))),
    leaf(node(path().moveTo(15, 4).lineTo(9, 20).build(), S(cfg))),
  ], sz(cfg));
}

export function iconUnderline(cfg?: IconConfig): VTree {
  return canvas(vb, [
    leaf(node(path().moveTo(6, 3).lineTo(6, 13).cubicTo(6, 16.31, 8.69, 19, 12, 19).cubicTo(15.31, 19, 18, 16.31, 18, 13).lineTo(18, 3).build(), S(cfg))),
    leaf(node(path().moveTo(4, 21).lineTo(20, 21).build(), S(cfg))),
  ], sz(cfg));
}

// ── Ikonregister ──

export const iconRegistry: Record<string, (cfg?: IconConfig) => VTree> = {
  'chevron-down': iconChevronDown,
  'chevron-right': iconChevronRight,
  'chevron-up': iconChevronUp,
  'chevron-left': iconChevronLeft,
  'search': iconSearch,
  'file': iconFile,
  'file-code': iconFileCode,
  'code': iconCode,
  'folder-open': iconFolderOpen,
  'folder': iconFolder,
  'grip-vertical': iconGripVertical,
  'stats': iconStats,
  'play': iconPlay,
  'stop': iconStop,
  'plus': iconPlus,
  'minus': iconMinus,
  'x': iconX,
  'check': iconCheck,
  'settings': iconSettings,
  'trash': iconTrash,
  'refresh': iconRefresh,
  'maximize': iconMaximize,
  'minimize': iconMinimize,
  'send': iconSend,
  'warning': iconWarning,
  'info': iconInfo,
  'copy': iconCopy,
  'download': iconDownload,
  'upload': iconUpload,
  'eye': iconEye,
  'external-link': iconExternalLink,
  'arrow-up': iconArrowUp,
  'arrow-down': iconArrowDown,
  'arrow-left': iconArrowLeft,
  'arrow-right': iconArrowRight,
  'home': iconHome,
  'menu': iconMenu,
  'heart': iconHeart,
  'star': iconStar,
  'bell': iconBell,
  'calendar': iconCalendar,
  'lock': iconLock,
  'unlock': iconUnlock,
  'user': iconUser,
  'users': iconUsers,
  'mail': iconMail,
  'phone': iconPhone,
  'filter': iconFilter,
  'edit': iconEdit,
  'save': iconSave,
  'terminal': iconTerminal,
  'layers': iconLayers,
  'zap': iconZap,
  'globe': iconGlobe,
  'database': iconDatabase,
  // Batch 3
  'clipboard': iconClipboard,
  'image': iconImage,
  'link': iconLink,
  'bookmark': iconBookmark,
  'tag': iconTag,
  'clock': iconClock,
  'cloud': iconCloud,
  'wifi': iconWifi,
  'battery': iconBattery,
  'shield': iconShield,
  'flag': iconFlag,
  'paperclip': iconPaperclip,
  'hash': iconHash,
  'sliders': iconSliders,
  'activity': iconActivity,
  'bar-chart': iconBarChart,
  'pie-chart': iconPieChart,
  'target': iconTarget,
  'aperture': iconAperture,
  'package': iconPackage,
  'cpu': iconCpu,
  'git-branch': iconGitBranch,
  'git-commit': iconGitCommit,
  'command': iconCommand,
  'shuffle': iconShuffle,
  'repeat': iconRepeat,
  'box': iconBox,
  // Batch 4: editor actions
  'undo': iconUndo,
  'redo': iconRedo,
  'zoom-in': iconZoomIn,
  'zoom-out': iconZoomOut,
  'table': iconTable,
  'bold': iconBold,
  'italic': iconItalic,
  'underline': iconUnderline,
};

/** Hämta ikon via namn */
export function icon(name: string, cfg?: IconConfig): VTree | null {
  const fn = iconRegistry[name];
  return fn ? fn(cfg) : null;
}
