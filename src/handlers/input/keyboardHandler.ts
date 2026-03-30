import { Game } from "../../game";

export class KeyboardHandler {
  game: Game;
  keys: Record<string, boolean> = {};

  constructor(game: Game) {
    this.game = game;
    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  isKeyDown(key: string): boolean {
    return this.keys[key] ?? false;
  }
}
