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
    ctx.drawImage(
      this.game.globals.spriteManager.getSprite(this.targetSprite),
      this.game.globals.renderer.offsetX + this.x + this.renderOffX,
      this.game.globals.renderer.offsetY + this.y - 48,
      64,
      64,
    );
  }
}
