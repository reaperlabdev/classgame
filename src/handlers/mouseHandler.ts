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
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));

    this.canvas.addEventListener(
      "touchstart",
      (e) => {
        this.handleTouchStart(e);
      },
      { passive: false },
    );

    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false,
    });
    window.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  private updatePosition(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    this.x = (clientX - rect.left) * scaleX;
    this.y = (clientY - rect.top) * scaleY;
  }

  handleMouseMove(event: MouseEvent) {
    this.updatePosition(event.clientX, event.clientY);
  }

  handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      this.isDown = true;
      this.updatePosition(event.clientX, event.clientY);
    }
  }

  handleMouseUp() {
    this.isDown = false;
  }

  handleTouchStart(event: TouchEvent) {
    if (event.touches.length > 0) {
      event.preventDefault();
      this.isDown = true;
      this.updatePosition(event.touches[0].clientX, event.touches[0].clientY);
    }
  }

  handleTouchMove(event: TouchEvent) {
    if (event.touches.length > 0) {
      event.preventDefault();
      this.updatePosition(event.touches[0].clientX, event.touches[0].clientY);
    }
  }

  handleTouchEnd() {
    this.isDown = false;
  }

  getIsDown(): boolean {
    return this.isDown;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
}
