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

    const lives = this.game.globals.entityManager.getEntityByType(
      EntityType.BASE,
    )[0].health;

    renderStrokedText(
      this.ctx,
      `Lives: ${lives}`,
      16,
      35,
      24,
      "#FF4444",
      "#000",
      2,
    );
    renderStrokedText(
      this.ctx,
      `Cash: ${this.game.globals.cash.toString()}`,
      800 -
        this.ctx.measureText(`Cash: ${this.game.globals.cash.toString()}`)
          .width -
        16,
      35,
      24,
      "#FFD700",
      "#000",
      2,
    );
    this.ctx.restore();
  }
}
