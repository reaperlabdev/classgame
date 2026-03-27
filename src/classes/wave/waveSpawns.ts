import { HostileEntity } from "../entity/hostile/hostileEntity";
import { Camo } from "../entity/hostile/camo/camoEntity";
import { Devil } from "../entity/hostile/devil/devilEntity";
import { Robot } from "../entity/hostile/robot/robotEntity";
import { SpeedyRobot } from "../entity/hostile/speedy/speedyEntity";

export const waveSpawns: [number, typeof HostileEntity, number][] = [
  [1, Robot, Infinity],
  [4, SpeedyRobot, Infinity],
  [7, Camo, Infinity],
  [50, Devil, 5],
  [75, Devil, 5],
];

export const specialSpawns: [number, typeof HostileEntity][] = [[25, Devil]];
