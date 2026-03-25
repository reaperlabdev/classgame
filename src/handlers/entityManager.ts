import { Game } from "../game";
import { Entity } from "../classes/entity/entityClass";
import { EntityType } from "../classes/entity/entityType";

export class EntityManager {
  game: Game;
  entities: Map<string, Entity> = new Map();

  constructor(game: Game) {
    this.game = game;
  }

  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  removeEntity(id: string): void {
    this.entities.delete(id);
  }

  genID(): string {
    let id: string;
    do {
      id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
    } while (this.entities.has(id));
    return id;
  }

  getEntityArray(): Entity[] {
    return Array.from(this.entities.values());
  }

  getEntityByType(type: EntityType): Entity[] {
    return this.getEntityArray().filter((entity) => entity.type === type);
  }

  update(dt: number): void {
    for (const entity of this.entities.values()) {
      entity.update(dt);
    }
  }

  render(): void {
    for (const entity of this.entities.values()) {
      entity.render(this.game.renderContext);
    }
  }
}
