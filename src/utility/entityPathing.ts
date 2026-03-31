import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";

let cachedPath: TilePath[] | null = null;

export function invalidatePathCache(): void {
  console.log("invalidatePathCache");
  cachedPath = null;
}

export function getOrderedPath(tiles: Map<string, Tile>): TilePath[] {
  if (cachedPath) return cachedPath;
  console.log("gen new path");
  cachedPath = Array.from(tiles.values())
    .filter((t): t is TilePath => t instanceof TilePath)
    .sort((a, b) => a.order - b.order);
  return cachedPath;
}

export function findNextTile(
  tiles: Map<string, Tile>,
  currentOrder: number,
): TilePath | null {
  const path = getOrderedPath(tiles);

  let lo = 0,
    hi = path.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (path[mid].order <= currentOrder) lo = mid + 1;
    else hi = mid - 1;
  }
  return path[lo] ?? null;
}

export function findPath(tiles: Map<string, Tile>): TilePath | null {
  const path = getOrderedPath(tiles);
  return path[0] ?? null;
}
