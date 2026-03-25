import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

export class TileManager {
  game: Game;
  tiles = new Map<string, Tile>();
  private staticCache: OffscreenCanvas | null = null;
  private hoveredTile: Tile | null = null;

  constructor(game: Game) {
    this.game = game;
  }

  getTileArray(): Tile[] {
    return Array.from(this.tiles.values());
  }

  addTile(tile: Tile) {
    this.tiles.set(tile.id, tile);
    this.invalidateStaticCache();
  }

  removeTile(id: string) {
    this.tiles.delete(id);
    this.invalidateStaticCache();
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

  invalidateStaticCache() {
    this.staticCache = null;
  }

  private buildStaticCache() {
    console.log("building cache, tile count:", this.tiles.size);
    const { width, height } = this.game.canvas;
    this.staticCache = new OffscreenCanvas(width, height);
    const ctx = this.staticCache.getContext(
      "2d",
    ) as OffscreenCanvasRenderingContext2D;
    for (const tile of this.tiles.values()) {
      tile.renderToContext(ctx, false);
    }
  }

  setHoveredTile(tile: Tile | null) {
    console.log("setHoveredTile", tile?.id ?? "null");
    this.hoveredTile = tile;
  }

  update(dt: number) {
    for (const tile of this.tiles.values()) {
      tile.update(dt);
    }
  }

  render() {
    if (!this.staticCache) this.buildStaticCache();

    const ctx = this.game.renderContext;
    ctx.drawImage(this.staticCache!, 0, 0);

    if (this.hoveredTile) {
      this.hoveredTile.renderToContext(ctx, true);
    }
  }
}
