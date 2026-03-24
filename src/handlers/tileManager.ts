import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

export class TileManager {
  game: Game;

  tiles = new Map<string, Tile>();

  constructor(game: Game) {
    this.game = game;
  }

  addTile(tile: Tile) {
    this.tiles.set(tile.id, tile);
  }

  genID(): string {
    let id: string;
    do {
      id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    } while (this.tiles.has(id));
    return id;
  }

  update(dt: number) {
    for (const tile of this.tiles.values()) {
      tile.update(dt);
    }
  }

  render() {
    for (const tile of this.tiles.values()) {
      tile.render(this.game.renderContext);
    }
  }
}
