import { Entity } from "../classes/entity/entityClass";
import { Tile } from "../classes/tile/tileClass";

export function distance(a: number, b: number): number {
  return Math.abs(a - b);
}
