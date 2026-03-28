import { Game } from "../../../../game";
import { findNextTile } from "../../../../utility/entityPathing";
import { HostileEntity } from "../hostileEntity";

export class Camo extends HostileEntity {
  lastHealth: number = 0;
  hurtTime: number = 0;
  speed: number = 25;
  currentOrder: number = -1;
  animStep: number = 1;
  maxAnimStep: number = 3;
  lastStep: number = 0;

  constructor(game: Game) {
    super(game, 32);
    this.camo = true;

    const tiles = game.globals.tileMapManager.tileManager.tiles;
    const start = findNextTile(tiles, -1);
    if (start) {
      this.x = start.x + (start.width - this.width) / 2;
      this.y = start.y + (start.height - this.height) / 2;
    }
  }

  update(dt: number): void {
    if (!this.isAlive) return;

    if (this.health < this.lastHealth) {
      this.hurtTime = Date.now() + 5000;
    }
    this.lastHealth = this.health;

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
      this.hurtTime -= Date.now();
    }

    this.time += dt;

    const stepDuration = 0.1;

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
