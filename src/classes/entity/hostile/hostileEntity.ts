import { Game } from "../../../game";
import { CashEffect } from "../effect/cash/cashEffect";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class HostileEntity extends Entity {
  constructor(game: Game, x: number, y: number) {
    super(game, EntityType.HOSTILE, 0, 0, 12, 12, 5);
  }

  takeDamage(amount: number): void {
    const realDamageDealt = Math.min(amount, this.health);
    this.health -= realDamageDealt;
    let cashEffect: CashEffect = new CashEffect(
      this.game,
      this.x,
      this.y,
      realDamageDealt,
    );
    this.game.globals.cash += realDamageDealt;
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
