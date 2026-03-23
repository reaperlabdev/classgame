import { Game } from "../game";

export class Renderer {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  render(): void {
    this.game.renderContext.clearRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    this.game.renderContext.fillStyle = "black";
    this.game.renderContext.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    
    this.game.globals.uiHandler.render();
  }
}
