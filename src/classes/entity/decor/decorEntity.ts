import { Game } from "../../../game";
import { Entity } from "../entityClass";
import { EntityType } from "../entityType";

export class DecorEntity extends Entity {
  constructor(game: Game, x: number, y: number) {
    super(game, EntityType.DECOR, x, y, 64, 64, 100);
  }
}
