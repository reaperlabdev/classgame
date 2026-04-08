import { Game } from "../../../../../game";
import { play } from "../../../../../utility/audioUtil";
import { BossEntity } from "../bossEntity";

export class Shifter extends BossEntity {
  speed: number = 25;
  animStep: number = 1;
  maxAnimStep: number = 3;
  camoTimer: number = 5;

  constructor(game: Game) {
    super(game, 32, 1000, 10);
  }

  deathNoise(): void {}

  update(dt: number): void {
    if (!this.isAlive) return;
    super.update(dt);
    if (!this.stunned) this.handleMovement(dt, this.speed);

    if (this.hurtTime > 0) this.hurtTime -= dt;

    this.time += dt;
    const stepDuration = (this.speed * dt) / 4;
    if (this.time >= stepDuration) {
      this.animStep = (this.animStep % this.maxAnimStep) + 1;
      this.time = 0;
    }

    if (this.camoTimer > 0) this.camoTimer -= dt;
    if (this.camoTimer <= 0) {
      this.camo = !this.camo;
      this.camoTimer = 5;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    ctx.save();
    this.renderHealthBar(ctx, "purple", "Shifter");
    ctx.restore();
    ctx.save();
    if (this.camo) ctx.globalAlpha = 0.2;
    if (this.hurtTime > 0 || this.stunned) {
      ctx.filter = "invert(1)";
    }
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(`robot${this.animStep}`),
      -this.width / 2.8,
      -this.height / 2,
      24,
      24,
    );
    ctx.restore();
  }
}
