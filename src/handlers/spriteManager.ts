import { Game } from "../game";

export class SpriteManager {
  game: Game;

  sprites: { [key: string]: HTMLImageElement } = {};

  constructor(game: Game) {
    this.game = game;
  }

  async addSprite(
    name: string,
    sprite: Promise<HTMLImageElement>,
  ): Promise<HTMLImageElement> {
    const img = await sprite;
    this.sprites[name] = img;
    return img;
  }

  getSprite(name: string): HTMLImageElement {
    for (const [key, sprite] of Object.entries(this.sprites)) {
      if (key === name) {
        return sprite;
      }
    }
    throw new Error(`Sprite ${name} not found`);
  }
}
