import { BaseTurret } from "../classes/entity/friendly/turret/baseTurret/baseTurret";
import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

import { entityValues } from "../classes/entity/entityValues";
import { TileRock } from "../classes/tile/rock/tileRock";
import { SniperTurret } from "../classes/entity/friendly/turret/sniperTurret/sniperTurret";
import { getTileMousePos } from "../utility/mouseUtil";
import { TurretEntity } from "../classes/entity/friendly/turret/turretEntity";

export class Spawning {
  game: Game;
  debounce: boolean;

  selectedTurret: typeof BaseTurret | typeof SniperTurret | null;
  turretName: string | null;
  cost: number;

  constructor(game: Game) {
    this.game = game;
    this.debounce = false;
    this.selectedTurret = null;
    this.turretName = null;
    this.cost = 0;
  }

  select(turret: string) {
    console.log("select", turret);
    if (turret === "Turret") {
      this.selectedTurret = BaseTurret;
      this.cost = entityValues.Turret.cost;
      this.turretName = "Turret";
    }
    if (turret === "Sniper") {
      this.selectedTurret = SniperTurret;
      this.cost = entityValues.Sniper.cost;
      this.turretName = "Sniper";
    }
  }

  update(dt: number) {
    if (this.game.globals.keyboardHandler.isKeyDown(" ")) {
      this.selectedTurret = null;
      this.turretName = null;
      this.cost = 0;
    }
    if (this.game.globals.mouseHandler.getIsDown() && !this.debounce) {
      this.debounce = true;
      const tile: Tile = this.game.globals.targetTile;
      if (tile instanceof TilePath || tile instanceof TileRock) {
        return;
      }
      if (tile && this.game.globals.cash >= this.cost) {
        if (this.selectedTurret) {
          const isOnTile = this.game.globals.entityManager
            .getEntityArray()
            .some(
              (entity) =>
                entity instanceof TurretEntity &&
                entity.x === tile.x &&
                entity.y === tile.y,
            );
          if (!isOnTile) {
            const turret = new this.selectedTurret(this.game, tile.x, tile.y);
            this.game.globals.cash -= this.cost;
          }
        }
      }
      this.selectedTurret = null;
    } else if (!this.game.globals.mouseHandler.getIsDown() && this.debounce) {
      this.debounce = false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.selectedTurret) {
      const previewRange =
        entityValues[this.turretName as keyof typeof entityValues].range;
      ctx.save();

      const tile: Tile | null = getTileMousePos(
        this.game,
        this.game.globals.tileMapManager.tileManager.getTileArray(),
      );

      if (tile) {
        ctx.beginPath();
        ctx.arc(tile.x + 8, tile.y + 8, previewRange, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
