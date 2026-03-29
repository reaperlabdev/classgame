import { Game } from "../../../game";
import { renderStrokedText } from "../../../utility/uiUtil";
import { uiClass } from "../uiClass";

export class EndingUi extends uiClass {
  constructor(game: Game) {
    super(game);
  }

  update(dt: number) {
    if (!this.game.globals.forceTimePaused) {
      return;
    }

    if (this.game.globals.mouseHandler.getIsDown()) {
      this.game.globals.forceTimePaused = false;
    }
  }

  render() {
    if (!this.game.globals.forceTimePaused) {
      return;
    }
    renderStrokedText(
      this.renderContext,
      "Total Score: " + this.game.globals.score,
      800 / 2 -
        this.game.renderContext.measureText(
          "Total Score: " + this.game.globals.score,
        ).width *
          2,
      512 / 2,
      32,
      "yellow",
      "black",
      2,
    );

    renderStrokedText(
      this.renderContext,
      "Click to Retry",
      800 / 2 - this.game.renderContext.measureText("Click to Retry").width * 2,
      512 / 2 + 64,
      32,
      "white",
      "black",
      2,
    );
  }
}
