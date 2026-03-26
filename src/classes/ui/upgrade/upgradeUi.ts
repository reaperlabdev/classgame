import { Game } from "../../../game";
import { TurretEntity } from "../../entity/friendly/turret/turretEntity";
import { uiClass } from "../uiClass";

export class UpgradeUi extends uiClass {
  debounce: boolean = false;
  selected: typeof TurretEntity | null = null;

  constructor(game: Game) {
    super(game);
  }

  selectTurret(turret: typeof TurretEntity) {
    this.selected = turret;
  }

  update(dt: number) {
    const { x, y } = this.game.globals.mouseHandler.getPosition();
    let distance: number | null = null;
    let closestTurret: TurretEntity | null = null;

    this.game.globals.entityManager.getEntityArray().forEach((entity) => {
      if (entity instanceof TurretEntity) {
        const d = Math.hypot(x - entity.x, y - entity.y);
        if (closestTurret === null || d < distance!) {
          closestTurret = entity;
          distance = d;
        }
      }
    });

    if (this.game.globals.mouseHandler.getIsDown()) {
      if (this.debounce) return;
      if (closestTurret && distance) {
        this.debounce = true;
        if (distance < 15) {
          this.selected = closestTurret;
          console.log(closestTurret);
        } else {
          this.selected = null;
        }
      } else {
        this.selected = null;
      }
    } else if (!this.game.globals.mouseHandler.getIsDown()) {
      this.debounce = false;
    }
  }

  render(): void {
    if (this.selected) {
      this.renderContext.fillStyle = "rgba(0, 0, 0, 0.5)";
      console.log(this.selected);
      this.renderContext.fillRect(
        this.selected.prototype.x - 32 / 2,
        this.selected.prototype.y - 32 / 2,
        32,
        32,
      );
    }
  }
}
