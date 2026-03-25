import { Game } from "../../../game";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class HostileEntity extends Entity {
  constructor(game: Game, x: number, y: number) {
    super(game, EntityType.HOSTILE, 0, 0, 12, 12, 5);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    this.game.globals.cash += amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
