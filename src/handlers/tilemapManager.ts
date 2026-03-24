import { Game } from "../game";
import { TileManager } from "./tileManager";

export class TileMapManager {
  game: Game;
  tileManager: TileManager;

  constructor(game: Game) {
    this.game = game;
    this.tileManager = new TileManager(game);
  }

  update(dt: number) {
    this.tileManager.update(dt);
  }

  render() {
    this.tileManager.render();
  }
}
