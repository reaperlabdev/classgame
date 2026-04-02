import { Game } from "../../../../../game";
import { TilePath } from "../../../../tile/path/tilePath";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { entityValues } from "../../../../../settings/entity/entityValues";
import { TurretEntity } from "../turretEntity";

export class SpikeTurret extends TurretEntity {
  tracers: { x: number; y: number; age: number }[] = [];
  tracerDuration = 0;
  static accepts = [TilePath];

  private attackTimer: number = 0;
  private lastAttacked: Entity | null = null;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 32);
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.damage = entityValues.Spike.damage;
    this.range = entityValues.Spike.range;
    this.attackSpeed = entityValues.Spike.attackSpeed;
    this.name = "Spike";
    this.attackTimer = this.attackSpeed;
  }

  update(dt: number): void {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      this.tracers[i].age += dt;
      if (this.tracers[i].age >= this.tracerDuration) {
        this.tracers.splice(i, 1);
      }
    }

    super.update(dt);
    if (this.stunned) {
      return;
    }

    const closest: Entity | null = this.getTarget();

    if (closest == this.lastAttacked) {
      return;
    }

    if (closest) {
      const dx = closest.x - this.x;
      const dy = closest.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.range) {
        this.tracers.push({ x: closest.x, y: closest.y, age: 0 });
        this.lastAttacked = closest;
        closest.takeDamage(this, this.damage);
        this.takeDamage(this, 1);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(
      this.x + this.width / 2,
      this.y + this.height / 2,
    );
    if (this.stunned) {
      ctx.filter = "invert()";
    }
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite("spike"),
      -this.width / 2,
      -this.height / 2,
      16,
      16,
    );
    ctx.restore();
    ctx.save();

    for (const tracer of this.tracers) {
      const alpha =
        this.tracerDuration > 0
          ? Math.max(0, 1 - tracer.age / this.tracerDuration)
          : 0;
      ctx.globalAlpha = alpha;
      this.drawTracer(ctx, "white", tracer.x, tracer.y);
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
