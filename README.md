<p align="center">
  <strong>@daitai/vector</strong><br>
  <em>Algebraic vector format — replaces SVG with typed, composable primitives</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@daitai/vector"><img src="https://img.shields.io/npm/v/@daitai/vector?color=blue&label=npm" alt="npm"></a>
  <a href="https://github.com/daitai-org/vector/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT"></a>
  <img src="https://img.shields.io/badge/types-TypeScript-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/tree--shakeable-yes-brightgreen" alt="Tree-shakeable">
  <img src="https://img.shields.io/badge/zero%20deps-✓-brightgreen" alt="Zero dependencies">
  <img src="https://img.shields.io/badge/bundle-<8kb%20gzip-blue" alt="Bundle size">
</p>

---

## Why?

SVG is XML-based, imperative, and impossible to reason about algebraically. `@daitai/vector` replaces it with **typed algebraic primitives** that compose naturally and compile to multiple targets.

```
daitai-vector (6 typed primitives)
  ↓ compile
  SVG string  |  Canvas2D  |  Command Buffer
```

**Zero dependencies. Zero DOM. Works everywhere.**

## Install

```bash
npm install @daitai/vector
```

## Quick Start

```typescript
import { circle, rect, fill, rgb, group, canvas } from '@daitai/vector';
import { compileToSvg } from '@daitai/vector/svg';

// Build a scene algebraically
const scene = canvas({ w: 300, h: 200 }, [
  group([
    fill(circle({ x: 100, y: 100 }, 50), rgb(38, 115, 217)),
    fill(rect({ x: 180, y: 40 }, { w: 80, h: 80 }), rgb(217, 72, 38)),
  ])
]);

// Compile to SVG
const svg = compileToSvg(scene);
// → <svg viewBox="0 0 300 200">...</svg>
```

## Subpath Imports

Tree-shake by importing only what you need:

```typescript
import { ... } from '@daitai/vector';           // All constructors + types
import { compileToSvg } from '@daitai/vector/svg';       // SVG compiler
import { renderToCanvas } from '@daitai/vector/canvas';   // Canvas2D renderer
import { icon } from '@daitai/vector/icons';              // Built-in icon library
import { parseSvgPath } from '@daitai/vector/parse';      // SVG path data parser
import { svgToVector } from '@daitai/vector/converter';   // Full SVG → VTree
import { edgeLine } from '@daitai/vector/edges';          // Graph edge helpers
import { arrowMarker } from '@daitai/vector/markers';     // Arrow/dot/diamond markers
import { edgeLabel } from '@daitai/vector/labels';        // Edge label placement
import { wavy, zigzag } from '@daitai/vector/decorations';// Line decorations
import { grid, flowLayout } from '@daitai/vector/layout'; // Grid/flow layout
```

---

## API Reference

### Primitives

| Constructor | Signature | Description |
|-------------|-----------|-------------|
| `circle` | `(center: Vec2, r: number)` | Circle by center + radius |
| `ellipse` | `(center: Vec2, rx: number, ry: number)` | Ellipse |
| `rect` | `(origin: Vec2, size: Size)` | Rectangle |
| `line` | `(from: Vec2, to: Vec2)` | Line segment |
| `polyline` | `(points: Vec2[])` | Open polyline |
| `polygon` | `(points: Vec2[])` | Closed polygon |
| `text` | `(content: string, at: Vec2, font?, size?)` | Text element |
| `image` | `(href: string, origin: Vec2, size: Size)` | Image element |
| `path` | `(segments: Segment[])` | Bézier path |

### Geometry Helpers

```typescript
import { v2, sz } from '@daitai/vector';

const point = v2(100, 200);   // → { x: 100, y: 200 }
const size = sz(300, 400);    // → { w: 300, h: 400 }
```

### Colors

