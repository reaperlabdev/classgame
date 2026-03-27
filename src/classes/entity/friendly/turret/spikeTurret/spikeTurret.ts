import { Game } from "../../../../../game";
import { TilePath } from "../../../../tile/path/tilePath";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { entityValues } from "../../../entityValues";
import { TurretEntity } from "../turretEntity";

export class SpikeTurret extends TurretEntity {
  tracers: { x: number; y: number; age: number }[] = [];
  tracerDuration = 0;
  static accepts = [TilePath];

  private attackTimer: number = 0;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 16);
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

    this.attackTimer += dt;

    if (this.attackTimer < this.attackSpeed) {
      return;
    }

    const closest: Entity | null = this.getTarget();

    if (closest) {
      const dx = closest.x - this.x;
      const dy = closest.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.range) {
        this.tracers.push({ x: closest.x, y: closest.y, age: 0 });
        closest.takeDamage(this.damage);
        this.takeDamage(1);
        this.attackTimer = 0;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    const sprite = this.game.globals.spriteManager.getSprite("spike");
    ctx.drawImage(sprite, this.x, this.y, this.width, this.height);

    for (const tracer of this.tracers) {
      const alpha =
        this.tracerDuration > 0
          ? Math.max(0, 1 - tracer.age / this.tracerDuration)
          : 0;
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
