import { Game } from "../../../../../game";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { TurretEntity } from "../turretEntity";

export class BaseTurret extends TurretEntity {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y);
    this.damage = 1;
    this.range = 100;
    this.attackSpeed = 0.6;
  }

  update(dt: number): void {
    const enemies: Entity[] = this.game.globals.entityManager.getEntityByType(
      EntityType.HOSTILE,
    );

    const now = Date.now();
    if (now - this.lastAttackTime < this.attackSpeed * 1000) {
      return;
    }

    let closest: Entity | null = null;
    let closestDistance = Infinity;

    for (const enemy of enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closest = enemy;
        closestDistance = distance;
      }
    }

    if (closest) {
      const dx = closest.x - this.x;
      const dy = closest.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.range) {
        closest.takeDamage(this.damage);
        this.lastAttackTime = now;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    console.log(this.id);
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw LOS
    ctx.strokeStyle = "blue";
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
}
