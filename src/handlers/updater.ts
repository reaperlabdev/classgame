import { Game } from "../game";

export class Updater {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {
    let deltaTime = performance.now() - this.game.globals.frameTime;
    this.game.globals.fps = Math.round(1000 / deltaTime);

    this.game.globals.uiHandler.update(deltaTime);
    this.game.globals.tileMapManager.update(deltaTime);

    this.game.globals.frameTime = performance.now();
  }
}
