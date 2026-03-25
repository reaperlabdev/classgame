import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TileGrass extends Tile {
  private imageAngle: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "#008000");
    this.imageAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
  }

  renderToContext(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    hovered: boolean,
  ): void {
    const sprite = this.game.globals.tileMapManager.tileManager.getBakedSprite(
      "grass",
      this.imageAngle,
      hovered,
      this.width,
      this.height,
    );
    ctx.drawImage(sprite, this.x, this.y);
  }
}
