import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TileRock extends Tile {
  private imageAngle: number;

  constructor(game: Game, x: number, y: number, color: string) {
    super(game, x, y, "#808080", false);
    this.imageAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
  }

  renderToContext(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    hovered: boolean,
  ): void {
    const sprite = this.game.globals.tileMapManager.tileManager.getBakedSprite(
      "rock",
      this.imageAngle,
      false,
      this.width,
      this.height,
    );

    ctx.drawImage(sprite, this.x, this.y);
  }
}
