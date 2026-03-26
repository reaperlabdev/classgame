import { uiDebug } from "./classes/ui/debug/debugUi";
import { SpawnUi } from "./classes/ui/spawn/spawnUi";

import { Game } from "./game";
import { Robot } from "./classes/entity/hostile/robot/robotEntity";
import defaultMap from "./assets/map/default.json";
import { PlayerBase } from "./classes/entity/friendly/playerBaseEntity";
import { getOrderedPath } from "./utility/entityPathing";
import { WaveManager } from "./handlers/waveManager";
import { loadImage } from "./utility/imageUtil";

import pathImageSrc from "./assets/tiles/path.png";
import grassImageSrc from "./assets/tiles/grass.png";
import robotImageSrc from "./assets/robots/robot.png";
import turretImageSrc from "./assets/turrets/turret.png";
import sniperImageSrc from "./assets/turrets/sniper.png";

import { HudUi } from "./classes/ui/hud/hudUi";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderContext = canvas.getContext("2d")!;

const game = new Game(canvas, renderContext);

async function main(): Promise<void> {
  // add game to document
  (document as any).game = game;

  // load sprites
  await game.globals.spriteManager.addSprite("path", loadImage(pathImageSrc));
  await game.globals.spriteManager.addSprite("grass", loadImage(grassImageSrc));
  await game.globals.spriteManager.addSprite("robot", loadImage(robotImageSrc));

  await game.globals.spriteManager.addSprite(
    "turret",
    loadImage(turretImageSrc),
  );
  await game.globals.spriteManager.addSprite(
    "sniper",
    loadImage(sniperImageSrc),
  );
  console.log(game.globals.spriteManager.sprites);

  game.globals.mouseHandler.init();

  new uiDebug(game);

  game.globals.tileMapManager.loadTileMapFromJson(defaultMap);

  const pathOrder = getOrderedPath(
    game.globals.tileMapManager.tileManager.tiles,
  );
  const lastTile = pathOrder[pathOrder.length - 1];
  const playerBase = new PlayerBase(game, lastTile.x, lastTile.y, 5);
  game.globals.entityManager.addEntity(playerBase);

  //  setup wave manager
  game.globals.waveManager = new WaveManager(game);

  // setup spawn UI
  new SpawnUi(game);

  new HudUi(game);

  game.globals.gameThread = setInterval(() => {
    game.globals.updater.update();
  }, 1000 / game.globals.targetFPS);

  game.globals.renderThread = () => {
    game.globals.renderer.render();
    requestAnimationFrame(game.globals.renderThread);
  };
  game.globals.renderThread();
}

main();
