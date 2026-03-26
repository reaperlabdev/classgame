import { Game } from "../../../game";
import { uiClass } from "../uiClass";
import { entityValues } from "../../entity/entityValues";
import {
  getBoxLayout,
  getHoveredIndex,
  renderDoubleLabeledBox,
  renderDoubleLabeledBoxRow,
} from "../../../utility/uiUtil";

export class SpawnUi extends uiClass {
  debounce: boolean = false;
  private pressedKeys: Set<string> = new Set();
  mouseX: number;
  mouseY: number;
  turrets: string[] = ["Turret", "Sniper", "Machine", "Spike"];
  selectedTurret: string | null = null;

  private readonly boxSize = 42;
  private readonly boxSpacing = 54;
  private readonly boxBorder = 2;
  private readonly rowCenterX = 400;
  private readonly rowBaseY = 445;

  constructor(game: Game) {
    super(game);
    this.mouseX = 0;
    this.mouseY = 0;
  }

  private getPositions() {
    return getBoxLayout(
      this.turrets.length,
      this.boxSpacing,
      this.boxSize,
      this.rowCenterX,
      this.rowBaseY,
    );
  }

  update(dt: number) {
    const { x, y } = this.game.globals.mouseHandler.getPosition();
    this.mouseX = x;
    this.mouseY = y;

    if (this.game.globals.keyboardHandler.isKeyDown(" ")) {
      this.selectedTurret = null;
    }

    for (let i = 0; i < this.turrets.length; i++) {
      const key = String(i + 1);
      if (this.game.globals.keyboardHandler.isKeyDown(key)) {
        if (!this.pressedKeys.has(key)) {
          this.pressedKeys.add(key);
          if (this.selectedTurret !== this.turrets[i]) {
            this.selectedTurret = this.turrets[i];
            this.game.globals.spawning.select(this.turrets[i]);
          } else {
            this.selectedTurret = null;
            this.game.globals.spawning.select(null);
          }
        }
      } else {
        this.pressedKeys.delete(key);
      }
    }

    if (this.game.globals.mouseHandler.getIsDown()) {
      if (this.debounce) return;
      this.debounce = true;
      const idx = getHoveredIndex(
        this.mouseX,
        this.mouseY,
        this.getPositions(),
        this.boxSize,
        this.boxBorder,
      );
      if (idx !== -1) {
        if (this.selectedTurret !== this.turrets[idx]) {
          this.selectedTurret = this.turrets[idx];
          this.game.globals.spawning.select(this.turrets[idx]);
        } else {
          this.selectedTurret = null;
        }
      } else {
        this.selectedTurret = null;
      }
    } else {
      this.debounce = false;
    }
  }

  isHovered(x: number, y: number): boolean {
    return (
      getHoveredIndex(
        x,
        y,
        this.getPositions(),
        this.boxSize,
        this.boxBorder,
      ) !== -1
    );
  }

  render() {
    const turretSubLabels: string[] = [
      "$" + entityValues.Turret.cost.toString(),
      "$" + entityValues.Sniper.cost.toString(),
      "$" + entityValues.Machine.cost.toString(),
      "$" + entityValues.Spike.cost.toString(),
    ];

    renderDoubleLabeledBoxRow(
      this.renderContext,
      this.turrets,
      turretSubLabels,
      this.getPositions(),
      this.boxSize,
      this.boxBorder,
    );
    // put down arrow above selected
    const selectedIdx = this.turrets.indexOf(this.selectedTurret!);
    if (selectedIdx !== -1) {
      const { x, y } = this.getPositions()[selectedIdx];
      this.game.renderContext.save();
      // outline
      this.game.renderContext.strokeStyle = "#121212";
      this.game.renderContext.lineWidth = 2;
      this.game.renderContext.strokeText("▼", x + this.boxSize / 2 - 4, y - 10);

      // fill
      this.renderContext.fillStyle = "#ffffff";
      this.renderContext.fillText("▼", x + this.boxSize / 2 - 4, y - 10);
      this.game.renderContext.restore();
    }
  }
}
