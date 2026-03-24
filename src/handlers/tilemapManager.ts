import { Game } from "../game";
import { TileManager } from "./tileManager";
import { Tile } from "../classes/tile/tileClass";
import { TileRock } from "../classes/tile/rock/tileRock";
import { TilePath } from "../classes/tile/path/tilePath";

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
  tileManager: TileManager;
  private tileRegistry: Map<string, TileFactory> = new Map();

  constructor(game: Game) {
    this.game = game;
    this.tileManager = new TileManager(game);
    this.registerTileType("rock", (g, x, y) => new TileRock(g, x, y, "gray"));
    this.registerTileType("path", (g, x, y) => new TilePath(g, x, y));
  }

  registerTileType(name: string, factory: TileFactory): void {
    this.tileRegistry.set(name, factory);
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
    this.computePathOrder();
  }

  private computePathOrder(): void {
    const pathTiles = Array.from(this.tileManager.tiles.values()).filter(
      (t): t is TilePath => t instanceof TilePath,
    );

    if (pathTiles.length === 0) return;

    const posMap = new Map<string, TilePath>();
    for (const tile of pathTiles) {
      posMap.set(`${tile.x},${tile.y}`, tile);
    }

    const start = pathTiles.reduce((a, b) => (a.x < b.x ? a : b));
    const step = 16;

    const visited = new Set<string>();
    const queue: [TilePath, number][] = [[start, 0]];

    while (queue.length > 0) {
      const [tile, order] = queue.shift()!;
      const key = `${tile.x},${tile.y}`;
      if (visited.has(key)) continue;
      visited.add(key);
      tile.order = order;

      const neighbors = [
        posMap.get(`${tile.x + step},${tile.y}`),
        posMap.get(`${tile.x - step},${tile.y}`),
        posMap.get(`${tile.x},${tile.y + step}`),
        posMap.get(`${tile.x},${tile.y - step}`),
      ];

      for (const neighbor of neighbors) {
        if (neighbor && !visited.has(`${neighbor.x},${neighbor.y}`)) {
          queue.push([neighbor, order + 1]);
        }
      }
    }
  }

  update(dt: number): void {
    this.tileManager.update(dt);
  }

  render(): void {
    this.tileManager.render();
  }
}
