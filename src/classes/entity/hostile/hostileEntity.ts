import { Game } from "../../../game";
import { play } from "../../../utility/audioUtil";
import { CashEffect } from "../effect/cash/cashEffect";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class HostileEntity extends Entity {
  pathProgress: number = 0;

  constructor(game: Game, size: number) {
    super(game, EntityType.HOSTILE, 0, 0, size, size, 5);
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
      play("hostileDeath");
      this.destroy();
    }
  }
}
