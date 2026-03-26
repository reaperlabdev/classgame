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

  update(dt: number) {}

  render() {
    if (!this.show) return;
    this.ctx.fillStyle = "white";
    this.ctx.fillText("FPS: " + this.game.globals.fps, 5, 15);
    this.ctx.fillText(
      "Wave: " + this.game.globals.waveManager?.currentWave,
      5,
      30,
    );
    this.ctx.fillText(
      "Health: " +
        this.game.globals.entityManager.getEntityByType(EntityType.BASE)[0]
          .health,
      5,
      45,
    );
    this.ctx.fillText("Cash: " + this.game.globals.cash, 5, 60);
  }
}
