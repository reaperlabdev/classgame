import { Game } from "../../../game";
import { renderStrokedText } from "../../../utility/uiUtil";
import { entityValues, upgradeLimits } from "../../entity/entityValues";
import { TurretEntity } from "../../entity/friendly/turret/turretEntity";
import { uiClass } from "../uiClass";

export class UpgradeUi extends uiClass {
  debounce: boolean = false;
  selected: TurretEntity | null = null;
  selectedX: number | null = null;
  selectedY: number | null = null;

  private hoveredButtonIndex: number | null = null;

  private readonly uiWidth = 248;
  private readonly uiHeight = 96;

  constructor(game: Game) {
    super(game);
  }

  getUpgradeCost(index: number, currentValue: number): number {
    if (!this.selected) return 0;

    const turretName = this.selected.name as keyof typeof entityValues;
    const entityData = entityValues[turretName];
    const basePrice = entityData?.cost || 25;

    if (index === 0) {
      return Math.floor(basePrice * (1 + Math.pow(currentValue, 1.2) * 0.5));
    }

    if (index === 1) {
      const rangeLevel = (currentValue - entityData.range) / 10;
      return Math.floor(basePrice * (1 + rangeLevel * 0.4));
    }

    if (index === 2) {
      const speedScale = entityData.attackSpeed / currentValue;
      return Math.floor(basePrice * Math.pow(speedScale, 2));
    }

    return basePrice;
  }

  update(dt: number) {
    const { x, y } = this.game.globals.mouseHandler.getPosition();
    let distance: number = Infinity;
    let closestTurret: TurretEntity | null = null;

    if (this.game.globals.spawning.selectedTurret !== null) {
      this.debounce = true;
      return;
    }

    this.game.globals.entityManager.getEntityArray().forEach((entity) => {
      if (entity instanceof TurretEntity) {
        const d = Math.hypot(x - entity.x, y - entity.y);
        if (d < distance) {
          closestTurret = entity;
          distance = d;
        }
      }
    });

    this.hovered = this.isHovered(x, y);
    this.hoveredButtonIndex = null;

    if (this.hovered && this.selectedX && this.selectedY) {
      const startX = this.selectedX - 16;
      const startY = this.selectedY - 16;

      const relX = x - (startX + 12);
      const relY = y - (startY + 12);

      if (relX >= 0 && relX <= 100) {
        const index = Math.floor(relY / 26);
        if (index >= 0 && index <= 2) {
          this.hoveredButtonIndex = index;
        }
      }
    }

    if (this.game.globals.mouseHandler.getIsDown()) {
      if (this.debounce) return;
      this.debounce = true;

      if (this.hoveredButtonIndex !== null && this.selected) {
        const limits =
          upgradeLimits[this.selected.name as keyof typeof upgradeLimits];
        const cash = this.game.globals.cash;

        if (this.hoveredButtonIndex === 0) {
          const cost = this.getUpgradeCost(0, this.selected.damage);
          if (this.selected.damage < limits.damage && cash >= cost) {
            this.selected.damage = Math.min(
              this.selected.damage + 1,
              limits.damage,
            );
            this.game.globals.cash -= cost;
          }
        } else if (this.hoveredButtonIndex === 1) {
          const cost = this.getUpgradeCost(1, this.selected.range);
          if (this.selected.range < limits.range && cash >= cost) {
            this.selected.range = Math.min(
              this.selected.range + 1,
              limits.range,
            );
            this.game.globals.cash -= cost;
          }
        } else if (this.hoveredButtonIndex === 2) {
          const cost = this.getUpgradeCost(2, this.selected.attackSpeed);
          if (this.selected.attackSpeed > limits.attackSpeed && cash >= cost) {
            this.selected.attackSpeed = Math.max(
              this.selected.attackSpeed - 0.02,
              limits.attackSpeed,
            );
            this.game.globals.cash -= cost;
          }
        }
        return;
      }

      if (closestTurret && distance < 20) {
        const turret = closestTurret as TurretEntity;
        this.selected = turret;
        this.selectedX = turret.x + 25;
        this.selectedY = turret.y;
      } else {
        this.selected = null;
      }
    } else {
      this.debounce = false;
    }
  }

  isHovered(x: number, y: number): boolean {
    if (!this.selected || this.selectedX === null || this.selectedY === null)
      return false;
    const renderX = this.selectedX - 16;
    const renderY = this.selectedY - 16;
    return (
      x >= renderX &&
      x <= renderX + this.uiWidth &&
      y >= renderY &&
      y <= renderY + this.uiHeight
    );
  }

  render(): void {
    if (this.selected && this.selectedX !== null && this.selectedY !== null) {
      const startX = this.selectedX - 16;
      const startY = this.selectedY - 16;
      const limits =
        upgradeLimits[this.selected.name as keyof typeof upgradeLimits];

      this.renderContext.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.renderContext.fillRect(startX, startY, this.uiWidth, this.uiHeight);

      const renderRow = (label: string, value: any, index: number) => {
        const rowY = startY + 12 + index * 26;
        const isBtnHovered = this.hoveredButtonIndex === index;

        let isMaxed = false;
        if (index === 0) isMaxed = this.selected!.damage >= limits.damage;
        if (index === 1) isMaxed = this.selected!.range >= limits.range;
        if (index === 2)
          isMaxed = this.selected!.attackSpeed <= limits.attackSpeed;

        const cost = this.getUpgradeCost(index, value);

        if (isMaxed) {
          this.renderContext.fillStyle = "rgba(100, 100, 100, 1)";
        } else {
          this.renderContext.fillStyle = isBtnHovered
            ? "rgba(255, 255, 0, 1)"
            : "rgba(255, 200, 0, 1)";
        }

        this.renderContext.fillRect(startX + 12, rowY, 100, 20);

        renderStrokedText(
          this.renderContext,
          isMaxed ? `${label} MAX` : `${label} $${cost}`,
          startX + 18,
          rowY + 15,
          11,
          isMaxed ? "white" : "black",
          "black",
          1,
        );

        renderStrokedText(
          this.renderContext,
          `${label}: ${value}`,
          startX + 130,
          rowY + 15,
          13,
          "white",
          "black",
          1,
        );
      };

      renderRow("Damage", this.selected.damage, 0);
      renderRow("Range", this.selected.range, 1);
      renderRow("Fire Rate", this.selected.attackSpeed.toFixed(2), 2);
    }
  }
}
