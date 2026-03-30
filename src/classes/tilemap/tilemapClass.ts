import { Game } from "../../game";
import { Tile } from "../../classes/tile/tileClass";
import { TileHandler } from "../../handlers/tile/tileHandler";

export class TileMap {
  game: Game;
  tileHandler: TileHandler;

  constructor(game: Game) {
    this.game = game;
    this.tileHandler = new TileHandler(game);
  }

  addTile(tile: Tile) {
    this.tileHandler.addTile(tile);
  }
}
