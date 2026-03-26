import { HostileEntity } from "../entity/hostile/hostileEntity";
import { Robot } from "../entity/hostile/robot/robotEntity";
import { SpeedyRobot } from "../entity/hostile/speedy/speedyEntity";

export const waveSpawns: [number, typeof HostileEntity][] = [
  [1, Robot],
  [4, SpeedyRobot],
];
