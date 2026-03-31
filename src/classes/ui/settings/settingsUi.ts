import { Game } from "../../../game";
import { Settings } from "../../../settings/settingsLoader";
import { uiClass } from "../uiClass";
import {
  renderDoubleLabeledBox,
  renderStrokedText,
} from "../../../utility/uiUtil";

export class SettingsUi extends uiClass {
  ctx: CanvasRenderingContext2D;
  inputDebounce: boolean = false;
  settingsVisible: boolean = false;
  mouseX: number = 0;
  mouseY: number = 0;
  settings: Settings;
  clickDebounce: boolean = false;

  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private effectsEnabled: boolean = true;

  private readonly PANEL_W = 400;
  private readonly PANEL_H = 120;
  private readonly BOX_SIZE = 48;
  private readonly BOX_BORDER = 2;
  private readonly GRID_GAP = 12;

  constructor(game: Game) {
    super(game);
    this.ctx = game.globals.renderContext;
    this.settings = game.globals.settings.getSettings();
    this.musicEnabled = this.settings.music;
    this.sfxEnabled = this.settings.sfx;
    this.effectsEnabled = this.settings.effects;
  }

  private get panelX(): number {
    return this.game.globals.canvas.width / 2 - this.PANEL_W / 2;
  }
  private get panelY(): number {
    return this.game.globals.canvas.height / 2 - this.PANEL_H / 2;
  }

  private get rows() {
    return [
      {
        label: "Music",
        sub: this.musicEnabled ? "ON" : "OFF",
        value: this.musicEnabled,
      },
      {
        label: "SFX",
        sub: this.sfxEnabled ? "ON" : "OFF",
        value: this.sfxEnabled,
      },
      {
        label: "FX",
        sub: this.effectsEnabled ? "ON" : "OFF",
        value: this.effectsEnabled,
      },
    ];
  }
  private getButtonX(index: number): number {
    const totalGridWidth =
      this.rows.length * this.BOX_SIZE + (this.rows.length - 1) * this.GRID_GAP;
    const startX = this.panelX + this.PANEL_W / 2 - totalGridWidth / 2;
    return startX + index * (this.BOX_SIZE + this.GRID_GAP);
  }

  private get buttonY(): number {
    return this.panelY + 45;
  }

  private isInsidePanel(x: number, y: number): boolean {
    return (
      x >= this.panelX &&
      x <= this.panelX + this.PANEL_W &&
      y >= this.panelY &&
      y <= this.panelY + this.PANEL_H
    );
  }

  private isHitBox(x: number, y: number, i: number): boolean {
    const bx = this.getButtonX(i);
    const by = this.buttonY;
    return (
      x >= bx && x <= bx + this.BOX_SIZE && y >= by && y <= by + this.BOX_SIZE
    );
  }

  update(dt: number): void {
    this.mouseX = this.game.globals.mouseHandler.x;
    this.mouseY = this.game.globals.mouseHandler.y;

    if (
      this.inputDebounce &&
      !this.game.globals.keyboardHandler.isKeyDown("m")
    ) {
      this.inputDebounce = false;
    }
    if (
      this.game.globals.keyboardHandler.isKeyDown("m") &&
      !this.inputDebounce
    ) {
      this.inputDebounce = true;
      this.settingsVisible = !this.settingsVisible;
    }

    if (!this.settingsVisible) return;

    const isDown = this.game.globals.mouseHandler.getIsDown();

    if (isDown) {
      if (this.clickDebounce) return;
      this.clickDebounce = true;

      if (!this.isInsidePanel(this.mouseX, this.mouseY)) {
        this.settingsVisible = false;
        return;
      }

      for (let i = 0; i < this.rows.length; i++) {
        if (this.isHitBox(this.mouseX, this.mouseY, i)) {
          if (i === 0) this.musicEnabled = !this.musicEnabled;
          if (i === 1) this.sfxEnabled = !this.sfxEnabled;
          if (i === 2) this.effectsEnabled = !this.effectsEnabled;
          this.applySettings();
          break;
        }
      }
    } else {
      this.clickDebounce = false;
    }
  }

  private applySettings(): void {
    this.settings.music = this.musicEnabled;
    this.settings.sfx = this.sfxEnabled;
    this.settings.effects = this.effectsEnabled;
    this.game.globals.settings.saveSettings();
  }

  render(): void {
    if (!this.settingsVisible) return;

    const ctx = this.ctx;
    const px = this.panelX;
    const py = this.panelY;

    ctx.save();

    ctx.fillStyle = "rgba(10, 10, 20, 0.9)";
    ctx.fillRect(px, py, this.PANEL_W, this.PANEL_H);
    ctx.strokeStyle = "#444466";
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, this.PANEL_W, this.PANEL_H);

    renderStrokedText(
      ctx,
      "SETTINGS",
      px + this.PANEL_W / 2 - 40,
      py + 25,
      18,
      "#ffffff",
      "#000000",
      2,
    );

    this.rows.forEach((row, i) => {
      const bx = this.getButtonX(i);
      const by = this.buttonY;

      renderDoubleLabeledBox(
        this.renderContext,
        bx,
        by,
        this.BOX_SIZE,
        this.BOX_BORDER,
        row.label,
        row.sub,
      );
    });

    ctx.restore();
  }
}
