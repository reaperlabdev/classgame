import { PlayerTurret } from "../classes/entity/friendly/playerTurret";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

export class Spawning {
  game: Game;
  debounce: boolean;

  constructor(game: Game) {
    this.game = game;
    this.debounce = false;
  }

  update(dt: number) {
    if (this.game.globals.mouseHandler.getIsDown() && !this.debounce) {
      this.debounce = true;
      const tile: Tile = this.game.globals.targetTile;
      if (tile) {
        new PlayerTurret(this.game, tile.x, tile.y);
      }
    } else if (!this.game.globals.mouseHandler.getIsDown() && this.debounce) {
      this.debounce = false;
    }
  }
}
