import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TileWater extends Tile {
  private imageAngle: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "#808080", false);
    this.imageAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
  }

  renderToContext(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    hovered: boolean,
  ): void {}

  render(ctx: CanvasRenderingContext2D) {
    const time = this.game.globals.frameTime / 1000;
    const phase = this.x * 0.3 + this.y * 0.7;

    const sprite = this.game.globals.tileMapManager.tileManager.getBakedSprite(
      "water",
      this.imageAngle,
      false,
      this.width,
      this.height,
    );

    ctx.drawImage(sprite, this.x, this.y);

    // shimmer
    const alpha1 = ((Math.sin(time * 3 + phase) + 1) / 2) * 0.12;
    const alpha2 = ((Math.sin(time * 2.3 - phase * 1.5) + 1) / 2) * 0.08;
    ctx.fillStyle = `rgba(180, 220, 255, ${alpha1})`;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha2})`;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    const grad = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.height,
    );
    grad.addColorStop(0, "rgba(0,0,20,0.18)");
    grad.addColorStop(0.5, "rgba(0,0,20,0)");
    grad.addColorStop(1, "rgba(0,0,20,0.18)");
    ctx.fillStyle = grad;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
