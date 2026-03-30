import { Game } from "../../../../../game";
import { TileGrass } from "../../../../tile/grass/tileGrass";
import { entityValues } from "../../../../../settings/entity/entityValues";
import { TurretEntity } from "../turretEntity";

export class EmpTurret extends TurretEntity {
  tracers: { x: number; y: number; age: number }[] = [];
  blastMarkers: { x: number; y: number; age: number }[] = [];
  tracerDuration = 1.8;
  blastDuration = 0.4;
  aoeRadius = 60;
  static accepts = [TileGrass];

  private attackTimer: number = 0;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 32);
    this.damage = entityValues.EMP.damage;
    this.range = entityValues.EMP.range;
    this.attackSpeed = entityValues.EMP.attackSpeed;
    this.name = "EMP";
  }

  update(dt: number): void {
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      this.tracers[i].age += dt;
      if (this.tracers[i].age >= this.tracerDuration) {
        this.tracers.splice(i, 1);
      }
    }

    for (let i = this.blastMarkers.length - 1; i >= 0; i--) {
      this.blastMarkers[i].age += dt;
      if (this.blastMarkers[i].age >= this.blastDuration) {
        this.blastMarkers.splice(i, 1);
      }
    }

    this.attackTimer += dt;
    if (this.attackTimer < this.attackSpeed) return;

    this.closest = this.getTarget();

    if (this.closest) {
      const tx = this.closest.x + this.closest.width / 2;
      const ty = this.closest.y + this.closest.height / 2;
      const dx = tx - this.x;
      const dy = ty - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.range) {
        this.tracers.push({ x: tx, y: ty, age: 0 });

        this.blastMarkers.push({ x: tx, y: ty, age: 0 });

        const hitEnemies = this.getEnemiesInRadius(
          tx,
          ty,
          true,
          this.aoeRadius,
        );
        for (const enemy of hitEnemies) {
          enemy.takeDamage(this.damage);
          enemy.setStunned(1);
        }

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
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite("emp"),
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
      this.drawTracer(ctx, "#4af", tracer.x, tracer.y);
    }

    ctx.restore();
    ctx.save();

    for (const blast of this.blastMarkers) {
      const progress = blast.age / this.blastDuration;
      const alpha = Math.max(0, 0.45 * (1 - progress));
      const radius = this.aoeRadius * (0.4 + 0.6 * progress);

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(blast.x, blast.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#4af";
      ctx.fill();
      ctx.strokeStyle = "#8df";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.save();

    const { x, y } = this.game.globals.mouseHandler.getPosition();
    const distanceToMouse = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    if (distanceToMouse < 25) {
      this.drawLOS(ctx);
    }

    ctx.restore();
  }
}
