/**
 * daitai-vector — Algebraiskt vektorformat
 * 
 * Ersätter SVGs imperativa kommandomodell med algebraiska typer.
 * Geometri är algebra, inte kommandon.
 * 
 * Principer:
 *   - Shapes = produkttyper (Circle, Rect, Path, Text)
 *   - Transforms = komponerbara funktioner (Translate, Scale, Rotate)
 *   - Style = deklarativ pipe (Fill, Stroke, Opacity)
 *   - Path = namngivna kurvsegment (Line, Cubic, Quadratic, Arc)
 *   - Komposition = algebraiska kombinatorer (Group, Clip, Mask)
 *   - Ingen scripting, ingen animation-i-formatet
 */

// ── Primitiva geometrityper ──

export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export interface Size {
  readonly w: number;
  readonly h: number;
}

export interface Color {
  readonly r: number; // 0-255
  readonly g: number;
  readonly b: number;
  readonly a: number; // 0-1
}

// ── Kurvsegment (ersätter SVGs M/L/C/Q/A/Z) ──

export type Segment =
  | { readonly kind: 'MoveTo'; readonly to: Vec2 }
  | { readonly kind: 'LineTo'; readonly to: Vec2 }
  | { readonly kind: 'CubicTo'; readonly c1: Vec2; readonly c2: Vec2; readonly to: Vec2 }
  | { readonly kind: 'QuadTo'; readonly c: Vec2; readonly to: Vec2 }
  | { readonly kind: 'ArcTo'; readonly rx: number; readonly ry: number; readonly rotation: number; readonly large: boolean; readonly sweep: boolean; readonly to: Vec2 }
  | { readonly kind: 'Close' };

// ── Shapes = algebraiska produkttyper ──

export type Shape =
  | { readonly kind: 'Circle'; readonly center: Vec2; readonly r: number }
  | { readonly kind: 'Ellipse'; readonly center: Vec2; readonly rx: number; readonly ry: number }
  | { readonly kind: 'Rect'; readonly origin: Vec2; readonly size: Size; readonly round?: number | [number, number, number, number] }
  | { readonly kind: 'Line'; readonly from: Vec2; readonly to: Vec2 }
  | { readonly kind: 'Polyline'; readonly points: readonly Vec2[] }
  | { readonly kind: 'Polygon'; readonly points: readonly Vec2[] }
  | { readonly kind: 'Path'; readonly segments: readonly Segment[] }
  | { readonly kind: 'Text'; readonly content: string; readonly at: Vec2; readonly font?: string; readonly size?: number }
  | { readonly kind: 'Image'; readonly href: string; readonly origin: Vec2; readonly size: Size };

// ── Transforms = komponerbara, associativa ──

export type Transform =
  | { readonly kind: 'Translate'; readonly dx: number; readonly dy: number }
  | { readonly kind: 'Scale'; readonly sx: number; readonly sy: number }
  | { readonly kind: 'Rotate'; readonly deg: number; readonly cx?: number; readonly cy?: number }
  | { readonly kind: 'SkewX'; readonly deg: number }
  | { readonly kind: 'SkewY'; readonly deg: number }
  | { readonly kind: 'Matrix'; readonly a: number; readonly b: number; readonly c: number; readonly d: number; readonly e: number; readonly f: number };

// ── Style = deklarativ ──

export type FillStyle =
  | { readonly kind: 'Solid'; readonly color: Color }
  | { readonly kind: 'LinearGradient'; readonly from: Vec2; readonly to: Vec2; readonly stops: readonly GradientStop[] }
  | { readonly kind: 'RadialGradient'; readonly center: Vec2; readonly r: number; readonly stops: readonly GradientStop[] }
  | { readonly kind: 'None' };

export interface GradientStop {
  readonly offset: number; // 0-1
  readonly color: Color;
}

export interface StrokeStyle {
  readonly color: Color;
  readonly width: number;
  readonly cap?: 'butt' | 'round' | 'square';
  readonly join?: 'miter' | 'round' | 'bevel';
  readonly dash?: readonly number[];
  readonly dashOffset?: number;
}

export interface StyleAttrs {
  readonly fill?: FillStyle;
  readonly stroke?: StrokeStyle;
  readonly opacity?: number;
  readonly markerStart?: string;  // marker id ref
  readonly markerMid?: string;
  readonly markerEnd?: string;
  readonly textAnchor?: 'start' | 'middle' | 'end';
  readonly dominantBaseline?: 'auto' | 'middle' | 'hanging' | 'central';
  readonly fontStyle?: 'normal' | 'italic';
  readonly fontWeight?: 'normal' | 'bold' | number;
}

// ── VNode = den centrala komposittypen ──

