import { Game } from "../../../../game";
import { getOrderedPath } from "../../../../utility/entityPathing";
import { Entity } from "../../entityClass";
import { EntityType } from "../../entityType";

export class TurretEntity extends Entity {
  damage: number = 1;
  range: number = 100;
  attackSpeed: number = 0.6;
  lastAttackTime: number = Date.now();

  constructor(game: Game, x: number, y: number) {
    super(game, EntityType.TURRET, x, y, 16, 16, 100);
  }

  getTarget(): Entity | null {
    const enemies: Entity[] = this.game.globals.entityManager.getEntityByType(
      EntityType.HOSTILE,
    );

    const path = getOrderedPath(
      this.game.globals.tileMapManager.tileManager.tiles,
    );

    let closest: Entity | null = null;
    let highestOrder = -Infinity;

    for (const enemy of enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > this.range) continue;

      let bestOrder = -Infinity;
      for (const tile of path) {
        const tdx = enemy.x - tile.x;
        const tdy = enemy.y - tile.y;
        const tileDist = Math.sqrt(tdx * tdx + tdy * tdy);
        if (tileDist < bestOrder) continue;
        bestOrder = tile.order;
      }

      if (bestOrder > highestOrder) {
        highestOrder = bestOrder;
        closest = enemy;
      }
    }
    return closest;
  }

  drawLOS(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.range,
      0,
      2 * Math.PI,
    );
    ctx.stroke();
    ctx.restore();
  }

  drawTracer(ctx: CanvasRenderingContext2D, targetX: number, targetY: number) {
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.restore();
  }
}
