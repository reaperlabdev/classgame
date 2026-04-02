import { Game } from "../../../../../game";
import { Speedy } from "../../basic/speedy/speedyEntity";
import { BossEntity } from "../bossEntity";

export class Factory extends BossEntity {
  speed: number = 15;
  animStep: number = 1;
  maxAnimStep: number = 3;

  isSpawning: boolean = false;
  spawnProgress: number = 0;
  readonly SPAWN_DURATION: number = 1.2;
  readonly COOLDOWN_DURATION: number = 5.0;
  cooldownTimer: number = 0;

  constructor(game: Game) {
    super(game, 32, 1500, 15);
  }

  deathNoise(): void {
    this.executeBurstSpawn(10);
  }

  update(dt: number): void {
    if (!this.isAlive) return;

    super.update(dt);
    if (this.stunned) return;

    if (this.hurtTime > 0) this.hurtTime -= dt;

    if (this.isSpawning) {
      this.spawnProgress += dt;
      if (this.spawnProgress >= this.SPAWN_DURATION) {
        this.executeBurstSpawn(10);
      }
    } else {
      this.handleMovement(dt, this.speed);

      this.cooldownTimer += dt;
      if (this.cooldownTimer >= this.COOLDOWN_DURATION) {
        this.isSpawning = true;
        this.spawnProgress = 0;
        this.cooldownTimer = 0;
      }
    }

    this.time += dt;
    if (this.time > 0.15) {
      this.animStep = (this.animStep % this.maxAnimStep) + 1;
      this.time = 0;
    }
  }

  private executeBurstSpawn(count: number): void {
    this.game.globals.renderer.screenshake(4, 0.2);

    for (let i = 0; i < count; i++) {
      const spider = new Speedy(this.game);
      const offset = (Math.random() - 0.5) * 20;
      spider.x = this.x + offset;
      spider.y = this.y + offset;
      spider.pathProgress = this.pathProgress;
      spider.currentOrder = this.currentOrder;
      this.game.globals.entityManager.entities.set(spider.id, spider);
    }
    this.isSpawning = false;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    this.renderHealthBar(ctx, "orange", "Factory");

    if (this.isSpawning) {
      const progWidth = this.width;
      const progress = this.spawnProgress / this.SPAWN_DURATION;

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(this.x, this.y + this.height + 2, progWidth, 3);
      ctx.fillStyle = "orange";
      ctx.fillRect(this.x, this.y + this.height + 2, progWidth * progress, 3);
    }

    ctx.save();
    if (this.hurtTime > 0 || this.stunned) {
      ctx.filter = "invert(1)";
    } else if (this.isSpawning) {
      const pulse = Math.sin(Date.now() / 100) * 0.5 + 1.5;
      ctx.filter = `drop-shadow(0 0 5px orange) brightness(${pulse})`;
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
