export function toHex(color: string): string {
  return color.replace(/^#/, "");
}

export function toRGBA(color: string, alpha: number): string {
  const hex = toHex(color);
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `#${hex}${a}`;
}

export function toHSL(color: string): string {
  const hex = toHex(color);
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    s = (max - min) / (l < 0.5 ? 2 * l : 2 - 2 * l);
  }
  let h = 0;
  if (max !== min) {
    h =
      (max === r
        ? (g - b) / (max - min)
        : max === g
          ? (b - r) / (max - min) + 2
          : (r - g) / (max - min) + 4) * 60;
  }
  if (h < 0) h += 360;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function darken(color: string, amount: number): string {
  const hsl = toHSL(color);
  const [h, s, l] = hsl.slice(4, -1).split(", ").map(parseFloat);
  return `hsl(${h}, ${s}%, ${Math.max(0, l - amount)}%)`;
}

export function lighten(color: string, amount: number): string {
  const hsl = toHSL(color);
  const [h, s, l] = hsl.slice(4, -1).split(", ").map(parseFloat);
  return `hsl(${h}, ${s}%, ${Math.min(100, l + amount)}%)`;
}

export function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.slice(4, -1).split(", ").map(parseFloat);
  const sn = s / 100;
  const ln = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) =>
    ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
