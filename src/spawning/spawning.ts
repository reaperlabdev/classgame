import { BaseTurret } from "../classes/entity/friendly/turret/baseTurret/baseTurret";
import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

import { baseEntityCosts, entityValues } from "../classes/entity/entityValues";
import { TileRock } from "../classes/tile/rock/tileRock";
import { SniperTurret } from "../classes/entity/friendly/turret/sniperTurret/sniperTurret";
import { getTileMousePos } from "../utility/mouseUtil";
import { TurretEntity } from "../classes/entity/friendly/turret/turretEntity";
import { MachineTurret } from "../classes/entity/friendly/turret/machineTurret/machineTurrent";
import { SpikeTurret } from "../classes/entity/friendly/turret/spikeTurret/spikeTurret";
import { EntityType } from "../classes/entity/entityType";
import { Entity } from "../classes/entity/entityClass";

export class Spawning {
  game: Game;
  debounce: boolean;

  selectedTurret:
    | typeof MachineTurret
    | typeof SniperTurret
    | typeof BaseTurret
    | typeof SpikeTurret
    | null;
  turretName: string | null;
  cost: number;

  constructor(game: Game) {
    this.game = game;
    this.debounce = false;
    this.selectedTurret = null;
    this.turretName = null;
    this.cost = 0;
  }

  select(turret: string | null) {
    console.log("select", turret);
    if (turret === null) {
      this.selectedTurret = null;
      this.turretName = null;
      this.cost = 0;
      return;
    }
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
    if (turret === "Machine") {
      this.selectedTurret = MachineTurret;
      this.cost = entityValues.Machine.cost;
      this.turretName = "Machine";
    }
    if (turret === "Spike") {
      this.selectedTurret = SpikeTurret;
      this.cost = entityValues.Spike.cost;
      this.turretName = "Spike";
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
          console.log(
            "isOnTile",
            isOnTile,
            "accepts",
            this.selectedTurret.accepts?.some(
              (acceptedTile) => tile instanceof acceptedTile,
            ),
          );
          if (
            !isOnTile &&
            this.selectedTurret.accepts?.some(
              (acceptedTile) => tile instanceof acceptedTile,
            )
          ) {
            const turret = new this.selectedTurret(this.game, tile.x, tile.y);
            const amtPlaced = this.game.globals.entityManager
              .getEntityByType(EntityType.TURRET)
              .filter(
                (turretEntity: Entity) =>
                  turretEntity.constructor.name === this.selectedTurret?.name,
              ).length;

            console.log("amtPlaced", amtPlaced);
            const baseCost =
              baseEntityCosts[this.turretName as keyof typeof baseEntityCosts];
            entityValues[this.turretName as keyof typeof entityValues].cost =
              baseCost + Math.floor(amtPlaced ** 2 * 1.25);
            console.log(
              "cost",
              entityValues[this.turretName as keyof typeof entityValues].cost,
            );
            this.game.globals.cash -= this.cost;
          }
        }
      }
      this.selectedTurret = null;
      this.turretName = null;
      this.cost = 0;
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

      if (
        tile &&
        this.selectedTurret &&
        this.selectedTurret.accepts?.some(
          (acceptedTile) => tile instanceof acceptedTile,
        )
      ) {
        ctx.beginPath();
        ctx.arc(tile.x + 8, tile.y + 8, previewRange, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();
      }
      ctx.restore();
    }
  }
}
