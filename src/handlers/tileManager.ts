import { Tile } from "../classes/tile/tileClass";
import { Game } from "../game";

export class TileManager {
  game: Game;
  tiles = new Map<string, Tile>();
  private staticCache: OffscreenCanvas | null = null;
  private hoveredTile: Tile | null = null;

  private spriteCache = new Map<string, OffscreenCanvas>();

  constructor(game: Game) {
    this.game = game;
  }

  getBakedSprite(
    spriteKey: string,
    angle: number,
    hovered: boolean,
    width: number,
    height: number,
  ): OffscreenCanvas {
    const key = `${spriteKey}:${angle}:${hovered}`;
    if (this.spriteCache.has(key)) return this.spriteCache.get(key)!;

    const image = this.game.globals.spriteManager.getSprite(spriteKey);
    const oc = new OffscreenCanvas(width, height);
    const ctx = oc.getContext("2d")!;
    ctx.filter = hovered ? "brightness(0.8)" : "brightness(1)";
    ctx.translate(width / 2, height / 2);
    ctx.rotate(angle);
    ctx.drawImage(image, -width / 2, -height / 2, width, height);

    this.spriteCache.set(key, oc);
    return oc;
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
    console.log("baking cache, tile count:", this.tiles.size);
    const time = Date.now();
    const { width, height } = this.game.canvas;
    this.staticCache = new OffscreenCanvas(width, height);
    const ctx = this.staticCache.getContext(
      "2d",
    ) as OffscreenCanvasRenderingContext2D;
    for (const tile of this.tiles.values()) {
      tile.renderToContext(ctx, false);
    }
    console.log(`bakeTime: ${(Date.now() - time) / 1000}ms`);
  }

  setHoveredTile(tile: Tile | null) {
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
