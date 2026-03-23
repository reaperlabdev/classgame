import { Game } from "../game";

export class Updater {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {
    this.game.globals.fps = Math.round(
      1000 / (performance.now() - this.game.globals.frameTime),
    );

    this.game.globals.uiHandler.update();

    this.game.globals.frameTime = performance.now();
  }
}
