import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";

function findPath(tiles: Map<String, Tile>) {
  let nextTile: Tile | null = null;
  for (const [key, tile] of tiles.entries()) {
    if (tile instanceof TilePath) {
      if (nextTile === null || tile.x > nextTile.x) {
        nextTile = tile;
      }
    }
  }
  return nextTile;
}
