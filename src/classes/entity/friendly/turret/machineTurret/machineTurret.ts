import { Game } from "../../../../../game";
import { TileGrass } from "../../../../tile/grass/tileGrass";
import { Entity } from "../../../entityClass";
import { EntityType } from "../../../entityType";
import { entityValues } from "../../../../../settings/entity/entityValues";
import { TurretEntity } from "../turretEntity";
import { play } from "../../../../../utility/audioUtil";

export class MachineTurret extends TurretEntity {
  tracers: { x: number; y: number; age: number }[] = [];
  tracerDuration = 0.1;
  static accepts = [TileGrass];

  private attackTimer: number = 0;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 32);
    this.damage = entityValues.Machine.damage;
    this.range = entityValues.Machine.range;
    this.attackSpeed = entityValues.Machine.attackSpeed;
    this.name = "Machine";
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

    this.attackTimer += dt;

    if (this.attackTimer < this.attackSpeed) {
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
          age: 0,
        });
        play("shooting", false, true);
        this.closest.takeDamage(this.damage);
        this.attackTimer = 0;
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
    if (this.stunned) {
      ctx.filter = "invert()";
    }
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite("machine"),
      -this.width / 2,
      -this.height / 2,
      32,
      32,
    );
    ctx.restore();

    ctx.save();
    for (const tracer of this.tracers) {
      const alpha = Math.max(0, 1 - tracer.age / this.tracerDuration);
      ctx.globalAlpha = alpha;
      this.drawTracer(ctx, "yellow", tracer.x, tracer.y);
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
