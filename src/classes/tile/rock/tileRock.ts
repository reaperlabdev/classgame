import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TileRock extends Tile {
  constructor(game: Game, x: number, y: number, color: string) {
    super(game, x, y, "gray");
  }
}
