import { Game } from "../../../game";
import { renderStrokedText } from "../../../utility/uiUtil";
import { TurretEntity } from "../../entity/friendly/turret/turretEntity";
import {
  upgradeSettings,
  upgradeLimits,
  entityValues,
  UpgradePath,
} from "../../upgrades/upgrades";
import { uiClass } from "../uiClass";

export class UpgradeUi extends uiClass {
  debounce: boolean = false;
  selected: TurretEntity | null = null;
  selectedX: number | null = null;
  selectedY: number | null = null;

  private hoveredButtonIndex: number | null = null;
  private hoveredClose: boolean = false;
  private hoveredSell: boolean = false;
  private readonly uiWidth = 248;
  private readonly uiHeight = 130;

  constructor(game: Game) {
    super(game);
  }

  getStatByIndex(index: number): number {
    if (!this.selected) return 0;
    const turretType = this.selected.name as keyof typeof upgradeSettings;
    const settings = upgradeSettings[turretType] as any;
    if (!settings?.paths?.[index]) return 0;
    return (this.selected as any)[settings.paths[index].property];
  }

  applyUpgrade(index: number) {
    if (!this.selected) return;

    const turretType = this.selected.name as keyof typeof upgradeSettings;
    const settings = upgradeSettings[turretType] as any;
    const limits = upgradeLimits[turretType] as any;

    if (!settings?.paths?.[index]) {
      console.error(
        `UpgradeUI: No path found for index ${index} on ${turretType}`,
      );
      return;
    }

    const path = settings.paths[index];
    const currentStat = (this.selected as any)[path.property];
    const cost = this.getUpgradeCost(index, currentStat);

    if (cost !== Infinity && this.game.globals.cash >= cost) {
      this.game.globals.cash -= cost;
      this.executeStatIncrease(path, limits[path.property]);
    } else {
      console.warn("UpgradeUI: Upgrade failed (Insufficient funds or Maxed)");
    }

    if ("attackSpeed" in this.selected) {
      this.selected.attackSpeed = Math.max(0.05, this.selected.attackSpeed);
    }
  }

  private executeStatIncrease(path: UpgradePath, limit: number) {
    if (!this.selected) return;
    const current = (this.selected as any)[path.property];
    if (path.step > 0) {
      (this.selected as any)[path.property] = Math.min(
        current + path.step,
        limit,
      );
    } else {
      (this.selected as any)[path.property] = Math.max(
        current + path.step,
        limit,
      );
    }
  }

  getUpgradeCost(index: number, currentValue: number): number {
    if (!this.selected) return Infinity;

    const turretType = this.selected.name as keyof typeof upgradeSettings;
    const baseData = entityValues[turretType];
    const settings = upgradeSettings[turretType] as any;
    const limits = upgradeLimits[turretType];

    if (!settings?.paths?.[index] || !baseData || !limits) return Infinity;

    const path = settings.paths[index];
    const baseStat = baseData[path.property];
    const limit = limits[path.property];

    const isMaxed =
      path.step > 0 ? currentValue >= limit : currentValue <= limit;
    if (isMaxed) return Infinity;

    const level = Math.abs((currentValue - baseStat) / path.step);
    return Math.floor(path.baseCost * Math.pow(path.growth, level));
  }

  update(dt: number) {
    const { x, y } = this.game.globals.mouseHandler.getPosition();
    const isMouseDown = this.game.globals.mouseHandler.getIsDown();
    const isSpawning = this.game.globals.spawning.selectedTurret !== null;

    if (isSpawning) {
      this.selected = null;
      this.debounce = true;
      return;
    }

    if (isMouseDown) {
      if (this.debounce) return;
      this.debounce = true;

      if (this.selected && this.isHovered(x, y)) {
        if (this.hoveredClose) {
          this.selected = null;
          return;
        } else if (this.hoveredSell) {
          this.game.globals.entityManager.removeEntity(this.selected.id);
          this.selected = null;
          return;
        } else if (this.hoveredButtonIndex !== null) {
          this.applyUpgrade(this.hoveredButtonIndex);
        }
      } else {
        const entities = this.game.globals.entityManager.getEntityArray();
        let closest: TurretEntity | null = null;
        let shortestDistance = 10;

        for (const entity of entities) {
          if (entity instanceof TurretEntity) {
            const centerX = entity.x + 8;
            const centerY = entity.y + 8;
            const d = Math.hypot(x - centerX, y - centerY);
            if (d < shortestDistance) {
              closest = entity;
              shortestDistance = d;
            }
          }
        }

        if (closest) {
          this.selected = closest;
          this.selectedX = closest.x + 24;
          this.selectedY = closest.y;
        } else {
          this.selected = null;
        }
      }
    }

    if (!isMouseDown) {
      this.debounce = false;
    }

    this.hoveredButtonIndex = null;
    this.hoveredClose = false;
    this.hoveredSell = false;

    if (this.selected && this.isHovered(x, y)) {
      let startX = this.selectedX! - 16;
      let startY = this.selectedY! - 16;
      if (startX + this.uiWidth > this.game.globals.renderContext.canvas.width)
        startX = this.game.globals.renderContext.canvas.width - this.uiWidth;
      if (
        startY + this.uiHeight >
        this.game.globals.renderContext.canvas.height
      )
        startY = this.game.globals.renderContext.canvas.height - this.uiHeight;

      const bottomRowY = startY + 12 + 3 * 26 + 6;

      const relY = y - (startY + 12);
      const index = Math.floor(relY / 26);
      if (index >= 0 && index <= 2) this.hoveredButtonIndex = index;

      const closeX1 = startX + 12;
      const closeX2 = startX + 12 + 90;
      if (
        x >= closeX1 &&
        x <= closeX2 &&
        y >= bottomRowY &&
        y <= bottomRowY + 24
      )
        this.hoveredClose = true;

      const sellX1 = startX + 114;
      const sellX2 = startX + this.uiWidth - 12;
      if (x >= sellX1 && x <= sellX2 && y >= bottomRowY && y <= bottomRowY + 24)
        this.hoveredSell = true;
    }
  }

