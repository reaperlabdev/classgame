import { Game } from "../../game";
import { TileManager } from "../../handlers/tileManager";
import { Tile } from "../../classes/tile/tileClass";

export class TileMap {
  game: Game;
  tileManager: TileManager;

  constructor(game: Game) {
    this.game = game;
    this.tileManager = new TileManager(game);
  }

  addTile(tile: Tile) {
    this.tileManager.addTile(tile);
  }
}
