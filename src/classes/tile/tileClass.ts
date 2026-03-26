import { Game } from "../../game";
import { darken, hslToHex } from "../../utility/colorUtil";

export class Tile {
  id: string;
  game: Game;
  ctx: CanvasRenderingContext2D;
  hovered: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hoverColor: string;
  canHover: boolean;

  constructor(
    game: Game,
    x: number,
    y: number,
    color: string,
    canHover: boolean,
  ) {
    this.game = game;
    this.ctx = game.globals.renderContext;
    this.id = game.globals.tileMapManager.tileManager.genID();
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.color = color;
    this.hoverColor = hslToHex(darken(color, 4));
    this.hovered = false;
    this.canHover = canHover;
    game.globals.tileMapManager.tileManager.addTile(this);
  }

  renderToContext(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    hovered: boolean,
  ): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderToContext(ctx, this.hovered);
  }

  update(dt: number) {}
}
