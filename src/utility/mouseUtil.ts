import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

export function getTileMousePos(game: Game, tiles: Tile[]): Tile | null {
  const mousePos = game.globals.mouseHandler.getPosition();
  // find closest tile within 16 px and offset to middle so offset by 8px
  mousePos.x -= 8;
  mousePos.y -= 8;
  let closestTile: Tile | null = null;
  let closestDist = Infinity;
  for (const tile of tiles) {
    const dist = Math.sqrt(
      (tile.x - mousePos.x) ** 2 + (tile.y - mousePos.y) ** 2,
    );
    if (dist < 16 && dist < closestDist) {
      closestTile = tile;
      closestDist = dist;
    }
  }
  return closestTile ? closestTile : null;
}
