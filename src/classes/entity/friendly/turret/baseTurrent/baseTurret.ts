import { Game } from "../../../../../game";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { TurretEntity } from "../turretEntity";

export class BaseTurret extends TurretEntity {
  damage: number = 1;
  range: number = 100;
  attackSpeed: number = 0.6;
  lastAttackTime: number = Date.now();

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 1, 100, 0.6);
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
  }
}
