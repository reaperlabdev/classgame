import { Game } from "../../../../game";
import { findNextTile } from "../../../../utility/entityPathing";
import { HostileEntity } from "../hostileEntity";

export class BossEntity extends HostileEntity {
  constructor(
    game: Game,
    size: number,
    baseHealth: number,
    healthWaveScaling: number,
  ) {
    super(game, size);

    const waveBonus = Math.max(0, game.globals.waveManager.currentWave - 25);
    this.health = baseHealth + waveBonus * healthWaveScaling;
    this.maxHealth = this.health;

    const tiles = game.globals.tileMapManager.tileManager.tiles;
    const start = findNextTile(tiles, -1);
    if (start) {
      this.x = start.x + (start.width - this.width) / 2;
      this.y = start.y + (start.height - this.height) / 2;
    }
  }

  handleMovement(dt: number, speed: number): void {
    const tiles = this.game.globals.tileMapManager.tileManager.tiles;
    const target = findNextTile(tiles, this.currentOrder);
    if (!target) return;

    const targetX = target.x + (target.width - this.width) / 2;
    const targetY = target.y + (target.height - this.height) / 2;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);
    const move = speed * dt;

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
}
