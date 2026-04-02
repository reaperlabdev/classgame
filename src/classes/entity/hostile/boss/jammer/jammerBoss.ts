import { Game } from "../../../../../game";
import { play } from "../../../../../utility/audioUtil";
import { EntityType } from "../../../entityType";
import { TurretEntity } from "../../../friendly/turret/turretEntity";
import { BossEntity } from "../bossEntity";

export class Jammer extends BossEntity {
  speed: number = 20;
  animStep: number = 1;
  maxAnimStep: number = 3;
  attackTimer: number = 5;
  flashAlpha: number = 0;
  flashRadius: number = 0;

  constructor(game: Game) {
    super(game, 32, 1000, 10);
  }

  deathNoise(): void {}

  update(dt: number): void {
    if (!this.isAlive) return;
    super.update(dt);
    if (this.stunned) return;

    this.handleMovement(dt, this.speed);

    if (this.hurtTime > 0) this.hurtTime -= dt;

    this.time += dt;
    const stepDuration = (this.speed * dt) / 4;
    if (this.time >= stepDuration) {
      this.animStep = (this.animStep % this.maxAnimStep) + 1;
      this.time = 0;
    }

    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
      this.game.globals.renderer.screenshake(5, 0.2);
      const entities = this.game.globals.entityManager.getEntityArray();
      for (const entity of entities) {
        if (entity.type === EntityType.TURRET) {
          const turret = entity as TurretEntity;
          const dx = turret.x + 8 - (this.x + this.width / 2);
          const dy = turret.y + 8 - (this.y + this.height / 2);
          const dist = Math.hypot(dx, dy);

          if (dist < 75) {
            turret.setStunned(3);
          }
        }
      }
      this.flashAlpha = 1.0;
      this.flashRadius = 10;
      this.attackTimer = 5;
    }

    if (this.flashAlpha > 0) {
      this.flashAlpha -= dt * 2;
      this.flashRadius += dt * 300;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = 75;

    const intensity = 1 - this.attackTimer / 5;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.globalAlpha = 0.2 + intensity * 0.2;
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -Date.now() / 2;
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    this.renderHealthBar(ctx, "green", "Jammer");
    ctx.restore();
    ctx.save();
    if (this.hurtTime > 0) ctx.filter = "invert(1)";
    ctx.translate(
      this.x + this.width / 2,
      this.y + this.height / 2,
    );
    if (this.attackTimer < 0.5) {
      ctx.translate((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3);
    }

    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(`robot${this.animStep}`),
      -this.width / 2.8,
      -this.height / 2,
      24,
      24,
    );

    if (this.flashAlpha > 0) {
      ctx.save();

      ctx.beginPath();
      ctx.arc(0, 0, this.flashRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashAlpha})`;
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.flashRadius;
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist;

        const size = Math.random() * 3 + 1;
        ctx.fillRect(px, py, size, size);
      }

      ctx.restore();
    }

    ctx.restore();
  }
}
