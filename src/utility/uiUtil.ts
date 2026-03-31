export interface BoxStyle {
  borderColor?: string;
  boxColor?: string;
  textColor?: string;
  textColor2?: string;
  font?: string;
}

const DEFAULT_STYLE: BoxStyle = {
  borderColor: "#121212",
  boxColor: "#323232",
  textColor: "#ffffff",
  textColor2: "#FFD700",
  font: "12px Courier New",
};

export function getBoxLayout(
  count: number,
  spacing: number,
  boxSize: number,
  centerX: number,
  baseY: number,
) {
  const totalWidth = count * spacing;
  const startX = centerX - totalWidth / 2;
  return Array.from({ length: count }, (_, i) => ({
    x: startX + i * spacing,
    y: baseY,
  }));
}

export function isPointInBox(
  px: number,
  py: number,
  bx: number,
  by: number,
  boxSize: number,
  border: number,
): boolean {
  return (
    px >= bx - border &&
    px <= bx + boxSize + border &&
    py >= by - border &&
    py <= by + boxSize + border
  );
}

export function getHoveredIndex(
  mouseX: number,
  mouseY: number,
  positions: { x: number; y: number }[],
  boxSize: number,
  border: number,
): number {
  return positions.findIndex(({ x, y }) =>
    isPointInBox(mouseX, mouseY, x, y, boxSize, border),
  );
}

export function renderLabeledBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  boxSize: number,
  border: number,
  label: string,
  style: BoxStyle = {},
) {
  ctx.save();
  const { borderColor, boxColor, textColor, font } = {
    ...DEFAULT_STYLE,
    ...style,
  };

  ctx.fillStyle = borderColor!;
  ctx.fillRect(
    x - border,
    y - border,
    boxSize + border * 2,
    boxSize + border * 2,
  );

  ctx.fillStyle = boxColor!;
  ctx.fillRect(x, y, boxSize, boxSize);

  ctx.fillStyle = textColor!;
  ctx.font = font!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + boxSize / 2, y + boxSize / 2);

  ctx.restore();
}

export function renderLabeledBoxRow(
  ctx: CanvasRenderingContext2D,
  labels: string[],
  positions: { x: number; y: number }[],
  boxSize: number,
  border: number,
  style?: BoxStyle,
) {
  labels.forEach((label, i) =>
    renderLabeledBox(
      ctx,
      positions[i].x,
      positions[i].y,
      boxSize,
      border,
      label,
      style,
    ),
  );
}

export function renderDoubleLabeledBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  boxSize: number,
  border: number,
  primaryLabel: string,
  secondaryLabel: string,
  style: BoxStyle = {},
) {
  ctx.save();
  const { borderColor, boxColor, textColor, textColor2, font } = {
    ...DEFAULT_STYLE,
    ...style,
  };

  ctx.fillStyle = borderColor!;
  ctx.fillRect(
    x - border,
    y - border,
    boxSize + border * 2,
    boxSize + border * 2,
  );

  ctx.fillStyle = boxColor!;
  ctx.fillRect(x, y, boxSize, boxSize);

  ctx.fillStyle = textColor!;
  ctx.font = font!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(primaryLabel, x + boxSize / 2, y + boxSize * 0.33);

  ctx.fillStyle = textColor2!;
  ctx.fillText(secondaryLabel, x + boxSize / 2, y + boxSize * 0.67);

  ctx.restore();
}

export function renderDoubleLabeledBoxRow(
  ctx: CanvasRenderingContext2D,
  primaryLabels: string[],
  secondaryLabels: string[],
  positions: { x: number; y: number }[],
  boxSize: number,
  border: number,
  style?: BoxStyle,
) {
  primaryLabels.forEach((label, i) =>
    renderDoubleLabeledBox(
      ctx,
      positions[i].x,
      positions[i].y,
      boxSize,
      border,
      label,
      secondaryLabels[i] ?? "",
      style,
    ),
  );
}

export function renderStrokedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  strokeColor: string,
  strokeWidth: number,
) {
  ctx.save();
  ctx.font = `${fontSize}px Courier New`;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  ctx.restore();
}

export function renderCenteredStrokedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: string,
  strokeColor: string,
  strokeWidth: number,
) {
  ctx.save();
  ctx.font = `${fontSize}px Courier New`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  x = x + ctx.measureText(text).width / 2;

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);

  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  ctx.restore();
}
