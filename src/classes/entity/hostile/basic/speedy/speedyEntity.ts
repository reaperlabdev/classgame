import { Game } from "../../../../../game";
import { findNextTile } from "../../../../../utility/entityPathing";
import { HostileEntity } from "../../hostileEntity";

export class Speedy extends HostileEntity {
  speed: number = 100;
  animStep: number = 1;
  maxAnimStep: number = 3;
  lastStep: number = 0;

  moveDirX = 0;
  moveDirY = 0;

  constructor(game: Game) {
    super(game, 32);
    this.health = Math.round(
      2 + this.game.globals.waveManager.currentWave ** 1.1,
    );
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

    const tiles = this.game.globals.tileMapManager.tileManager.tiles;
    const target = findNextTile(tiles, this.currentOrder);
    if (!target) return;

    const targetX = target.x + (target.width - this.width) / 2;
    const targetY = target.y + (target.height - this.height) / 2;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const move = this.speed * dt;

    this.moveDirX = dx / dist;
    this.moveDirY = dy / dist;

    if (move >= dist) {
      this.x = targetX;
      this.y = targetY;
      this.currentOrder = target.order;
    } else {
      this.x += this.moveDirX * move;
      this.y += this.moveDirY * move;
    }
    this.pathProgress += this.speed * dt;

    if (this.hurtTime > 0) {
      this.hurtTime -= dt;
    }

    this.time += dt;

    const stepDuration = (this.speed * dt) / 4;

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

    ctx.translate(
      this.game.globals.renderer.offsetX + this.x + this.width / 2,
      this.game.globals.renderer.offsetY + this.y + this.height / 2,
    );

    ctx.rotate(Math.atan2(this.moveDirY, this.moveDirX));

    if (this.hurtTime > 0) {
      ctx.filter = "invert(1)";
    }

    let spriteID = "1";

    if (this.health < this.maxHealth * 0.75) {
      spriteID = "2";
    }
    if (this.health < this.maxHealth * 0.5) {
      spriteID = "3";
    }
    if (this.health < this.maxHealth * 0.25) {
      spriteID = "4";
    }

    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(`spider${spriteID}`),
      -12,
      -12,
      24,
      24,
    );

    ctx.restore();
  }
}
