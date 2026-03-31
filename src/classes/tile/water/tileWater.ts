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
    if (Math.floor(Math.random() * 100) === 0) {
      this.imageAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
    }
    const sprite = this.game.globals.tileMapManager.tileManager.getBakedSprite(
      "water",
      this.imageAngle,
      false,
      this.width,
      this.height,
    );

    ctx.drawImage(sprite, this.x, this.y);
  }
}
