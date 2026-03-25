import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";
import { getTileMousePos } from "../utility/mouseUtil";

export class Updater {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {
    const now = performance.now();
    const dt = Math.min((now - this.game.globals.frameTime) / 1000, 0.1);

    this.game.globals.fps = Math.round(1 / dt);

    this.game.globals.spawning.update(dt);

    this.game.globals.entityManager.update(dt);
    this.game.globals.waveManager?.update(dt);
    this.game.globals.uiHandler.update(dt);

    let tiles: Tile[] =
      this.game.globals.tileMapManager.tileManager.getTileArray();
    // get mouse Event
    const tile: Tile | null = getTileMousePos(this.game, tiles);
    this.game.globals.targetTile = tile;
    this.game.globals.tileMapManager.tileManager.setHoveredTile(tile);

    this.game.globals.frameTime = now;
  }
}
