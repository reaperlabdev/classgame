import { Game } from "../../../game";
import { renderStrokedText } from "../../../utility/uiUtil";
import { TurretEntity } from "../../entity/friendly/turret/turretEntity";
import {
  upgradeSettings,
  upgradeLimits,
  UpgradePath,
  entityValues,
} from "../../../settings/entity/entityValues";
import { uiClass } from "../uiClass";

export class UpgradeUi extends uiClass {
  debounce: boolean = false;
  selected: TurretEntity | null = null;
  selectedX: number | null = null;
  selectedY: number | null = null;

  private hoveredButtonIndex: number | null = null;
  private hoveredClose: boolean = false;
  private hoveredSell: boolean = false;
  private readonly uiMinWidth = 220;
  private readonly uiHeight = 130;
  private _cachedUiWidth: number = 220;

  constructor(game: Game) {
    super(game);
  }

  private measureText(text: string, fontSize: number): number {
    return this.game.renderContext.measureText(text).width * 1.67;
  }

  private computeUiWidth(): number {
    if (!this.selected) {
      this._cachedUiWidth = this.uiMinWidth;
      return this._cachedUiWidth;
    }

    const turretType = this.selected.name as keyof typeof upgradeSettings;
    const settings = upgradeSettings[turretType] as any;

    if (!settings?.paths) {
      this._cachedUiWidth = this.uiMinWidth;
      return this._cachedUiWidth;
    }

    let maxRowWidth = 0;

    settings.paths.forEach((path: UpgradePath, index: number) => {
      const currentValue = (this.selected as any)[path.property];
      const cost = this.getUpgradeCost(index, currentValue);
      const btnLabel =
        cost === Infinity ? `${path.label} MAX` : `${path.label} $${cost}`;
      const statLabel = `${path.label}: ${
        typeof currentValue === "number"
          ? currentValue.toFixed(1)
          : currentValue
      }`;
      const rowWidth =
        this.measureText(btnLabel, 11) +
        16 +
        16 +
        this.measureText(statLabel, 12) +
        20;
      if (rowWidth > maxRowWidth) maxRowWidth = rowWidth;
    });

    this._cachedUiWidth = Math.max(
      this.uiMinWidth,
      Math.ceil(maxRowWidth) + 24,
    );
    return this._cachedUiWidth;
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
      return;
    }

    const path = settings.paths[index];
    const currentStat = (this.selected as any)[path.property];
    const cost = this.getUpgradeCost(index, currentStat);

    if (cost !== Infinity && this.game.globals.cash >= cost) {
      this.game.globals.cash -= cost;
      this.executeStatIncrease(path, limits[path.property]);
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
    const baseStat = baseData[path.property] ?? currentValue;
    const limit = limits[path.property];

    const isMaxed =
      path.step > 0 ? currentValue >= limit : currentValue <= limit;
    if (isMaxed) return Infinity;

    const level = Math.abs((currentValue - baseStat) / path.step);
    return Math.floor(path.baseCost * Math.pow(path.growth, level));
  }

  private getBottomButtonLayout(uiWidth: number): {
    btnW: number;
    closeX: number;
    sellX: number;
  } {
    const gap = 8;
    const sidePad = 12;
    const btnW = Math.floor((uiWidth - sidePad * 2 - gap) / 2);
    const closeX = sidePad;
    const sellX = sidePad + btnW + gap;
    return { btnW, closeX, sellX };
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

    if (this.selected) {
      this.computeUiWidth();
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
          this.computeUiWidth();
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
      const uiWidth = this._cachedUiWidth;

      let startX = this.selectedX! - 16;
      let startY = this.selectedY! - 16;

      if (startX + uiWidth > this.game.globals.renderContext.canvas.width)
        startX = this.game.globals.renderContext.canvas.width - uiWidth;
      if (
        startY + this.uiHeight >
        this.game.globals.renderContext.canvas.height
      )
        startY = this.game.globals.renderContext.canvas.height - this.uiHeight;

      const bottomRowY = startY + 12 + 3 * 26 + 6;
      const { btnW, closeX, sellX } = this.getBottomButtonLayout(uiWidth);

      const relY = y - (startY + 12);
      const index = Math.floor(relY / 26);
      if (index >= 0 && index <= 2) this.hoveredButtonIndex = index;

      if (
        x >= startX + closeX &&
        x <= startX + closeX + btnW &&
        y >= bottomRowY &&
        y <= bottomRowY + 24
      )
        this.hoveredClose = true;

      if (
        x >= startX + sellX &&
        x <= startX + sellX + btnW &&
        y >= bottomRowY &&
        y <= bottomRowY + 24
      )
        this.hoveredSell = true;
    }
  }

