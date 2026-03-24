import { Game } from "../../game";

export class Tile {
  id: string;
  game: Game;
  ctx: CanvasRenderingContext2D;

  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(game: Game, x: number, y: number, color: string) {
    this.game = game;
    this.ctx = game.globals.renderContext;
    this.id = game.globals.tileManager.genID();
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.color = color;
    game.globals.tileManager.addTile(this);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {}
}
