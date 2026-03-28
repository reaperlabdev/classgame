import { Game } from "../../../../game";
import { getOrderedPath } from "../../../../utility/entityPathing";
import { Tile } from "../../../tile/tileClass";
import { Entity } from "../../entityClass";
import { EntityType } from "../../entityType";
import { HostileEntity } from "../../hostile/hostileEntity";

export class TurretEntity extends Entity {
  closest: Entity | null = null;
  damage: number = 1;
  range: number = 100;
  attackSpeed: number = 0.6;
  lastAttackTime: number = Date.now();
  name: string | null = null;
  canHitCamo: boolean = false;

  constructor(game: Game, x: number, y: number, size: number) {
    super(game, EntityType.TURRET, x, y, size, size, 100);
    this.name = this.constructor.name.replace("Turret", "");
    console.log(this.name);
  }

  getTarget(): Entity | null {
    const enemies = this.game.globals.entityManager.getEntityByType(
      EntityType.HOSTILE,
    );

    let furthestEnemy: Entity | null = null;
    let maxProgress = -1;

    const rangeSq = this.range * this.range;

    for (const enemy of enemies) {
      if (!(enemy instanceof HostileEntity)) continue;

      const centerX = enemy.x + enemy.width / 2;
      const centerY = enemy.y + enemy.height / 2;

      const dx = centerX - this.x;
      const dy = centerY - this.y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= rangeSq) {
        if (enemy.pathProgress > maxProgress) {
          if (enemy.camo && !this.canHitCamo) continue;
          maxProgress = enemy.pathProgress;
          furthestEnemy = enemy;
        }
      }
    }

    return furthestEnemy;
  }

  drawLOS(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 4,
      this.y + this.height / 4,
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
    ctx.moveTo(this.x + this.width / 4, this.y + this.height / 4);
    ctx.lineTo(targetX + 16, targetY + 16);
    ctx.stroke();
    ctx.restore();
  }
}
