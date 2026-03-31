import { Game } from "../../../game";
import { play } from "../../../utility/audioUtil";
import {
  renderCenteredStrokedText,
  renderStrokedText,
} from "../../../utility/uiUtil";
import { CashEffect } from "../effect/cash/cashEffect";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class HostileEntity extends Entity {
  pathProgress: number = 0;
  currentOrder: number = -1;
  hurtTime: number = 0;
  camo: boolean = false;
  time: number = 0;

  constructor(game: Game, size: number) {
    super(game, EntityType.HOSTILE, 0, 0, size, size, 5);
  }

  renderHealthBar(ctx: CanvasRenderingContext2D, name: string): void {
    ctx.save();
    const fontSize = 12;
    ctx.font = `bold ${fontSize}px Courier New`;

    const centerX = this.x;
    const centerY = this.y - 12;
    renderCenteredStrokedText(
      ctx,
      name,
      centerX,
      centerY,
      fontSize,
      "#ffffff",
      "black",
      2,
    );
    ctx.restore();
    ctx.save();

    const barW = this.width;
    const barH = 4;
    const gap = 8;
    const healthPercent = Math.max(0, this.health / this.maxHealth);

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(this.x, this.y - gap, barW, barH);

    ctx.fillStyle = "#ff3333";
    ctx.fillRect(this.x, this.y - gap, barW * healthPercent, barH);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.5;
    ctx.strokeRect(this.x, this.y - gap, barW, barH);

    ctx.restore();
  }

  deathNoise(): void {
    //play("hostileDeath");
  }

  setStunned(time: number): void {
    this.stunned = true;
    this.stunTime = time;
  }

  takeDamage(amount: number): void {
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
      this.deathNoise();
      this.destroy();
    }
  }
}
