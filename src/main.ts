import { uiDebug } from "./classes/ui/debug/uiDebug";
import { Game } from "./game";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderContext = canvas.getContext("2d")!;

const game = new Game(canvas, renderContext);

function main(): void {
  game.globals.uiHandler.addUIClass(new uiDebug(game));

  game.globals.gameThread = setInterval(() => {
    game.globals.updater.update();
  }, 1000 / game.globals.targetFPS);

  game.globals.renderThread = setInterval(() => {
    game.globals.renderer.render();
  }, 1000 / game.globals.targetFPS);
}

main();
