import { Game } from "../../../game";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class PlayerBase extends Entity {
  targetSprite: string = "trailer";
  renderOffX = -48;

  constructor(game: Game, x: number, y: number, health: number) {
    super(game, EntityType.BASE, x, y, 16, 16, health);
    if (y == 512 - 16) {
      this.targetSprite = "flag";
      this.renderOffX = -5;
    }
  }

  update(dt: number): void {
    if (this.hurtTime > 0) {
      this.hurtTime -= dt;
    }

    this.game.globals.entityManager.entities.forEach((entity) => {
      if (entity !== this) {
        if (
          this.x < entity.x + entity.width &&
          this.x + this.width > entity.x &&
          this.y < entity.y + entity.height &&
          this.y + this.height > entity.y
        ) {
          this.takeDamage(entity, entity.health);
          entity.destroy();
        }
      }
    });
  }

  destroy(): void {
    return;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    if (this.hurtTime > 0) {
      ctx.filter = "invert(100%)";
    }
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(this.targetSprite),
      this.x + this.renderOffX,
      this.y - 48,
      64,
      64,
    );

    ctx.restore();
  }
}