  isHovered(x: number, y: number): boolean {
    if (!this.selected || this.selectedX === null || this.selectedY === null)
      return false;

    let startX = this.selectedX - 16;
    let startY = this.selectedY - 16;

    if (startX + this.uiWidth > this.game.globals.renderContext.canvas.width)
      startX = this.game.globals.renderContext.canvas.width - this.uiWidth;
    if (startY + this.uiHeight > this.game.globals.renderContext.canvas.height)
      startY = this.game.globals.renderContext.canvas.height - this.uiHeight;

    return (
      x >= startX &&
      x <= startX + this.uiWidth &&
      y >= startY &&
      y <= startY + this.uiHeight
    );
  }

  render(): void {
    if (!this.selected || this.selectedX === null || this.selectedY === null)
      return;

    this.renderContext.save();

    let startX = this.selectedX - 16;
    let startY = this.selectedY - 16;

    if (startX + this.uiWidth > this.game.globals.renderContext.canvas.width)
      startX = this.game.globals.renderContext.canvas.width - this.uiWidth;
    if (startY + this.uiHeight > this.game.globals.renderContext.canvas.height)
      startY = this.game.globals.renderContext.canvas.height - this.uiHeight;

    const turretType = this.selected.name as keyof typeof upgradeSettings;
    const settings = upgradeSettings[turretType] as any;
    const limits = upgradeLimits[turretType] as any;

    if (!settings?.paths || !limits) return;

    this.renderContext.fillStyle = "rgba(10, 10, 15, 0.9)";
    this.renderContext.fillRect(startX, startY, this.uiWidth, this.uiHeight);

    settings.paths.forEach((path: UpgradePath, index: number) => {
      const rowY = startY + 12 + index * 26;
      const isBtnHovered = this.hoveredButtonIndex === index;
      const currentValue = (this.selected as any)[path.property];
      const limit = limits[path.property];
      const isMaxed =
        path.step > 0 ? currentValue >= limit : currentValue <= limit;
      const cost = this.getUpgradeCost(index, currentValue);

      this.renderContext.fillStyle = isMaxed
        ? "#333"
        : isBtnHovered
          ? "#ffff00"
          : "#ffcc00";
      this.renderContext.fillRect(startX + 12, rowY, 110, 22);

      const displayVal =
        typeof currentValue === "number"
          ? currentValue.toFixed(1)
          : currentValue;

      renderStrokedText(
        this.renderContext,
        isMaxed ? `${path.label} MAX` : `${path.label} $${cost}`,
        startX + 18,
        rowY + 16,
        11,
        isMaxed ? "#777" : "black",
        "black",
        1,
      );

      renderStrokedText(
        this.renderContext,
        `${path.label}: ${displayVal}`,
        startX + 135,
        rowY + 16,
        12,
        "white",
        "black",
        1,
      );
    });

    const dividerY = startY + 12 + 3 * 26 + 2;
    this.renderContext.strokeStyle = "rgba(255,255,255,0.15)";
    this.renderContext.lineWidth = 1;
    this.renderContext.beginPath();
    this.renderContext.moveTo(startX + 8, dividerY);
    this.renderContext.lineTo(startX + this.uiWidth - 8, dividerY);
    this.renderContext.stroke();

    const bottomRowY = dividerY + 4;

    this.renderContext.fillStyle = this.hoveredClose ? "#888" : "#555";
    this.renderContext.fillRect(startX + 12, bottomRowY, 90, 24);
    renderStrokedText(
      this.renderContext,
      "✕ Close",
      startX + 16,
      bottomRowY + 16,
      11,
      this.hoveredClose ? "white" : "#ddd",
      "black",
      1,
    );

    this.renderContext.fillStyle = this.hoveredSell ? "#ff4400" : "#cc3300";
    this.renderContext.fillRect(
      startX + 114,
      bottomRowY,
      this.uiWidth - 126,
      24,
    );
    renderStrokedText(
      this.renderContext,
      `Sell`,
      startX + 57 + (this.uiWidth - 126) / 2,
      bottomRowY + 16,
      11,
      "white",
      "black",
      1,
    );

    this.renderContext.restore();
  }
}
