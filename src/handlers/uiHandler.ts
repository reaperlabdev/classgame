import { uiClass } from "../classes/ui/uiClass";
import { Game } from "../game";

export class uiHandler {
  game: Game;
  private uiClasses: Map<string, uiClass> = new Map();

  constructor(game: Game) {
    this.game = game;
  }

  get uiClassesMap(): Map<string, uiClass> {
    return this.uiClasses;
  }

  addUIClass(uiClass: uiClass) {
    this.uiClasses.set(uiClass.id, uiClass);
  }

  getUIClass(id: string): uiClass | undefined {
    return this.uiClasses.get(id);
  }

  removeUIClass(classId: string) {
    this.uiClasses.delete(classId);
  }

  genID(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  update() {
    for (const [, uiClass] of this.uiClasses) {
      uiClass.update();
    }
  }

  render() {
    for (const [, uiClass] of this.uiClasses) {
      uiClass.render();
    }
  }
}
