import { uiDebug } from "./classes/ui/debug/uiDebug";
import { Game } from "./game";
import { Robot } from "./classes/entity/hostile/robotEntity";
import defaultMap from "./assets/map/default.json";
import { PlayerBase } from "./classes/entity/friendly/playerBaseEntity";
import { getOrderedPath } from "./utility/entityPathing";
import { WaveManager } from "./handlers/waveManager";
import { PlayerTurret } from "./classes/entity/friendly/playerTurret";
import { loadImage } from "./utility/imageUtil";

import pathImageSrc from "./assets/tiles/path.png";
import grassImageSrc from "./assets/tiles/grass.png";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderContext = canvas.getContext("2d")!;

const game = new Game(canvas, renderContext);

async function main(): Promise<void> {
  // load sprites
  await game.globals.spriteManager.addSprite("path", loadImage(pathImageSrc));
  await game.globals.spriteManager.addSprite("grass", loadImage(grassImageSrc));

  console.log(game.globals.spriteManager.sprites);

  game.globals.mouseHandler.init();

  game.globals.uiHandler.addUIClass(new uiDebug(game));

  game.globals.tileMapManager.loadTileMapFromJson(defaultMap);

  const pathOrder = getOrderedPath(
    game.globals.tileMapManager.tileManager.tiles,
  );
  const lastTile = pathOrder[pathOrder.length - 1];
  const playerBase = new PlayerBase(game, lastTile.x, lastTile.y, 100);
  game.globals.entityManager.addEntity(playerBase);

  //  setup wave manager
  game.globals.waveManager = new WaveManager(game);

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
