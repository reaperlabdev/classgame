import { Game } from "../../../../../game";
import { getOrderedPath } from "../../../../../utility/entityPathing";
import { TileGrass } from "../../../../tile/grass/tileGrass";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { entityValues } from "../../../entityValues";
import { TurretEntity } from "../turretEntity";

export class BaseTurret extends TurretEntity {
  tracers: { x: number; y: number; createdAt: number }[] = [];
  tracerDuration = 50;
  static accepts = [TileGrass];

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 32);
    this.damage = entityValues.Turret.damage;
    this.range = entityValues.Turret.range;
    this.attackSpeed = entityValues.Turret.attackSpeed;
  }

  update(dt: number): void {
    const now = Date.now();

    this.tracers = this.tracers.filter(
      (t) => now - t.createdAt < this.tracerDuration,
    );

    if (now - this.lastAttackTime < this.attackSpeed * 1000) {
      return;
    }

    this.closest = this.getTarget();

    if (this.closest) {
      const dx = this.closest.x - this.x;
      const dy = this.closest.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.range) {
        this.tracers.push({
          x: this.closest.x,
          y: this.closest.y,
          createdAt: now,
        });
        this.closest.takeDamage(this.damage);
        this.lastAttackTime = now;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.x + this.width / 4, this.y + this.height / 4);
    if (this.closest) {
      if (this.closest.x > this.x) {
        ctx.scale(-1, 1);
      }
    }
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite("turret"),
      -this.width / 2,
      -this.height / 2,
      32,
      32,
    );
    ctx.restore();
    ctx.save();

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
