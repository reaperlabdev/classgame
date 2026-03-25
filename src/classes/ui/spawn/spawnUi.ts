import { uiClass } from "../uiClass";
import { Game } from "../../../game";
import { entityValues } from "../../entity/entityValues";
import { TurretEntity } from "../../entity/friendly/turret/turretEntity";
import { BaseTurret } from "../../entity/friendly/turret/baseTurret/baseTurret";
import {
  getBoxLayout,
  getHoveredIndex,
  renderLabeledBox,
  renderLabeledBoxRow,
} from "../../../utility/uiUtil";

export class SpawnUi extends uiClass {
  mouseX: number;
  mouseY: number;

  turrets: string[] = ["Turret", "Sniper"];

  constructor(game: Game) {
    super(game);
    this.mouseX = 0;
    this.mouseY = 0;
  }

  private getPositions() {
    return getBoxLayout(this.turrets.length, 40, 32, 400, 475);
  }

  update(dt: number) {
    const { x, y } = this.game.globals.mouseHandler.getPosition();
    this.mouseX = x;
    this.mouseY = y;

    if (this.game.globals.mouseHandler.getIsDown()) {
      const idx = getHoveredIndex(
        this.mouseX,
        this.mouseY,
        this.getPositions(),
        32,
        2,
      );
      if (idx !== -1) {
        this.game.globals.spawning.select(this.turrets[idx]);
      }
    }
  }

  isHovered(x: number, y: number): boolean {
    return getHoveredIndex(x, y, this.getPositions(), 32, 2) !== -1;
  }

  render() {
    renderLabeledBoxRow(
      this.renderContext,
      this.turrets,
      this.getPositions(),
      32,
      2,
    );
  }
}
