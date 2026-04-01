import { Game } from "../../../../../game";
import { findNextTile } from "../../../../../utility/entityPathing";
import { EntityType } from "../../../entityType";
import { TurretEntity } from "../../../friendly/turret/turretEntity";
import { HostileEntity } from "../../hostileEntity";

export class Bomber extends HostileEntity {
  blastMarkers: { x: number; y: number; age: number }[] = [];
  blastDuration: number = 0.8;
  speed: number = 65;
  animStep: number = 1;
  maxAnimStep: number = 4;
  animTimer: number = 0;
  exploded: boolean = false;
  deathTimer: number = 1.0;

  constructor(game: Game) {
    super(game, 32);
    this.health = Math.round(
      4 + Math.pow(this.game.globals.waveManager.currentWave, 1.1),
    );

    const tiles = game.globals.tileMapManager.tileManager.tiles;
    const start = findNextTile(tiles, -1);
    if (start) {
      this.x = start.x + (start.width - this.width) / 2;
      this.y = start.y + (start.height - this.height) / 2;
    }
  }

  takeDamage(amount: number): void {
    if (this.exploded) return;

    this.health -= amount;
    this.hurtTime = 0.15;

    if (this.health <= 0) {
      this.triggerExplosion();
    }
  }

  private triggerExplosion(): void {
    this.exploded = true;
    this.stunned = true;

    this.blastMarkers.push({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      age: 0,
    });

    const entities = this.game.globals.entityManager.getEntityArray();
    for (const entity of entities) {
      if (entity.type === EntityType.TURRET) {
        const turret = entity as TurretEntity;
        const dx = turret.x + 8 - (this.x + this.width / 2);
        const dy = turret.y + 8 - (this.y + this.height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < 50) {
          turret.setStunned(4);
        }
      }
    }
  }

  update(dt: number): void {
    for (let i = this.blastMarkers.length - 1; i >= 0; i--) {
      this.blastMarkers[i].age += dt;
      if (this.blastMarkers[i].age >= this.blastDuration) {
        this.blastMarkers.splice(i, 1);
      }
    }

    if (this.exploded) {
      this.deathTimer -= dt;
      if (this.deathTimer <= 0) {
        this.isAlive = false;
        this.game.globals.entityManager.removeEntity(this.id);
      }
      return;
    }

    super.update(dt);
    if (this.stunned) return;

    const tiles = this.game.globals.tileMapManager.tileManager.tiles;
    const target = findNextTile(tiles, this.currentOrder);
    if (!target) return;

    const targetX = target.x + (target.width - this.width) / 2;
    const targetY = target.y + (target.height - this.height) / 2;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);
    const move = this.speed * dt;

    if (move >= dist) {
      this.x = targetX;
      this.y = targetY;
      this.currentOrder = target.order;
    } else {
      this.x += (dx / dist) * move;
      this.y += (dy / dist) * move;
    }

    this.pathProgress += move;

    if (this.hurtTime > 0) this.hurtTime -= dt;

    this.animTimer += dt;
    if (this.animTimer > 0.15) {
      this.animStep = (this.animStep % this.maxAnimStep) + 1;
      this.animTimer = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.exploded && this.isAlive) {
      ctx.save();
      if (this.hurtTime > 0) ctx.filter = "brightness(2)";

      const sprite = this.game.globals.spriteManager.getSprite(
        `bomber${this.animStep}`,
      );
      ctx.drawImage(sprite, this.x + 2, this.y - 6, this.width, this.height);
      ctx.restore();
    }

    if (this.game.globals.settings.getSettings().effects) {
      ctx.save();
      for (const blast of this.blastMarkers) {
        const progress = blast.age / this.blastDuration;
        const alpha = 1 - progress;
        const radius = 50 * Math.sin((progress * Math.PI) / 2);

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(blast.x, blast.y, radius, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          blast.x,
          blast.y,
          0,
          blast.x,
          blast.y,
          radius,
        );
        grad.addColorStop(0, "white");
        grad.addColorStop(0.2, "#ffd300");
        grad.addColorStop(1, "rgba(255, 69, 0, 0)");

        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();
    }
  }
}
