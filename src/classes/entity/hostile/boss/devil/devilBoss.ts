import { Game } from "../../../../../game";
import { play } from "../../../../../utility/audioUtil";
import { BossEntity } from "../bossEntity";

export class Devil extends BossEntity {
  speed: number = 20;
  animStep: number = 1;
  maxAnimStep: number = 3;

  constructor(game: Game) {
    super(game, 32, 1000, 10);
  }

  deathNoise(): void {
    play("devilDeath");
  }

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
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    ctx.save();
    this.renderHealthBar(ctx, "#ff3333", "Devil");
    ctx.restore();
    ctx.save();
    if (this.hurtTime > 0) ctx.filter = "invert(1)";
    ctx.translate(
      this.x + this.width / 2,
      this.y + this.height / 2,
    );
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
