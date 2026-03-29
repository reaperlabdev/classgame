import { Game } from "../../../../game";
import { findNextTile } from "../../../../utility/entityPathing";
import { HostileEntity } from "../hostileEntity";

export class Robot extends HostileEntity {
  lastHealth: number = 0;
  speed: number = 50;
  currentOrder: number = -1;
  animStep: number = 1;
  maxAnimStep: number = 3;
  lastStep: number = 0;

  constructor(game: Game) {
    super(game, 32);
    this.health = Math.round(
      4 + this.game.globals.waveManager.currentWave ** 1.1,
    );

    const tiles = game.globals.tileMapManager.tileManager.tiles;
    const start = findNextTile(tiles, -1);
    if (start) {
      this.x = start.x + (start.width - this.width) / 2;
      this.y = start.y + (start.height - this.height) / 2;
    }
  }

  update(dt: number): void {
    if (!this.isAlive) return;

    const tiles = this.game.globals.tileMapManager.tileManager.tiles;
    const target = findNextTile(tiles, this.currentOrder);
    if (!target) return;

    const targetX = target.x + (target.width - this.width) / 2;
    const targetY = target.y + (target.height - this.height) / 2;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const move = this.speed * dt;

    if (move >= dist) {
      this.x = targetX;
      this.y = targetY;
      this.currentOrder = target.order;
    } else {
      this.x += (dx / dist) * move;
      this.y += (dy / dist) * move;
    }

    this.pathProgress += this.speed * dt;

    if (this.hurtTime > 0) {
      this.hurtTime -= dt;
    }

    this.time += dt;

    const stepDuration = (this.speed * dt) / 2;

    if (this.time >= stepDuration) {
      this.animStep++;
      this.time = 0;

      if (this.animStep > this.maxAnimStep) {
        this.animStep = 1;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;

    ctx.save();
    if (this.hurtTime > 0) {
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