export interface VNode {
  readonly shape: Shape;
  readonly style: StyleAttrs;
  readonly transforms: readonly Transform[];
  readonly id?: string;
  readonly clipPath?: VNode;
  readonly mask?: VNode;
}

// ── Komposition = algebraiska kombinatorer ──

export type VTree =
  | { readonly kind: 'Leaf'; readonly node: VNode }
  | { readonly kind: 'Group'; readonly children: readonly VTree[]; readonly transforms: readonly Transform[]; readonly style: StyleAttrs; readonly id?: string }
  | { readonly kind: 'Defs'; readonly definitions: readonly VDef[] }
  | { readonly kind: 'Canvas'; readonly children: readonly VTree[]; readonly viewBox: { readonly x: number; readonly y: number; readonly w: number; readonly h: number }; readonly size?: Size };

export interface VDef {
  readonly id: string;
  readonly content: FillStyle;
  /** Raw SVG string for markers or other defs */
  readonly rawSvg?: string;
}

// ── Fabriksfunktioner (kortfattade, expressiva) ──

export const v2 = (x: number, y: number): Vec2 => ({ x, y });
export const sz = (w: number, h: number): Size => ({ w, h });

export function rgb(r: number, g: number, b: number, a: number = 1): Color {
  return { r, g, b, a };
}

export function hex(h: string): Color {
  const s = h.startsWith('#') ? h.slice(1) : h;
  const full = s.length === 3 ? s[0]+s[0]+s[1]+s[1]+s[2]+s[2] : s.length === 4 ? s[0]+s[0]+s[1]+s[1]+s[2]+s[2]+s[3]+s[3] : s;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

export function hsl(h: number, s: number, l: number, a: number = 1): Color {
  // HSL → RGB konvertering
  const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l / 100 - c / 2;
  let r1: number, g1: number, b1: number;
  if (h < 60)       { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else              { r1 = c; g1 = 0; b1 = x; }
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255), a };
}

// Namngivna färger
export const colors = {
  black: rgb(0, 0, 0),
  white: rgb(255, 255, 255),
  red: rgb(255, 0, 0),
  green: rgb(0, 128, 0),
  blue: rgb(0, 0, 255),
  none: { r: 0, g: 0, b: 0, a: 0 } as Color,
} as const;

// ── Shape-konstruktorer ──

export const circle = (center: Vec2, r: number): Shape =>
  ({ kind: 'Circle', center, r });

export const ellipse = (center: Vec2, rx: number, ry: number): Shape =>
  ({ kind: 'Ellipse', center, rx, ry });

export const rect = (origin: Vec2, size: Size, round?: number | [number, number, number, number]): Shape =>
  ({ kind: 'Rect', origin, size, round });

export const line = (from: Vec2, to: Vec2): Shape =>
  ({ kind: 'Line', from, to });

export const polyline = (...points: Vec2[]): Shape =>
  ({ kind: 'Polyline', points });

export const polygon = (...points: Vec2[]): Shape =>
  ({ kind: 'Polygon', points });

export const text = (content: string, at: Vec2, font?: string, size?: number): Shape =>
  ({ kind: 'Text', content, at, font, size });

export const image = (href: string, origin: Vec2, size: Size): Shape =>
  ({ kind: 'Image', href, origin, size });

// ── Path-byggare (fluent, immutabel) ──

export class PathBuilder {
  private readonly segs: Segment[] = [];

  moveTo(x: number, y: number): PathBuilder { this.segs.push({ kind: 'MoveTo', to: v2(x, y) }); return this; }
  lineTo(x: number, y: number): PathBuilder { this.segs.push({ kind: 'LineTo', to: v2(x, y) }); return this; }
  cubicTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): PathBuilder {
    this.segs.push({ kind: 'CubicTo', c1: v2(c1x, c1y), c2: v2(c2x, c2y), to: v2(x, y) }); return this;
  }
  quadTo(cx: number, cy: number, x: number, y: number): PathBuilder {
    this.segs.push({ kind: 'QuadTo', c: v2(cx, cy), to: v2(x, y) }); return this;
  }
  arcTo(rx: number, ry: number, rotation: number, large: boolean, sweep: boolean, x: number, y: number): PathBuilder {
    this.segs.push({ kind: 'ArcTo', rx, ry, rotation, large, sweep, to: v2(x, y) }); return this;
  }
  close(): PathBuilder { this.segs.push({ kind: 'Close' }); return this; }

  build(): Shape { return { kind: 'Path', segments: [...this.segs] }; }
}

export const path = (): PathBuilder => new PathBuilder();

// ── Segment-konstruktorer (för direkt användning) ──

export const moveTo = (x: number, y: number): Segment => ({ kind: 'MoveTo', to: v2(x, y) });
export const lineTo = (x: number, y: number): Segment => ({ kind: 'LineTo', to: v2(x, y) });
export const cubicTo = (c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): Segment =>
  ({ kind: 'CubicTo', c1: v2(c1x, c1y), c2: v2(c2x, c2y), to: v2(x, y) });
