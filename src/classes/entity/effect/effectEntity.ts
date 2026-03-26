import { Game } from "../../../game";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class Effect extends Entity {
  startTime: number;

  constructor(
    game: Game,
    x: number,
    y: number,
    public duration: number,
  ) {
    super(game, EntityType.EFFECT, x, y, 16, 16, 0);
    this.startTime = Date.now();
  }

  update(dt: number): void {
    if (Date.now() - this.startTime >= this.duration * 1000) {
      this.destroy();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {}
}
