import { uiDebug } from "./classes/ui/debug/uiDebug";
import { Game } from "./game";
import { Robot } from "./classes/entity/hostile/robotEntity";
import defaultMap from "./assets/map/default.json";
import { PlayerBase } from "./classes/entity/friendly/playerBaseEntity";
import { getOrderedPath } from "./utility/entityPathing";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderContext = canvas.getContext("2d")!;

const game = new Game(canvas, renderContext);

function main(): void {
  game.globals.uiHandler.addUIClass(new uiDebug(game));

  game.globals.tileMapManager.loadTileMapFromJson(defaultMap);

  // place playerBase at end of path
  const pathOrder = getOrderedPath(
    game.globals.tileMapManager.tileManager.tiles,
  );
  const lastTile = pathOrder[pathOrder.length - 1];
  const playerBase = new PlayerBase(game, lastTile.x, lastTile.y, 100);
  game.globals.entityManager.addEntity(playerBase);

  new Robot(game);

  game.globals.gameThread = setInterval(() => {
    game.globals.updater.update();
  }, 1000 / game.globals.targetFPS);

  game.globals.renderThread = setInterval(() => {
    game.globals.renderer.render();
  }, 1000 / game.globals.targetFPS);
}

main();
