import { Game } from "../game";

export class Updater {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {
    const now = performance.now();
    const dt = Math.min((now - this.game.globals.frameTime) / 1000, 0.1);

    this.game.globals.fps = Math.round(1 / dt);

    this.game.globals.tileMapManager.update(dt);
    this.game.globals.entityManager.update(dt);
    this.game.globals.uiHandler.update(dt);

    this.game.globals.frameTime = now;
  }
}
