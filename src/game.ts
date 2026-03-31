import { Updater } from "./handlers/tick/updater";
import { Renderer } from "./handlers/tick/renderer";
import { uiHandler } from "./handlers/class/uiHandler";
import { TileMapManager } from "./handlers/tile/tilemapHandler";
import { EntityManager } from "./handlers/class/entityHandler";
import { WaveManager } from "./handlers/class/waveHandler";
import { MouseHandler } from "./handlers/input/mouseHandler";
import { SpriteManager } from "./handlers/image/spriteHandler";
import { Spawning } from "./spawning/spawning";
import { KeyboardHandler } from "./handlers/input/keyboardHandler";
import { SettingsLoader } from "./settings/settingsLoader";

interface Globals {
  maps: any;
  starting: boolean;
  forceTimePaused: boolean;
  paused: boolean;
  doubleSpeed: boolean;
  fps: number;
  time: number;
  startingHealth: number;
  startingCash: number;
  cash: number;
  score: number;
  settings: SettingsLoader;
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
  mouseHandler: MouseHandler;
  keyboardHandler: KeyboardHandler;
  spriteManager: SpriteManager;
  spawning: Spawning;
}

const _targetFPS = 60;

export class Game {
  globals: Globals = {
    maps: null,
    starting: true,
    forceTimePaused: false,
    paused: false,
    doubleSpeed: false,
    fps: 0,
    time: 0,
    startingHealth: 50,
    startingCash: 30,
    score: 0,
    cash: 30,
    settings: new SettingsLoader(),
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
  };

  constructor(
    public canvas: HTMLCanvasElement,
    public renderContext: CanvasRenderingContext2D,
  ) {
    this.globals.canvas = this.canvas;
    this.globals.renderContext = this.renderContext;
  }
}
