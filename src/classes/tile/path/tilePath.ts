import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TilePath extends Tile {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "white");
  }
}