export const close = (): Segment => ({ kind: 'Close' });

// ── Transform-konstruktorer ──

export const translate = (dx: number, dy: number): Transform =>
  ({ kind: 'Translate', dx, dy });

export const scale = (s: number): Transform =>
  ({ kind: 'Scale', sx: s, sy: s });

export const scaleXY = (sx: number, sy: number): Transform =>
  ({ kind: 'Scale', sx, sy });

export const rotate = (deg: number, cx?: number, cy?: number): Transform =>
  ({ kind: 'Rotate', deg, cx, cy });

export const skewX = (deg: number): Transform => ({ kind: 'SkewX', deg });
export const skewY = (deg: number): Transform => ({ kind: 'SkewY', deg });

// ── Style-konstruktorer ──

export const fill = (color: Color): FillStyle =>
  ({ kind: 'Solid', color });

export const noFill: FillStyle = { kind: 'None' };

export const stroke = (color: Color, width: number, opts?: Partial<Omit<StrokeStyle, 'color' | 'width'>>): StrokeStyle =>
  ({ color, width, ...opts });

export const linearGradient = (from: Vec2, to: Vec2, ...stops: [number, Color][]): FillStyle =>
  ({ kind: 'LinearGradient', from, to, stops: stops.map(([offset, color]) => ({ offset, color })) });

export const radialGradient = (center: Vec2, r: number, ...stops: [number, Color][]): FillStyle =>
  ({ kind: 'RadialGradient', center, r, stops: stops.map(([offset, color]) => ({ offset, color })) });

// ── Pipe-komposition: shape | style | transform → VNode ──

export function node(shape: Shape, style: StyleAttrs = {}, transforms: Transform[] = []): VNode {
  return { shape, style, transforms };
}

export function styled(n: VNode, style: Partial<StyleAttrs>): VNode {
  return { ...n, style: { ...n.style, ...style } };
}

export function transformed(n: VNode, ...ts: Transform[]): VNode {
  return { ...n, transforms: [...n.transforms, ...ts] };
}

export function withId(n: VNode, id: string): VNode {
  return { ...n, id };
}

export function clipped(n: VNode, clipShape: VNode): VNode {
  return { ...n, clipPath: clipShape };
}

// ── Pipe-operatör via funktionskedja ──

export function draw(shape: Shape): VNodeBuilder {
  return new VNodeBuilder(shape);
}

export class VNodeBuilder {
  private _shape: Shape;
  private _style: StyleAttrs = {};
  private _transforms: Transform[] = [];
  private _id?: string;

  constructor(shape: Shape) { this._shape = shape; }

  fill(color: Color): VNodeBuilder { this._style = { ...this._style, fill: { kind: 'Solid', color } }; return this; }
  fillGradient(g: FillStyle): VNodeBuilder { this._style = { ...this._style, fill: g }; return this; }
  noFill(): VNodeBuilder { this._style = { ...this._style, fill: { kind: 'None' } }; return this; }
  stroke(color: Color, width: number, opts?: Partial<Omit<StrokeStyle, 'color' | 'width'>>): VNodeBuilder {
    this._style = { ...this._style, stroke: { color, width, ...opts } }; return this;
  }
  opacity(o: number): VNodeBuilder { this._style = { ...this._style, opacity: o }; return this; }
  translate(dx: number, dy: number): VNodeBuilder { this._transforms.push(translate(dx, dy)); return this; }
  scale(s: number): VNodeBuilder { this._transforms.push(scale(s)); return this; }
  scaleXY(sx: number, sy: number): VNodeBuilder { this._transforms.push(scaleXY(sx, sy)); return this; }
  rotate(deg: number, cx?: number, cy?: number): VNodeBuilder { this._transforms.push(rotate(deg, cx, cy)); return this; }
  id(id: string): VNodeBuilder { this._id = id; return this; }

  build(): VNode {
    return { shape: this._shape, style: this._style, transforms: this._transforms, id: this._id };
  }
}

// ── Tree-konstruktorer ──

export function leaf(n: VNode): VTree {
  return { kind: 'Leaf', node: n };
}

export function group(children: VTree[], transforms: Transform[] = [], style: StyleAttrs = {}, id?: string): VTree {
  return { kind: 'Group', children, transforms, style, id };
}

export function canvas(viewBox: { x: number; y: number; w: number; h: number }, children: VTree[], size?: Size): VTree {
  return { kind: 'Canvas', viewBox, children, size };
}

// Convenience: shape → leaf (skippar VNode-mellansteget)
export function shape(s: Shape, style: StyleAttrs = {}, transforms: Transform[] = []): VTree {
  return leaf(node(s, style, transforms));
}
