import { Game } from "../../../../game";
import { findNextTile } from "../../../../utility/entityPathing";
import { HostileEntity } from "../hostileEntity";
import { Speedy } from "../speedy/speedyEntity";

export class Factory extends HostileEntity {
  speed: number = 12;
  animStep: number = 1;
  maxAnimStep: number = 3;

  // Spawning Logic
  private isSpawning: boolean = false;
  private spawnProgress: number = 0;
  private readonly SPAWN_DURATION: number = 1.2;
  private readonly COOLDOWN_DURATION: number = 5.0;
  private cooldownTimer: number = 0;

  constructor(game: Game) {
    super(game, 32);
    const waveBonus = Math.max(0, game.globals.waveManager.currentWave - 25);
    this.health = 800 + waveBonus * 15;
    this.maxHealth = this.health;

    const tiles = game.globals.tileMapManager.tileManager.tiles;
    const start = findNextTile(tiles, -1);
    if (start) {
      this.x = start.x + (start.width - this.width) / 2;
      this.y = start.y + (start.height - this.height) / 2;
    }
  }

  update(dt: number): void {
    if (!this.isAlive) return;
    super.update(dt);
    if (this.stunned) return;

    if (this.hurtTime > 0) this.hurtTime -= dt;

    if (this.isSpawning) {
      this.spawnProgress += dt;
      if (this.spawnProgress >= this.SPAWN_DURATION) {
        this.executeBurstSpawn(3);
      }
    } else {
      const tiles = this.game.globals.tileMapManager.tileManager.tiles;
      const target = findNextTile(tiles, this.currentOrder);

      if (target) {
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
      }

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
    for (let i = 0; i < count; i++) {
      const spider = new Speedy(this.game);

      const pos = Math.random() * 2 - 1;
      const offset = Math.random() * pos * 128;
      spider.x = this.x + offset;
      spider.y = this.y + offset;

      spider.pathProgress = this.pathProgress;
      spider.currentOrder = this.currentOrder;
    }

    this.isSpawning = false;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    this.renderHealthBar(ctx, "Factory");

    ctx.save();
    if (this.hurtTime > 0) {
      ctx.filter = "brightness(2)";
    } else if (this.isSpawning) {
      const pulse = Math.sin(Date.now() / 100) * 0.5 + 1.5;
      ctx.filter = `drop-shadow(0 0 5px cyan) brightness(${pulse})`;
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
