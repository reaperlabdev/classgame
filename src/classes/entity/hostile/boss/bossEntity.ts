import { Game } from "../../../../game";
import { findNextTile } from "../../../../utility/entityPathing";
import { CashEffect } from "../../effect/cash/cashEffect";
import { Entity } from "../../entityClass";
import { HostileEntity } from "../hostileEntity";

export class BossEntity extends HostileEntity {
  deathRender: boolean = false;

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

  takeDamage(attacker: Entity, amount: number): void {
    const realDamageDealt = Math.min(amount, this.health);
    this.health -= realDamageDealt;
    this.hurtTime = 0.1;
    let cashEffect: CashEffect = new CashEffect(
      this.game,
      this.x,
      this.y,
      realDamageDealt,
    );
    this.game.globals.score += realDamageDealt;
    this.game.globals.cash += realDamageDealt;

    if (this.health <= 0) {
      this.handleDeath();
      this.destroy();
    }
  }

  handleDeath(): void {
    console.log("boss dead");
    this.game.globals.pauseSeconds = 3;
    this.game.globals.renderer.screenshake(3, 0.5);
    this.deathRender = true;
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
