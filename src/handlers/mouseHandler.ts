import { Game } from "../game";

export class MouseHandler {
  canvas: HTMLCanvasElement;
  x: number = 0;
  y: number = 0;
  isDown: boolean = false;

  constructor(game: Game) {
    this.canvas = game.canvas;
  }

  init() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  handleMouseMove(event: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.x = event.clientX - rect.left;
    this.y = event.clientY - rect.top;
  }

  handleMouseDown(event: MouseEvent) {
    this.isDown = event.button === 0;
  }

  handleMouseUp(event: MouseEvent) {
    this.isDown = false;
  }

  getIsDown(): boolean {
    return this.isDown;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
}
