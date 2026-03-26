import { BaseTurret } from "../classes/entity/friendly/turret/baseTurret/baseTurret";
import { TilePath } from "../classes/tile/path/tilePath";
import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

import {
  entityValues,
  placementSettings,
} from "../classes/entity/entityValues";
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

  private calculateNextCost(name: string): number {
    const settings = placementSettings[name as keyof typeof placementSettings];
    if (!settings) return 25;

    const amtPlaced = this.game.globals.entityManager
      .getEntityByType(EntityType.TURRET)
      .filter((entity: Entity): entity is TurretEntity => {
        return entity instanceof TurretEntity && entity.name === name;
      }).length;

    return Math.floor(
      settings.baseCost * Math.pow(settings.inflation, amtPlaced),
    );
  }

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
    if (turret === null) {
      this.selectedTurret = null;
      this.turretName = null;
      this.cost = 0;
      return;
    }

    const turretMap: Record<string, any> = {
      Turret: BaseTurret,
      Sniper: SniperTurret,
      Machine: MachineTurret,
      Spike: SpikeTurret,
    };

    if (turretMap[turret]) {
      this.selectedTurret = turretMap[turret];
      this.turretName = turret;
      this.cost = this.calculateNextCost(turret);
    }
  }

  update(dt: number) {
    if (this.game.globals.keyboardHandler.isKeyDown(" ")) {
      this.select(null);
    }

    if (this.game.globals.mouseHandler.getIsDown() && !this.debounce) {
      this.debounce = true;
      const tile: Tile = this.game.globals.targetTile;

      if (tile && this.selectedTurret && this.turretName) {
        this.cost = this.calculateNextCost(this.turretName);

        if (this.game.globals.cash >= this.cost) {
          const isOnTile = this.game.globals.entityManager
            .getEntityArray()
            .some(
              (entity) =>
                entity instanceof TurretEntity &&
                entity.x === tile.x &&
                entity.y === tile.y,
            );

          const canPlaceOnTile = this.selectedTurret.accepts?.some(
            (accepted) => tile instanceof accepted,
          );

          if (!isOnTile && canPlaceOnTile) {
            const turret = new this.selectedTurret(this.game, tile.x, tile.y);
            this.game.globals.entityManager.addEntity(turret);

            this.game.globals.cash -= this.cost;

            const nextCost = this.calculateNextCost(this.turretName);
            entityValues[this.turretName as keyof typeof entityValues].cost =
              nextCost;

            this.select(null);
          }
        }
      }
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
