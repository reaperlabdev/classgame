import { Game } from "../../../game";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class PlayerBase extends Entity {
  constructor(game: Game, x: number, y: number, health: number) {
    super(game, EntityType.BASE, x, y, 16, 16, health);
  }

  update(dt: number): void {
    this.game.globals.entityManager.entities.forEach((entity) => {
      if (entity !== this) {
        if (
          this.x < entity.x + entity.width &&
          this.x + this.width > entity.x &&
          this.y < entity.y + entity.height &&
          this.y + this.height > entity.y
        ) {
          this.takeDamage(entity.health);
          entity.destroy();
        }
      }
    });
  }

  destroy(): void {
    return;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
