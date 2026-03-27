import { Game } from "../../../../game";
import { renderStrokedText } from "../../../../utility/uiUtil";
import { Effect } from "../effectEntity";

export class CashEffect extends Effect {
  rand: number;
  constructor(
    game: Game,
    x: number,
    y: number,
    public amount: number,
  ) {
    super(game, x + Math.random() * 16, y, 0.8);
    this.rand = Math.random();
  }

  update(dt: number): void {
    // move to top right or left based on random direction
    this.x += dt * 15 * (this.rand < 0.5 ? 1 : -1);
    this.y -= dt * 20;

    if (Date.now() - this.startTime >= this.duration * 1000) {
      this.destroy();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // fade
    const alpha = 1 - (Date.now() - this.startTime) / (this.duration * 1000);
    ctx.save();
    ctx.globalAlpha = alpha;
    renderStrokedText(
      ctx,
      `$${this.amount.toString()}`,
      this.x,
      this.y,
      16,
      "#FFD700",
      "#000",
      1,
    );
    ctx.restore();
  }
}
