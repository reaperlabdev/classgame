import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TilePath extends Tile {
  order: number = 0;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "#c2963a");
  }
}
