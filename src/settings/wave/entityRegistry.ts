import { HostileEntity } from "../../classes/entity/hostile/hostileEntity";
import { Robot } from "../../classes/entity/hostile/basic/robot/robotEntity";
import { Speedy } from "../../classes/entity/hostile/basic/speedy/speedyEntity";
import { Camo } from "../../classes/entity/hostile/basic/camo/camoEntity";
import { Devil } from "../../classes/entity/hostile/boss/devil/devilBoss";
import { Bomber } from "../../classes/entity/hostile/basic/bomber/bomberEntity";
import { Factory } from "../../classes/entity/hostile/boss/factory/factoryBoss";
import { Jammer } from "../../classes/entity/hostile/boss/jammer/jammerBoss";
import { Shifter } from "../../classes/entity/hostile/boss/shifter/shifterBoss";
import { Phaser } from "../../classes/entity/hostile/boss/phaser/phaserBoss";

export const entityRegistry: Record<string, typeof HostileEntity> = {
  Robot,
  Speedy,
  Camo,
  Devil,
  Bomber,
  Factory,
  Phaser,
  Shifter,
  Jammer,
};
