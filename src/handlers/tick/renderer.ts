import { Game } from "../../game";

export class Renderer {
  private game: Game;
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;

  offsetX: number = 0;
  offsetY: number = 0;
  targetOffsetX: number = 0;
  targetOffsetY: number = 0;

  constructor(game: Game) {
    this.game = game;
  }

  screenshake(intensity: number, duration: number): void {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  render(): void {
    const now = performance.now();
    const dt = Math.min((now - this.game.globals.frameTime) / 1000, 0.1);
    this.game.globals.fps = Math.round(1 / dt);
    this.game.globals.frameTime = now;
    const ctx = this.game.renderContext;
    const { width, height } = this.game.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    let shakeOffsetX = 0;
    let shakeOffsetY = 0;
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      shakeOffsetX = Math.round(
        (Math.random() - 0.5) * 2 * this.shakeIntensity,
      );
      shakeOffsetY = Math.round(
        (Math.random() - 0.5) * 2 * this.shakeIntensity,
      );
    }

    this.offsetX += (shakeOffsetX - this.offsetX) * dt * 15;
    this.offsetY += (shakeOffsetY - this.offsetY) * dt * 15;
    ctx.translate(Math.round(this.offsetX), Math.round(this.offsetY));

    ctx.fillStyle = "#121212";
    ctx.fillRect(-20, -20, width + 40, height + 40);
    this.game.globals.tileMapManager.render();
    this.game.globals.entityManager.render();
    this.game.globals.spawning.render(ctx);
    ctx.restore();
    this.game.globals.uiHandler.render();
  }
}
