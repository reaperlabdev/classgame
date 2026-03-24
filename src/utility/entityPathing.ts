import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";

export function getOrderedPath(tiles: Map<string, Tile>): TilePath[] {
  return Array.from(tiles.values())
    .filter((t): t is TilePath => t instanceof TilePath)
    .sort((a, b) => a.order - b.order);
}

export function findNextTile(
  tiles: Map<string, Tile>,
  currentOrder: number,
): TilePath | null {
  return getOrderedPath(tiles).find((t) => t.order > currentOrder) ?? null;
}

export function findPath(tiles: Map<string, Tile>): TilePath | null {
  const path = getOrderedPath(tiles);
  return path.length > 0 ? path[0] : null;
}