```typescript
import { rgb, hex, hsl, colors } from '@daitai/vector';

rgb(38, 115, 217)              // → { r: 38, g: 115, b: 217, a: 1 }
hex('#2673d9')                 // → same as above
hsl(213, 70, 50)               // → HSL → RGB conversion
colors.blue                    // → predefined color
```

### Transforms

Transforms are composable and associative:

```typescript
import { translate, scale, scaleXY, rotate, skewX, skewY } from '@daitai/vector';

translate(v2(50, 100))         // Move
scale(2)                       // Uniform scale
scaleXY(1.5, 0.8)             // Non-uniform scale
rotate(45)                     // Rotate (degrees)
skewX(15)                     // Horizontal skew
skewY(10)                     // Vertical skew
```

### Styling

```typescript
import { fill, noFill, stroke, linearGradient, radialGradient } from '@daitai/vector';

// Solid fill
fill(circle(v2(0, 0), 50), rgb(255, 0, 0))

// Stroke
stroke(rect(v2(0, 0), sz(100, 100)), rgb(0, 0, 0), 2)

// No fill (outline only)
noFill(circle(v2(0, 0), 50))

// Linear gradient
linearGradient(
  { x: 0, y: 0 }, { x: 1, y: 1 },
  [{ offset: 0, color: rgb(255, 0, 0) }, { offset: 1, color: rgb(0, 0, 255) }]
)
```

### Composition

```typescript
import { group, canvas, node, styled, transformed, withId, clipped } from '@daitai/vector';

// Group shapes
const g = group([shape1, shape2, shape3]);

// Canvas (root with viewport)
const scene = canvas(sz(800, 600), [g]);

// Transform a subtree
const moved = transformed(g, [translate(v2(50, 50))]);

// ID for targeting
const labeled = withId(shape, 'my-circle');
```

### Path Builder

Fluent API for complex paths:

```typescript
import { PathBuilder } from '@daitai/vector';

const heart = new PathBuilder()
  .moveTo(v2(150, 200))
  .cubicTo(v2(150, 150), v2(100, 100), v2(50, 150))
  .cubicTo(v2(0, 200), v2(75, 280), v2(150, 350))
  .cubicTo(v2(225, 280), v2(300, 200), v2(250, 150))
  .cubicTo(v2(200, 100), v2(150, 150), v2(150, 200))
  .close()
  .build();
```

Or with standalone functions:

```typescript
import { moveTo, lineTo, cubicTo, close } from '@daitai/vector';

const segments = [
  moveTo(v2(0, 0)),
  lineTo(v2(100, 0)),
  lineTo(v2(100, 100)),
  close(),
];
```

---

## Multi-Target Rendering

The same `VTree` renders to any target:

### SVG

```typescript
import { compileToSvg, nodeToSvg, segmentsToD } from '@daitai/vector/svg';

const svgString = compileToSvg(tree);
document.getElementById('container').innerHTML = svgString;
```

### Canvas2D

```typescript
import { renderToCanvas, renderToDataURL, renderToBlob, hitTest } from '@daitai/vector/canvas';

const ctx = canvasElement.getContext('2d');
renderToCanvas(ctx, tree);

// Export
const dataUrl = renderToDataURL(tree, 800, 600);
const blob = await renderToBlob(tree, 800, 600);

// Hit testing (which shape is at pixel x, y?)
const hit = hitTest(ctx, tree, { x: 150, y: 200 });
```

---

## Icons

Built-in icon library with 40+ icons:

```typescript
import { icon, iconRegistry } from '@daitai/vector/icons';

// Get icon as VTree
const searchIcon = icon('search', { size: 24, strokeWidth: 2 });
const svgString = compileToSvg(searchIcon);

// List all available icons
const allIcons = iconRegistry();
// → ['search', 'folder', 'file', 'chevron-down', 'code', ...]
```

## SVG Import

Convert existing SVG to daitai-vector:

