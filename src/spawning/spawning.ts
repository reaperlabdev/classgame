import { BaseTurret } from "../classes/entity/friendly/turret/baseTurret/baseTurret";
import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

import { entityValues } from "../classes/entity/entityValues";
import { TileRock } from "../classes/tile/rock/tileRock";
import { SniperTurret } from "../classes/entity/friendly/turret/sniperTurret/sniperTurret";

export class Spawning {
  game: Game;
  debounce: boolean;

  selectedTurret: typeof BaseTurret | typeof SniperTurret | null;
  cost: number;

  constructor(game: Game) {
    this.game = game;
    this.debounce = false;
    this.selectedTurret = null;
    this.cost = 0;
  }

  select(turret: string) {
    console.log("select", turret);
    if (turret === "Turret") {
      this.selectedTurret = BaseTurret;
      this.cost = entityValues.baseTurret.cost;
    }
    if (turret === "Sniper") {
      this.selectedTurret = SniperTurret;
      this.cost = entityValues.sniperTurret.cost;
    }
  }

  update(dt: number) {
    if (this.game.globals.mouseHandler.getIsDown() && !this.debounce) {
      this.debounce = true;
      const tile: Tile = this.game.globals.targetTile;
      if (tile instanceof TilePath || tile instanceof TileRock) {
        return;
      }
      if (tile && this.game.globals.cash >= this.cost) {
        if (this.selectedTurret) {
          console.log("spawning", this.selectedTurret, tile.x, tile.y);
          const turret = new this.selectedTurret(this.game, tile.x, tile.y);
          console.log(this.game.globals.entityManager.entities);
        }
        this.game.globals.cash -= this.cost;
      }
    } else if (!this.game.globals.mouseHandler.getIsDown() && this.debounce) {
      this.debounce = false;
    }
  }
}
