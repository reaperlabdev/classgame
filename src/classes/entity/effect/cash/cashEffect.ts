import { Game } from "../../../../game";
import { renderStrokedText } from "../../../../utility/uiUtil";
import { Effect } from "../effectEntity";

export class CashEffect extends Effect {
  rand: number;
  private age: number = 0;

  constructor(
    game: Game,
    x: number,
    y: number,
    public amount: number,
  ) {
    super(game, x + Math.random() * 16, y + 5 , 0.8);
    this.rand = Math.random();
  }

  update(dt: number): void {
    this.age += dt;

    this.x += dt * 15 * (this.rand < 0.5 ? 1 : -1);
    this.y -= dt * 20;

    if (this.age >= this.duration) {
      this.destroy();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    const alpha = Math.max(0, 1 - this.age / this.duration);

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
