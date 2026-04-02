import { Game } from "../../../../../game";
import { play } from "../../../../../utility/audioUtil";
import { findNextTile } from "../../../../../utility/entityPathing";
import { BossEntity } from "../bossEntity";

export class Phaser extends BossEntity {
  speed: number = 30;
  animStep: number = 1;
  maxAnimStep: number = 3;
  teleportTimer: number = 5;

  lastPositions: { x: number; y: number; alpha: number }[] = [];
  teleportFlash: number = 0;

  constructor(game: Game) {
    super(game, 32, 500, 10);
  }

  deathNoise(): void {}

  update(dt: number): void {
    if (!this.isAlive) return;
    super.update(dt);
    if (this.stunned) return;
    this.handleMovement(dt, this.speed);

    this.lastPositions.forEach((p) => (p.alpha -= dt * 2));
    this.lastPositions = this.lastPositions.filter((p) => p.alpha > 0);

    if (this.teleportFlash > 0) this.teleportFlash -= dt * 4;

    if (this.hurtTime > 0) this.hurtTime -= dt;

    this.time += dt;
    const stepDuration = (this.speed * dt) / 4;
    if (this.time >= stepDuration) {
      this.animStep = (this.animStep % this.maxAnimStep) + 1;
      this.time = 0;
    }

    this.teleportTimer -= dt;
    if (this.teleportTimer <= 0) {
      this.lastPositions.push({ x: this.x, y: this.y, alpha: 1.0 });

      this.pathProgress += 250;

      const tiles = this.game.globals.tileMapManager.tileManager.tiles;

      let nextTarget = findNextTile(tiles, this.currentOrder);
      while (nextTarget && nextTarget.order * 32 < this.pathProgress) {
        this.currentOrder = nextTarget.order;
        nextTarget = findNextTile(tiles, this.currentOrder);
      }

      if (nextTarget) {
        this.x = nextTarget.x + (nextTarget.width - this.width) / 2;
        this.y = nextTarget.y + (nextTarget.height - this.height) / 2;
      }

      this.teleportFlash = 1.0;
      this.game.globals.renderer.screenshake(4, 0.15);

      this.teleportTimer = 4 + Math.random() * 2;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    this.lastPositions.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha * 0.5;
      ctx.filter = "cyan(1) blur(2px)";
      ctx.translate(
        p.x + this.width / 2,
        p.y + this.height / 2,
      );
      ctx.drawImage(
        this.game.globals.spriteManager.getSprite(`robot${this.animStep}`),
        -this.width / 2.8,
        -this.height / 2,
        24,
        24,
      );
      ctx.restore();
    });

    this.renderHealthBar(ctx, "yellow", "Phaser");

    ctx.save();
    if (this.hurtTime > 0) {
      ctx.filter = "invert(1)";
    } else if (this.teleportFlash > 0) {
      ctx.filter = `brightness(${1 + this.teleportFlash * 2}) drop-shadow(0 0 10px cyan)`;
    }

    ctx.translate(
      this.game.globals.renderer.offsetX + this.x + this.width / 2,
      this.game.globals.renderer.offsetY + this.y + this.height / 2,
    );

    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(`robot${this.animStep}`),
      -this.width / 2.8,
      -this.height / 2,
      24,
      24,
    );
    ctx.restore();

    if (this.teleportFlash > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2,
        this.y + this.height / 2,
        40 * (1 - this.teleportFlash),
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = `rgba(255, 255, 0, ${this.teleportFlash})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  }
}
