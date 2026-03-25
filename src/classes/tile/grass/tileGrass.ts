import { Game } from "../../../game";
import { Tile } from "../tileClass";

export class TileGrass extends Tile {
  private cachedCanvas: OffscreenCanvas | null = null;
  private cachedHoveredCanvas: OffscreenCanvas | null = null;
  private imageAngle: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, "#008000");
    this.imageAngle = Math.floor(Math.random() * 4) * (Math.PI / 2);
  }

  private ensureCached(): void {
    if (this.cachedCanvas) return;
    const image = this.game.globals.spriteManager.getSprite("grass");
    this.cachedCanvas = this.bakeCanvas(image, this.imageAngle, false);
    this.cachedHoveredCanvas = this.bakeCanvas(image, this.imageAngle, true);
  }

  private bakeCanvas(
    image: HTMLImageElement,
    angle: number,
    hovered: boolean,
  ): OffscreenCanvas {
    const oc = new OffscreenCanvas(this.width, this.height);
    const ctx = oc.getContext("2d")!;
    ctx.filter = hovered ? "brightness(0.8)" : "brightness(1)";
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate(angle);
    ctx.drawImage(
      image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );
    return oc;
  }

  renderToContext(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    hovered: boolean,
  ): void {
    this.ensureCached();
    ctx.drawImage(
      hovered ? this.cachedHoveredCanvas! : this.cachedCanvas!,
      this.x,
      this.y,
    );
  }
}
