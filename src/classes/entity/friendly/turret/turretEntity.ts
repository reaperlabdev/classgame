import { Game } from "../../../../game";
import { Entity } from "../../entityClass";
import { EntityType } from "../../entityType";

export class TurretEntity extends Entity {
  damage: number = 1;
  range: number = 100;
  attackSpeed: number = 0.6;
  lastAttackTime: number = Date.now();

  constructor(game: Game, x: number, y: number) {
    super(game, EntityType.TURRET, x, y, 16, 16, 100);
  }
}
