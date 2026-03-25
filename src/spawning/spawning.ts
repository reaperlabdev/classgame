import { PlayerTurret } from "../classes/entity/friendly/playerTurret";
import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

import { entityValues } from "../classes/entity/entityValues";

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
      if (tile instanceof TilePath) {
        return;
      }
      if (tile && this.game.globals.cash >= entityValues.baseTurret.cost) {
        new PlayerTurret(this.game, tile.x, tile.y);
        this.game.globals.cash -= entityValues.baseTurret.cost;
      }
    } else if (!this.game.globals.mouseHandler.getIsDown() && this.debounce) {
      this.debounce = false;
    }
  }
}
