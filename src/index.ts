/**
 * @daitai/vector — Algebraic vector format
 * 
 * Replaces SVG with algebraic types and pure composition.
 * Compiles to SVG, Canvas2D, and command buffers.
 */

// Types
export type {
  Vec2, Size, Color, Segment, Shape, Transform,
  FillStyle, GradientStop, StrokeStyle, StyleAttrs,
  VNode, VTree, VDef,
} from './types';

// Constructors
export {
  v2, sz, rgb, hex, hsl, colors,
  circle, ellipse, rect, line, polyline, polygon, text, image,
  path, PathBuilder, moveTo, lineTo, cubicTo, close,
  translate, scale, scaleXY, rotate, skewX, skewY,
  fill, noFill, stroke, linearGradient, radialGradient,
  node, styled, transformed, withId, clipped,
  draw, VNodeBuilder,
  leaf, group, canvas, shape,
} from './types';

// Compilers
export { compileToSvg, nodeToSvg, segmentsToD } from './compile-svg';
export { renderToCanvas, hitTest, renderToCanvasElement, renderToDataURL, renderToBlob, clearImageCache } from './compile-canvas';

// SVG parsing (import legacy SVG → daitai-vector)
export { parseSvgPath } from './parse-svg';

// SVG auto-conversion + caching
export { svgToVector, clearSvgCache, svgCacheSize, batchConvert } from './svg-converter';

// Icon library
export { icon, iconRegistry } from './icons';
export type { IconConfig } from './icons';

// Edge/graph helpers
export { edgeLine, edgeBezier, edgesToSvg } from './edge-helpers';
export type { EdgeConfig, BezierEdgeConfig } from './edge-helpers';

// Markers (arrowheads, dots, diamonds)
export {
  arrowMarker, arrowOpenMarker, dotMarker, diamondMarker,
  squareMarker, barMarker, customMarker,
  compileMarkerDef, compileMarkerRefAttrs,
  bidirectionalArrows,
} from './markers';
export type { Marker, MarkerShape, MarkerRef } from './markers';

// Edge labels
export { edgeLabel, placeLabelOnLine, placeLabelOnCurve } from './edge-labels';
export type { EdgeLabel, LabelAnchor, LabelPosition } from './edge-labels';

// Decorations (wavy, zigzag, brace, coil, ticks)
export { wavy, zigzag, coil, brace, ticks, decorateLine, decoratedLine } from './decorations';
export type { DecorationType, DecorationConfig } from './decorations';

// Grid/matrix layout
export { grid, gridPos, gridOrigin, gridLayout, gridRow, gridCol, flowLayout, anchorPos } from './layout';
export type { GridLayout, GridCell, Anchor } from './layout';
