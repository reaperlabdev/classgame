import { Game } from "../../game";

export class uiClass {
  id: string;
  game: Game;
  renderContext: CanvasRenderingContext2D;
  hovered: boolean = false;

  constructor(game: Game) {
    this.id = game.globals.uiHandler.genID();
    this.game = game;
    this.renderContext = game.globals.renderContext;
    this.game.globals.uiHandler.addUIClass(this);
  }

  isHovered(x: number, y: number): boolean {
    return false;
  }

  update(dt: number) {}

  render() {}
}
