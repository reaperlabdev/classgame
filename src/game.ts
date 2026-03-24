import { Updater } from "./handlers/updater";
import { Renderer } from "./handlers/renderer";
import { uiHandler } from "./handlers/uiHandler";
import { TileMapManager } from "./handlers/tilemapManager";
import { EntityManager } from "./handlers/entityManager";

interface Globals {
  fps: number;
  targetFPS: number;
  frameTime: number;
  running: boolean;
  canvas: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;
  updater: Updater;
  renderer: Renderer;
  uiHandler: uiHandler;
  tileMapManager: TileMapManager;
  entityManager: EntityManager;
  gameThread: ReturnType<typeof setInterval>;
  renderThread: ReturnType<typeof setInterval>;
}

const _targetFPS = 60;

export class Game {
  globals: Globals = {
    fps: 0,
    targetFPS: _targetFPS,
    frameTime: performance.now(),
    running: false,
    canvas: this.canvas,
    renderContext: this.renderContext,
    updater: new Updater(this),
    renderer: new Renderer(this),
    uiHandler: new uiHandler(this),
    tileMapManager: new TileMapManager(this),
    entityManager: new EntityManager(this),
    gameThread: setInterval(() => {}, 1000 / _targetFPS),
    renderThread: setInterval(() => {}, 1000 / _targetFPS),
  };

  constructor(
    public canvas: HTMLCanvasElement,
    public renderContext: CanvasRenderingContext2D,
  ) {
    this.globals.canvas = this.canvas;
    this.globals.renderContext = this.renderContext;
  }
}
