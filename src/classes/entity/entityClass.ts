import { EntityType } from "./entityType";

export class Entity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  isAlive: boolean;

  constructor(
    id: string,
    type: EntityType,
    x: number,
    y: number,
    width: number,
    height: number,
    health: number,
  ) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.isAlive = true;
  }

  update(deltaTime: number): void {
    // Override in subclasses for custom update logic
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Override in subclasses for custom rendering
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy(): void {
    this.isAlive = false;
    // Additional cleanup logic can go here
  }
}
