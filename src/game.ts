import { Updater } from "./handlers/updater";
import { Renderer } from "./handlers/renderer";
import { uiHandler } from "./handlers/uiHandler";
import { TileManager } from "./handlers/tileManager";
import { TileMapManager } from "./handlers/tilemapManager";

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
  gameThread: ReturnType<typeof setInterval>;
  renderThread: ReturnType<typeof setInterval>;
}

const _targetFPS = 60;

export class Game {
  globals: Globals = {
    fps: 0,
    targetFPS: _targetFPS,
    frameTime: 0,
    running: false,
    canvas: this.canvas,
    renderContext: this.renderContext,
    updater: new Updater(this),
    renderer: new Renderer(this),
    uiHandler: new uiHandler(this),
    tileMapManager: new TileMapManager(this),
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
