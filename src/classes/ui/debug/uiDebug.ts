import { Game } from "../../../game";
import { uiClass } from "../uiClass";

export class uiDebug extends uiClass {
  constructor(game: Game) {
    super(game);
  }

  update(dt: number) {}

  render() {
    this.renderContext.fillStyle = "white";
    this.renderContext.fillText("FPS: " + this.game.globals.fps, 5, 15);
  }
}
