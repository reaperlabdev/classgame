import { Game } from "../../../game";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";
import { findNextTile } from "../../../utility/entityPathing";

export class Robot extends Entity {
  speed: number = 400;
  currentOrder: number = -1;

  constructor(game: Game) {
    super(game, EntityType.HOSTILE, 0, 0, 12, 12, 100);

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
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.isAlive) return;
    ctx.fillStyle = "#e84040";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