  isHovered(x: number, y: number): boolean {
    if (!this.selected || this.selectedX === null || this.selectedY === null)
      return false;

    const uiWidth = this._cachedUiWidth;

    let startX = this.selectedX - 16;
    let startY = this.selectedY - 16;

    if (startX + uiWidth > this.game.globals.renderContext.canvas.width)
      startX = this.game.globals.renderContext.canvas.width - uiWidth;
    if (startY + this.uiHeight > this.game.globals.renderContext.canvas.height)
      startY = this.game.globals.renderContext.canvas.height - this.uiHeight;

    return (
      x >= startX &&
      x <= startX + uiWidth &&
      y >= startY &&
      y <= startY + this.uiHeight
    );
  }

  render(): void {
    if (!this.selected || this.selectedX === null || this.selectedY === null)
      return;

    this.renderContext.save();

    const uiWidth = this.computeUiWidth();

    let startX = this.selectedX - 16;
    let startY = this.selectedY - 16;

    if (startX + uiWidth > this.game.globals.renderContext.canvas.width)
      startX = this.game.globals.renderContext.canvas.width - uiWidth;
    if (startY + this.uiHeight > this.game.globals.renderContext.canvas.height)
      startY = this.game.globals.renderContext.canvas.height - this.uiHeight;

    const turretType = this.selected.name as keyof typeof upgradeSettings;
    const settings = upgradeSettings[turretType] as any;
    const limits = upgradeLimits[turretType] as any;

    if (!settings?.paths || !limits) return;

    const panelMid = Math.floor(uiWidth * 0.48);
    const btnColW = panelMid - 24;

    this.renderContext.fillStyle = "rgba(10, 10, 15, 0.9)";
    this.renderContext.fillRect(startX, startY, uiWidth, this.uiHeight);

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
      this.renderContext.fillRect(startX + 12, rowY, btnColW, 22);

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
        startX + panelMid + 11,
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
    this.renderContext.lineTo(startX + uiWidth - 8, dividerY);
    this.renderContext.stroke();

    const bottomRowY = dividerY + 4;
    const { btnW, closeX, sellX } = this.getBottomButtonLayout(uiWidth);

    this.renderContext.fillStyle = this.hoveredClose ? "#888" : "#555";
    this.renderContext.fillRect(startX + closeX, bottomRowY, btnW, 24);
    renderStrokedText(
      this.renderContext,
      "✕ Close",
      startX + closeX + btnW / 2 - this.measureText("✕ Close", 11) / 2,
      bottomRowY + 16,
      11,
      this.hoveredClose ? "white" : "#ddd",
      "black",
      1,
    );

    this.renderContext.fillStyle = this.hoveredSell ? "#ff4400" : "#cc3300";
    this.renderContext.fillRect(startX + sellX, bottomRowY, btnW, 24);
    renderStrokedText(
      this.renderContext,
      "Sell",
      startX + sellX + btnW / 2 - this.measureText("Sell", 11) / 2,
      bottomRowY + 16,
      11,
      "white",
      "black",
      1,
    );

    this.renderContext.restore();
  }
}
