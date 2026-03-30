import { Game } from "../../../game";
import { EntityType } from "../../entity/entityType";
import { uiClass } from "../uiClass";

export class uiDebug extends uiClass {
  show: boolean = false;
  ctx: CanvasRenderingContext2D;

  constructor(game: Game) {
    super(game);
    this.ctx = game.globals.renderContext;
  }

  update(dt: number) {
    this.show = this.game.globals.keyboardHandler.isKeyDown("`");
  }

  render() {
    if (!this.show) return;
    this.ctx.fillStyle = "white";
    this.ctx.fillText("FPS: " + this.game.globals.fps, 5, 15);
    this.ctx.fillText(
      "Entities: " + this.game.globals.entityManager.getEntityArray().length,
      5,
      30,
    );
    this.ctx.fillText(
      "Tiles: " + this.game.globals.tileMapManager.getTileArray().length,
      5,
      45,
    );
  }
}
