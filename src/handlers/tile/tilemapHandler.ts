import { Game } from "../../game";
import { Tile } from "../../classes/tile/tileClass";
import { TileRock } from "../../classes/tile/rock/tileRock";
import { TilePath } from "../../classes/tile/path/tilePath";
import { TileGrass } from "../../classes/tile/grass/tileGrass";
import { TileHandler } from "./tileHandler";
import { TileMap } from "../../classes/tilemap/tilemapClass";
import { PlayerBase } from "../../classes/entity/friendly/playerBaseEntity";
import {
  getOrderedPath,
  invalidatePathCache,
} from "../../utility/entityPathing";
import { TileWater } from "../../classes/tile/water/tileWater";
import { Tree } from "../../classes/entity/decor/tree/treeEntity";
import { Rock } from "../../classes/entity/decor/rock/rockEntity";

export interface TileMapJson {
  tileSize: number;
  width: number;
  height: number;
  tileTypes: Record<string, string>;
  layers: TileMapLayerJson[];
}
export interface TileMapLayerJson {
  name: string;
  data: number[][];
}
export type TileFactory = (game: Game, x: number, y: number) => Tile;

export class TileMapManager {
  game: Game;
  tileManager: TileHandler;
  private tileRegistry: Map<string, TileFactory> = new Map();

  private mapPixelWidth = 0;
  private mapPixelHeight = 0;

  constructor(game: Game) {
    this.game = game;
    this.tileManager = new TileHandler(game);
    this.registerTileType("grass", (g, x, y) => new TileGrass(g, x, y));
    this.registerTileType("rock", (g, x, y) => new TileRock(g, x, y, "gray"));
    this.registerTileType("path", (g, x, y) => new TilePath(g, x, y));
    this.registerTileType("water", (g, x, y) => new TileWater(g, x, y));
  }

  getTileArray(): Tile[] {
    return this.tileManager.getTileArray();
  }

  clearTiles() {
    this.tileManager.tiles.clear();
  }

  registerTileType(name: string, factory: TileFactory): void {
    this.tileRegistry.set(name, factory);
  }

  async genNewMap(maps: Array<TileMapJson>) {
    const startTime = performance.now();
    invalidatePathCache();
    this.clearTiles();

    const ind = Math.floor(Math.random() * maps.length);
    const mapJson = maps[ind];
    this.loadTileMapFromJson(mapJson);

    // clear entities
    this.game.globals.entityManager.entities.clear();

    const pathOrder = getOrderedPath(
      this.game.globals.tileMapManager.tileManager.tiles,
    );
    const lastTile = pathOrder[pathOrder.length - 1];

    for (const tile of this.game.globals.tileMapManager.tileManager.getTileArray()) {
      if (tile instanceof TileGrass) {
        const nearbyEntities = Array.from(
          this.game.globals.entityManager.entities.values(),
        ).filter(
          (entity) =>
            entity instanceof Tree ||
            entity instanceof Rock ||
            entity instanceof PlayerBase,
        );
        const isNearby = nearbyEntities.some(
          (entity) =>
            Math.abs(entity.x - tile.x) < 32 &&
            Math.abs(entity.y - tile.y) < 32,
        );

        const tiles =
          this.game.globals.tileMapManager.tileManager.getTileArray();
        const nearbyTiles = tiles.filter(
          (otherTile) =>
            Math.abs(otherTile.x - tile.x) < 32 &&
            Math.abs(otherTile.y - tile.y) < 32,
        );
        const isRockNearby = nearbyTiles.some(
          (otherTile) => otherTile instanceof TileRock,
        );

        if (isNearby || isRockNearby) continue;

        const chance = Math.floor(Math.random() * 50);
        console.log(chance);
        if (chance == 1) {
          console.log("tree!");
          new Tree(this.game, tile.x, tile.y);
        } else if (Math.floor(Math.random() * 100) == 1) {
          new Rock(this.game, tile.x, tile.y);
        }
      }
    }

    const endTime = performance.now();
    console.log(`decor and tile generation took ${endTime - startTime}ms`);

    const playerBase = new PlayerBase(
      this.game,
      lastTile.x,
      lastTile.y,
      this.game.globals.startingHealth,
    );
    this.game.globals.entityManager.entities.set(playerBase.id, playerBase);
  }

  async loadFile(path: string): Promise<void> {
    const response = await fetch(path);
    if (!response.ok)
      throw new Error(
        `[TileMapManager] ${response.status} ${response.statusText}: ${path}`,
      );
    this.loadTileMapFromJson(await response.json());
  }

  loadTileMapFromJson(json: TileMapJson): void {
    this.mapPixelWidth = json.width * json.tileSize;
    this.mapPixelHeight = json.height * json.tileSize;

    for (const layer of json.layers) {
      for (let row = 0; row < json.height; row++) {
        for (let col = 0; col < json.width; col++) {
          const typeName = json.tileTypes[String(layer.data[row][col])];
          if (!typeName || typeName === "empty") continue;
          const factory = this.tileRegistry.get(typeName);
          if (!factory) continue;
          factory(this.game, col * json.tileSize, row * json.tileSize);
        }
      }
    }

    this.computePathOrder(json.tileSize);
  }

  private computePathOrder(tileSize: number): void {
    const pathTiles = Array.from(this.tileManager.tiles.values()).filter(
      (t): t is TilePath => t instanceof TilePath,
    );
    if (pathTiles.length === 0) return;

    const posMap = new Map<string, TilePath>();
    for (const tile of pathTiles) {
      posMap.set(`${tile.x},${tile.y}`, tile);
    }

    const maxX = this.mapPixelWidth - tileSize;
    const maxY = this.mapPixelHeight - tileSize;

    const edgeTiles = pathTiles.filter(
      (t) => t.x === 0 || t.y === 0 || t.x === maxX || t.y === maxY,
    );

    const start =
      edgeTiles.find((t) => t.x === 0 || t.y === 0) ??
      edgeTiles[0] ??
      pathTiles.reduce((a, b) => (a.x < b.x ? a : b));

    const visited = new Set<string>();
    const queue: [TilePath, number][] = [[start, 0]];

    while (queue.length > 0) {
      const [tile, order] = queue.shift()!;
      const key = `${tile.x},${tile.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      tile.order = order;

      const neighbours = [
        posMap.get(`${tile.x + tileSize},${tile.y}`),
        posMap.get(`${tile.x - tileSize},${tile.y}`),
        posMap.get(`${tile.x},${tile.y + tileSize}`),
        posMap.get(`${tile.x},${tile.y - tileSize}`),
      ];

      for (const neighbour of neighbours) {
        if (neighbour && !visited.has(`${neighbour.x},${neighbour.y}`)) {
          queue.push([neighbour, order + 1]);
        }
      }
    }

    const unreached = pathTiles.filter((t) => !visited.has(`${t.x},${t.y}`));
  }

  update(dt: number): void {
    this.tileManager.update(dt);
  }

  render(): void {
    this.tileManager.render();
  }
}
