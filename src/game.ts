import { Updater } from "./handlers/updater";
import { Renderer } from "./handlers/renderer";
import { uiHandler } from "./handlers/uiHandler";

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
  gameThread: ReturnType<typeof setInterval>;
}

export class Game {
  globals: Globals = {
    fps: 0,
    targetFPS: 60,
    frameTime: 0,
    running: false,
    canvas: this.canvas,
    renderContext: this.renderContext,
    updater: new Updater(this),
    renderer: new Renderer(this),
    uiHandler: new uiHandler(this),
    gameThread: setInterval(() => {}, 1000 / 60),
  };

  constructor(
    public canvas: HTMLCanvasElement,
    public renderContext: CanvasRenderingContext2D,
  ) {
    this.globals.canvas = this.canvas;
    this.globals.renderContext = this.renderContext;
  }
}
