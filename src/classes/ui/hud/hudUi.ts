import { Game } from "../../../game";
import { uiClass } from "../uiClass";
import { EntityType } from "../../entity/entityType";
import { renderStrokedText } from "../../../utility/uiUtil";

export class HudUi extends uiClass {
  ctx: CanvasRenderingContext2D;
  constructor(game: Game) {
    super(game);
    this.ctx = game.renderContext;
  }
  render() {
    this.ctx.save();
    this.ctx.fillStyle = "#FF4444";
    this.ctx.font = "24px Arial";

    const BASE = this.game.globals.entityManager.getEntityByType(
      EntityType.BASE,
    )[0];
    if (!BASE) return;
    const lives = BASE.health;

    if (this.game.globals.paused) {
      this.ctx.save();
      this.ctx.fillStyle = "#FFD700";
      this.ctx.font = "32px Arial";
      renderStrokedText(this.ctx, `Paused`, 16, 490, 32, "#fff", "000", 2);
      this.ctx.restore();
    }

    renderStrokedText(this.ctx, `❤︎${lives}`, 16, 32, 16, "#FF4444", "#000", 2);

    renderStrokedText(
      this.ctx,
      `Wave: ${this.game.globals.waveManager?.currentWave.toString()}`,
      16,
      50,
      16,
      "#ABC1b3",
      "#000",
      2,
    );

    renderStrokedText(
      this.ctx,
      `$${this.game.globals.cash.toString()}`,
      800 - this.ctx.measureText(`$${this.game.globals.cash.toString()}`).width,
      32,
      16,
      "#FFD700",
      "#000",
      2,
    );

    if (this.game.globals.doubleSpeed) {
      renderStrokedText(
        this.ctx,
        `2x`,
        800 - this.ctx.measureText(`2x`).width - 14,
        490,
        16,
        "#FFD700",
        "#000",
        2,
      );
    }

    this.ctx.restore();
  }
}
