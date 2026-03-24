import { Updater } from "./handlers/updater";
import { Renderer } from "./handlers/renderer";
import { uiHandler } from "./handlers/uiHandler";
import { TileManager } from "./handlers/tileManager";

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
  tileManager: TileManager;
  gameThread: ReturnType<typeof setInterval>;
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
    tileManager: new TileManager(this),
    gameThread: setInterval(() => {}, 1000 / _targetFPS),
  };

  constructor(
    public canvas: HTMLCanvasElement,
    public renderContext: CanvasRenderingContext2D,
  ) {
    this.globals.canvas = this.canvas;
    this.globals.renderContext = this.renderContext;
  }
}
