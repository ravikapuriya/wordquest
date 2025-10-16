export type Vec2 = { r: number; c: number };
export function isAdjacent(a: Vec2, b: Vec2) {
    const dr = Math.abs(a.r - b.r), dc = Math.abs(a.c - b.c);
    return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
}
export function containsCell(path: Vec2[], cell: Vec2) { return path.some(p => p.r === cell.r && p.c === cell.c); }
