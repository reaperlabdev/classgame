import { Game } from "../../game";
import { EntityType } from "./entityType";

export class Entity {
  id: string;
  game: Game;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  isAlive: boolean;

  constructor(
    game: Game,
    type: EntityType,
    x: number,
    y: number,
    width: number,
    height: number,
    health: number,
  ) {
    this.id = game.globals.entityManager.genID();
    this.game = game;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.isAlive = true;
    game.globals.entityManager.addEntity(this);
  }

  update(dt: number): void {}

  render(ctx: CanvasRenderingContext2D): void {}

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy(): void {
    this.isAlive = false;
    this.game.globals.entityManager.removeEntity(this.id);
  }
}
