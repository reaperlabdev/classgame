import { Game } from "../../../../../game";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { entityValues } from "../../../entityValues";
import { TurretEntity } from "../turretEntity";

export class SniperTurret extends TurretEntity {
  tracers: { x: number; y: number; createdAt: number }[] = [];
  tracerDuration = 200;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y);
    this.damage = entityValues.Sniper.damage;
    this.range = entityValues.Sniper.range;
    this.attackSpeed = entityValues.Sniper.attackSpeed;
    this.lastAttackTime = Date.now();
  }

  update(dt: number): void {
    const now = Date.now();

    this.tracers = this.tracers.filter(
      (t) => now - t.createdAt < this.tracerDuration,
    );

    const enemies: Entity[] = this.game.globals.entityManager.getEntityByType(
      EntityType.HOSTILE,
    );

    if (now - this.lastAttackTime < this.attackSpeed * 1000) {
      return;
    }

    const closest: Entity | null = this.getTarget();

    if (closest) {
      const dx = closest.x - this.x;
      const dy = closest.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.range) {
        this.tracers.push({ x: closest.x, y: closest.y, createdAt: now });
        closest.takeDamage(this.damage);
        this.lastAttackTime = now;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const sprite = this.game.globals.spriteManager.getSprite("sniper");
    ctx.drawImage(sprite, this.x, this.y, this.width, this.height);

    const now = Date.now();
    for (const tracer of this.tracers) {
      const age = now - tracer.createdAt;
      const alpha = 1 - age / this.tracerDuration;
      ctx.globalAlpha = alpha;
      this.drawTracer(ctx, tracer.x, tracer.y);
    }
    ctx.globalAlpha = 1;

    const { x, y } = this.game.globals.mouseHandler.getPosition();
    const distanceToMouse = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    if (distanceToMouse < 25) {
      this.drawLOS(ctx);
    }
    ctx.restore();
  }
}
