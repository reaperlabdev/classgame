import { Updater } from "./handlers/updater";
import { Renderer } from "./handlers/renderer";
import { uiHandler } from "./handlers/uiHandler";
import { TileMapManager } from "./handlers/tilemapManager";
import { EntityManager } from "./handlers/entityManager";
import { WaveManager } from "./handlers/waveManager";
import { MouseHandler } from "./handlers/mouseHandler";
import { SpriteManager } from "./handlers/spriteManager";
import { Spawning } from "./spawning/spawning";
import { KeyboardHandler } from "./handlers/keyboardHandler";

interface Globals {
  fps: number;
  startingHealth: number;
  startingCash: number;
  cash: number;
  targetFPS: number;
  targetTile: any;
  frameTime: number;
  running: boolean;
  canvas: HTMLCanvasElement;
  renderContext: CanvasRenderingContext2D;
  updater: Updater;
  renderer: Renderer;
  uiHandler: uiHandler;
  tileMapManager: TileMapManager;
  entityManager: EntityManager;
  waveManager: any;
  gameThread: ReturnType<typeof setInterval>;
  renderThread: any;
  waveThread: ReturnType<typeof setInterval>;
  mouseHandler: MouseHandler;
  keyboardHandler: KeyboardHandler;
  spriteManager: SpriteManager;
  spawning: Spawning;
}

const _targetFPS = 60;

export class Game {
  globals: Globals = {
    fps: 0,
    startingHealth: 50,
    startingCash: 30,
    cash: 30,
    targetFPS: _targetFPS,
    targetTile: null,
    frameTime: performance.now(),
    running: false,
    canvas: this.canvas,
    renderContext: this.renderContext,
    updater: new Updater(this),
    renderer: new Renderer(this),
    uiHandler: new uiHandler(this),
    keyboardHandler: new KeyboardHandler(this),
    tileMapManager: new TileMapManager(this),
    entityManager: new EntityManager(this),
    mouseHandler: new MouseHandler(this),
    spriteManager: new SpriteManager(this),
    spawning: new Spawning(this),
    waveManager: null,
    gameThread: setInterval(() => {}, 1000 / _targetFPS),
    renderThread: setInterval(() => {}, 1000 / _targetFPS),
    waveThread: setInterval(() => {}, 1000 / _targetFPS),
  };

  constructor(
    public canvas: HTMLCanvasElement,
    public renderContext: CanvasRenderingContext2D,
  ) {
    this.globals.canvas = this.canvas;
    this.globals.renderContext = this.renderContext;
  }
}
