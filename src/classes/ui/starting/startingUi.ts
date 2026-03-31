import { renderStrokedText } from "../../../utility/uiUtil";
import { uiClass } from "../uiClass";

export class StartingUi extends uiClass {
  constructor(game: any) {
    super(game);
  }

  update(dt: number) {
    if (!this.game.globals.starting) {
      return;
    }

    if (this.game.globals.mouseHandler.getIsDown()) {
      this.game.globals.starting = false;
    }
  }

  render() {
    if (!this.game.globals.starting) {
      return;
    }
    renderStrokedText(
      this.renderContext,
      "Click/Tap to Start",
      800 / 2 -
        this.game.renderContext.measureText("Click/Tap to Start").width * 2.5,
      512 / 2,
      32,
      "yellow",
      "black",
      2,
    );
  }
}
