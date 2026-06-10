/**
 * daitai-vector — Grid/Matrix Layout
 * 
 * Auto-positioning of nodes in grid patterns.
 * Like TikZ matrix or positioning library.
 */

import type { Vec2, VTree, VNode, Transform } from './types';
import { v2, leaf, group, translate } from './types';

// ── Types ──

export interface GridLayout {
  readonly rows: number;
  readonly cols: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly originX: number;
  readonly originY: number;
  readonly gap: number;
}

export interface GridCell {
  readonly row: number;
  readonly col: number;
  readonly content: VTree;
}

// ── Factory ──

export function grid(opts: Partial<GridLayout> & { rows: number; cols: number }): GridLayout {
  return {
    rows: opts.rows,
    cols: opts.cols,
    cellWidth: opts.cellWidth ?? 80,
    cellHeight: opts.cellHeight ?? 60,
    originX: opts.originX ?? 0,
    originY: opts.originY ?? 0,
    gap: opts.gap ?? 20,
  };
}

// ── Position calculator ──

export function gridPos(layout: GridLayout, row: number, col: number): Vec2 {
  return v2(
    layout.originX + col * (layout.cellWidth + layout.gap) + layout.cellWidth / 2,
    layout.originY + row * (layout.cellHeight + layout.gap) + layout.cellHeight / 2,
  );
}

/** Get top-left corner of a cell (useful for rect placement) */
export function gridOrigin(layout: GridLayout, row: number, col: number): Vec2 {
  return v2(
    layout.originX + col * (layout.cellWidth + layout.gap),
    layout.originY + row * (layout.cellHeight + layout.gap),
  );
}

// ── Layout: place cells into a group ──

export function gridLayout(layout: GridLayout, cells: GridCell[]): VTree {
  const children: VTree[] = cells.map(cell => {
    const pos = gridOrigin(layout, cell.row, cell.col);
    return group([cell.content], [translate(pos.x, pos.y)]);
  });
  return group(children);
}

// ── Convenience: row/column helpers ──

export function gridRow(layout: GridLayout, row: number, items: VTree[]): GridCell[] {
  return items.map((content, col) => ({ row, col, content }));
}

export function gridCol(layout: GridLayout, col: number, items: VTree[]): GridCell[] {
  return items.map((content, row) => ({ row, col, content }));
}

// ── Flow layout (auto rows/cols) ──

export function flowLayout(
  items: VTree[],
  opts: {
    cols: number;
    cellWidth?: number;
    cellHeight?: number;
    gap?: number;
    originX?: number;
    originY?: number;
  },
): VTree {
  const rows = Math.ceil(items.length / opts.cols);
  const layout = grid({
    rows,
    cols: opts.cols,
    cellWidth: opts.cellWidth,
    cellHeight: opts.cellHeight,
    gap: opts.gap,
    originX: opts.originX,
    originY: opts.originY,
  });

  const cells: GridCell[] = items.map((content, i) => ({
    row: Math.floor(i / opts.cols),
    col: i % opts.cols,
    content,
  }));

  return gridLayout(layout, cells);
}

// ── Connection helpers: find edge attachment points ──

export type Anchor = 'top' | 'bottom' | 'left' | 'right' | 'center';

export function anchorPos(layout: GridLayout, row: number, col: number, anchor: Anchor): Vec2 {
  const center = gridPos(layout, row, col);
  const hw = layout.cellWidth / 2;
  const hh = layout.cellHeight / 2;

  switch (anchor) {
    case 'top': return v2(center.x, center.y - hh);
    case 'bottom': return v2(center.x, center.y + hh);
    case 'left': return v2(center.x - hw, center.y);
    case 'right': return v2(center.x + hw, center.y);
    case 'center': return center;
  }
}