```typescript
import { svgToVector, batchConvert } from '@daitai/vector/converter';
import { parseSvgPath } from '@daitai/vector/parse';

// Full SVG string → VTree
const tree = svgToVector('<svg>...</svg>');

// Just path data → Segments
const segments = parseSvgPath('M10 20 L30 40 C50 60 70 80 90 100 Z');

// Batch convert with caching
const trees = batchConvert(['<svg>...</svg>', '<svg>...</svg>']);
```

## Graph Diagrams

Edge helpers for node-and-edge diagrams:

```typescript
import { edgeLine, edgeBezier } from '@daitai/vector/edges';
import { arrowMarker, dotMarker } from '@daitai/vector/markers';
import { edgeLabel, placeLabelOnLine } from '@daitai/vector/labels';

// Straight edge with arrow
const edge = edgeLine({
  from: v2(100, 100),
  to: v2(300, 200),
  color: rgb(0, 0, 0),
  width: 2,
});

// Curved edge
const curved = edgeBezier({
  from: v2(100, 100),
  to: v2(300, 200),
  curvature: 0.3,
});
```

## Line Decorations

```typescript
import { wavy, zigzag, coil, brace, ticks } from '@daitai/vector/decorations';

const wavyLine = wavy(v2(0, 0), v2(200, 0), { amplitude: 8, frequency: 4 });
const zigzagLine = zigzag(v2(0, 0), v2(200, 0), { amplitude: 10 });
const braceLine = brace(v2(0, 0), v2(200, 0), { height: 20 });
```

## Grid Layout

```typescript
import { grid, gridLayout, flowLayout } from '@daitai/vector/layout';

// Place items in a grid
const positions = gridLayout(
  { cols: 3, rows: 2, cellWidth: 100, cellHeight: 80, gap: 10 },
  myShapes
);

// Auto-flow layout
const flowed = flowLayout(myShapes, { width: 400, gap: 12 });
```

---

## Type System

All types are readonly and immutable:

```typescript
import type {
  Vec2, Size, Color,          // Geometry primitives
  Segment,                     // Path segments (MoveTo, LineTo, CubicTo, ...)
  Shape,                       // Circle | Rect | Path | Text | Image | ...
  Transform,                   // Translate | Scale | Rotate | Skew
  FillStyle, StrokeStyle,      // Paint styles
  StyleAttrs,                  // Combined style
  VNode,                       // Single styled node
  VTree,                       // Root tree (canvas + children)
  VDef,                        // Reusable definitions
} from '@daitai/vector';
```

### Shape (Sum Type)

```typescript
type Shape =
  | { kind: 'Circle'; center: Vec2; r: number }
  | { kind: 'Rect'; origin: Vec2; size: Size; round?: number }
  | { kind: 'Path'; segments: Segment[] }
  | { kind: 'Text'; content: string; at: Vec2 }
  | { kind: 'Image'; href: string; origin: Vec2; size: Size }
  | { kind: 'Line'; from: Vec2; to: Vec2 }
  | { kind: 'Ellipse'; center: Vec2; rx: number; ry: number }
  | { kind: 'Polyline'; points: Vec2[] }
  | { kind: 'Polygon'; points: Vec2[] }
```

---

## Design Principles

1. **Geometry is algebra, not commands** — Shapes are product types, not imperative draw calls
2. **Composition over inheritance** — `group()`, `transformed()`, `styled()` compose freely
3. **Deterministic rendering** — Same input → same output, always
4. **Zero DOM dependency** — Works in Node.js, Deno, browsers, WASM
5. **Type-safe by construction** — Invalid states are unrepresentable

## Part of the daitai ecosystem

`@daitai/vector` is the graphics foundation for:
- **@daitai/ui** — Deterministic UI framework (signals, traits, reconciler)
- **@daitai/ddf** — Algebraic document format (PDF replacement)
- **DPW** — daitai Programmers Workbench (full IDE)

## License

MIT © [Joakim Cöster](https://daitai.org) / daitai.org
