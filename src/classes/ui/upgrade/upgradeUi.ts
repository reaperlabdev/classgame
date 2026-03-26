import { Game } from "../../../game";
import { renderStrokedText } from "../../../utility/uiUtil";
import {
  entityValues,
  upgradeLimits,
  upgradeSettings,
} from "../../entity/entityValues";
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

  getStatByIndex(index: number): number {
    if (!this.selected) return 0;
    switch (index) {
      case 0:
        return this.selected.damage;
      case 1:
        return this.selected.range;
      case 2:
        return this.selected.attackSpeed;
      default:
        return 0;
    }
  }

  applyUpgrade(index: number) {
    if (!this.selected) return;

    const name = this.selected.name as keyof typeof upgradeSettings;
    const settings = upgradeSettings[name];
    const limits = upgradeLimits[name];

    // 1. Identify which path we are upgrading
    let path =
      index === 0
        ? settings.damage
        : index === 1
          ? settings.range
          : settings.speed;
    let limit =
      index === 0
        ? limits.damage
        : index === 1
          ? limits.range
          : limits.attackSpeed;

    const isMicroUpgrade = Math.abs(path.step) < 0.1;

    if (isMicroUpgrade) {
      while (true) {
        const currentStat = this.getStatByIndex(index);
        const cost = this.getUpgradeCost(index, currentStat);

        if (cost === Infinity || this.game.globals.cash < cost) break;

        this.game.globals.cash -= cost;
        this.executeStatIncrease(index, path.step, limit);
      }
    } else {
      const currentStat = this.getStatByIndex(index);
      const cost = this.getUpgradeCost(index, currentStat);

      if (cost !== Infinity && this.game.globals.cash >= cost) {
        this.game.globals.cash -= cost;
        this.executeStatIncrease(index, path.step, limit);
      }
    }

    this.selected.attackSpeed = Math.max(0.05, this.selected.attackSpeed);
  }

  private executeStatIncrease(index: number, step: number, limit: number) {
    if (!this.selected) return;
    if (index === 0)
      this.selected.damage = Math.min(this.selected.damage + step, limit);
    if (index === 1)
      this.selected.range = Math.min(this.selected.range + step, limit);
    if (index === 2)
      this.selected.attackSpeed = Math.max(
        this.selected.attackSpeed + step,
        limit,
      );
  }

  getUpgradeCost(index: number, currentValue: number): number {
    if (!this.selected) return 0;

    const name = this.selected.name as keyof typeof upgradeSettings;
    const baseData = entityValues[name];
    const settings = upgradeSettings[name];
    const limits = upgradeLimits[name];

    let path, baseStat, limit;

    if (index === 0) {
      path = settings.damage;
      baseStat = baseData.damage;
      limit = limits.damage;
    } else if (index === 1) {
      path = settings.range;
      baseStat = baseData.range;
      limit = limits.range;
    } else {
      path = settings.speed;
      baseStat = baseData.attackSpeed;
      limit = limits.attackSpeed;
    }

    if (index === 2 ? currentValue <= limit : currentValue >= limit)
      return Infinity;

    const level = Math.abs((currentValue - baseStat) / path.step);
    return Math.floor(path.baseCost * Math.pow(path.growth, level));
  }

  update(dt: number) {
    const { x, y } = this.game.globals.mouseHandler.getPosition();
    const isMouseDown = this.game.globals.mouseHandler.getIsDown();
    const isSpawning = this.game.globals.spawning.selectedTurret !== null;
    let closest: TurretEntity | null = null;
    let shortestDistance = Infinity;

    if (isSpawning) {
      this.debounce = true;
      return;
    }

    if (isMouseDown) {
      if (this.debounce) return;
      this.debounce = true;

      if (this.hovered && this.hoveredButtonIndex !== null) {
        this.applyUpgrade(this.hoveredButtonIndex);
      } else {
        const entities = this.game.globals.entityManager.getEntityArray();

        for (const entity of entities) {
          if (entity instanceof TurretEntity) {
            const d = Math.hypot(x - (entity.x + 8), y - (entity.y + 8));

            if (d < 15 && d < shortestDistance) {
              closest = entity;
              shortestDistance = d;
            }
          }
        }

        if (closest) {
          this.selected = closest;
          this.selectedX = closest.x + 25;
          this.selectedY = closest.y;
        } else {
          this.selected = null;
          this.selectedX = null;
          this.selectedY = null;
        }
      }
    } else {
      this.debounce = false;
    }

    // Hover State Logic
    this.hovered = this.isHovered(x, y);
    this.hoveredButtonIndex = null;

    if (this.hovered && this.selectedX && this.selectedY) {
      const relY = y - (this.selectedY - 16 + 12);
      const index = Math.floor(relY / 26);
      if (index >= 0 && index <= 2) this.hoveredButtonIndex = index;
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
