import { Game } from "../../../../../game";
import { findNextTile } from "../../../../../utility/entityPathing";
import { Entity } from "../../../entityClass";
import { HostileEntity } from "../../hostileEntity";

export class Shielder extends HostileEntity {
  lastHealth: number = 0;
  speed: number = 18;
  animStep: number = 1;
  maxAnimStep: number = 4;
  lastStep: number = 0;
  shielding: boolean = true;
  shieldAngle: number = 0;
  shieldHP: number = 0;
  shieldHurtTime: number = 0;

  constructor(game: Game) {
    super(game, 32);
    this.health = Math.round(
      3 + this.game.globals.waveManager.currentWave ** 1.1,
    );
    this.shieldHP = this.health * 1.5;
    this.maxHealth = this.health;

    const tiles = game.globals.tileMapManager.tileManager.tiles;
    const start = findNextTile(tiles, -1);
    if (start) {
      this.x = start.x + (start.width - this.width) / 2;
      this.y = start.y + (start.height - this.height) / 2;
    }
  }

  takeDamage(attacker: Entity, amount: number): void {
    const sourceX = attacker.x + attacker.width / 2;
    const sourceY = attacker.y + attacker.height / 2;
    const dx = sourceX - this.x;
    const dy = sourceY - this.y;
    const angle = Math.atan2(dy, dx);

    let angleDiff = Math.abs(this.shieldAngle - angle);
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    angleDiff = Math.abs(angleDiff);

    if (angleDiff < Math.PI / 2) {
      this.shieldHurtTime = 0.05;
      this.shieldHP -= amount;
      if (this.shieldHP < 0) {
        this.shieldHP = 0;
        this.shielding = false;
      }
      return;
    }

    super.takeDamage(attacker, amount);
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

    if (Math.hypot(dx, dy) > 0.1) {
      this.shieldAngle = Math.atan2(dy, dx);
    }

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

    if (this.shieldHurtTime > 0) {
      this.shieldHurtTime -= dt;
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
    if (this.shielding) {
      ctx.save();
      if (this.shieldHurtTime > 0) {
        ctx.filter = "invert(1)";
      }
      ctx.translate(
        this.game.globals.renderer.offsetX + this.x + this.width / 2,
        this.game.globals.renderer.offsetY + this.y + this.height / 2,
      );

      ctx.rotate(this.shieldAngle);

      ctx.beginPath();
      ctx.arc(0, 0, 14, -Math.PI / 2, Math.PI / 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "cyan";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }
  }
}
