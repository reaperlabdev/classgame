import { Game } from "../game";

export class Renderer {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  render(): void {
    const now = performance.now();
    const dt = Math.min((now - this.game.globals.frameTime) / 1000, 0.1);

    this.game.globals.fps = Math.round(1 / dt);

    this.game.renderContext.clearRect(
      0,
      0,
      this.game.canvas.width,
      this.game.canvas.height,
    );
    this.game.renderContext.fillStyle = "black";
    this.game.renderContext.fillRect(
      0,
      0,
      this.game.canvas.width,
      this.game.canvas.height,
    );

    this.game.globals.tileMapManager.render();
    this.game.globals.entityManager.render();
    this.game.globals.uiHandler.render();

    this.game.globals.frameTime = now;
  }
}
