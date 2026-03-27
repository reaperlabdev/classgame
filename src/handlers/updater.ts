import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";
import { getTileMousePos } from "../utility/mouseUtil";

export class Updater {
  private game: Game;
  db: boolean;

  constructor(game: Game) {
    this.game = game;
    this.db = false;
  }

  update(dt: number): void {
    if (this.game.globals.keyboardHandler.isKeyDown("Escape") && !this.db) {
      this.game.globals.paused = !this.game.globals.paused;
      this.db = true;
    } else if (!this.game.globals.keyboardHandler.isKeyDown("Escape")) {
      this.db = false;
    }

    this.game.globals.spawning.update(dt);

    if (!this.game.globals.paused) this.game.globals.entityManager.update(dt);
    this.game.globals.uiHandler.update(dt);

    const uiHovered: boolean = Array.from(
      this.game.globals.uiHandler.uiClassesMap.values(),
    ).some((uiClass) => uiClass.hovered);

    let tiles: Tile[] =
      this.game.globals.tileMapManager.tileManager.getTileArray();
    // get mouse Event
    const tile: Tile | null = getTileMousePos(this.game, tiles);
    if (tile?.canHover && !uiHovered) {
      this.game.globals.targetTile = tile;
      this.game.globals.tileMapManager.tileManager.setHoveredTile(tile);
    } else {
      this.game.globals.targetTile = null;
      this.game.globals.tileMapManager.tileManager.setHoveredTile(null);
    }
  }
}
