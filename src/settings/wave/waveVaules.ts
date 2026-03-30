import { HostileEntity } from "../../classes/entity/hostile/hostileEntity";
import { entityRegistry } from "./entityRegistry";
import waveData from "./waveSettings.json";

export const waveSpawns: [number, typeof HostileEntity, number][] =
  waveData.waveSpawns.map(({ wave, entity, max }) => [
    wave,
    entityRegistry[entity],
    max ?? Infinity,
  ]);

export const specialSpawns: [number, [typeof HostileEntity, number][]][] =
  waveData.specialSpawns.map(({ wave, entities }) => [
    wave,
    entities.map(({ entity, max }) => [
      entityRegistry[entity],
      max ?? Infinity,
    ]),
  ]);
