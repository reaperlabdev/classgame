import { Game } from "../../../game";
import { EntityType } from "../../entity/entityType";
import { uiClass } from "../uiClass";

export class uiDebug extends uiClass {
  constructor(game: Game) {
    super(game);
  }

  update(dt: number) {}

  render() {
    this.renderContext.fillStyle = "white";
    this.renderContext.fillText("FPS: " + this.game.globals.fps, 5, 15);
    this.renderContext.fillText(
      "Wave: " + this.game.globals.waveManager?.currentWave,
      5,
      30,
    );
    this.renderContext.fillText("Health: " + this.game.globals.entityManager.getEntityByType(EntityType.BASE)[0].health, 5, 45);
  }
}
