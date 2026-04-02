import { Game } from "../../../../game";
import { DecorEntity } from "../decorEntity";

export class Tree extends DecorEntity {
  private angle: number = 0;
  private direction: number = Math.random() * 2 - 1;
  private treeType = 1;
  private flipped = false;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y);
    this.treeType = Math.floor(Math.random() * 2) + 1;
    this.flipped = Math.floor(Math.random() * 2) == 1;
  }

  update(dt: number) {
    this.angle += dt * 0.04 * this.direction;
    if (Math.abs(this.angle) > 0.2) this.direction = -this.direction;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.x, this.y);
    if (this.flipped) ctx.scale(-1, 1);
    ctx.rotate(this.angle);

    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(`tree${this.treeType}`),
      -16,
      -16,
      32,
      32,
    );
    ctx.restore();
  }
}
