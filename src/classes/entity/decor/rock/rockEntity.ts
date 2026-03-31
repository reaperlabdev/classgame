import { Game } from "../../../../game";
import { DecorEntity } from "../decorEntity";

export class Rock extends DecorEntity {
  private rockType = 1;
  private flipped = false;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y);
    this.rockType = Math.floor(Math.random() * 3) + 1;
    this.flipped = Math.floor(Math.random() * 2) == 1;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.x, this.y);
    if (this.flipped) ctx.scale(-1, 1);

    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(`rock${this.rockType}`),
      -8,
      -8,
      16,
      16,
    );
    ctx.restore();
  }
}
