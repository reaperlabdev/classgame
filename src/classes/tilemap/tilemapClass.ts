import { Game } from "../../game";
import { TileManager } from "../../handlers/tileManager";

export class TileMap {
  game: Game;
  tileManager: TileManager;

  constructor(game: Game) {
    this.game = game;
    this.tileManager = game.globals.tileManager;
  }
}
