import { Game } from "../../game";

export class uiClass {
  id: string;
  game: Game;
  renderContext: CanvasRenderingContext2D;

  constructor(game: Game) {
    this.id = game.globals.uiHandler.genID();
    this.game = game;
    this.renderContext = game.globals.renderContext;
  }

  update(dt: number) {}

  render() {}
}
