import { HostileEntity } from "../../classes/entity/hostile/hostileEntity";
import { Robot } from "../../classes/entity/hostile/robot/robotEntity";
import { Speedy } from "../../classes/entity/hostile/speedy/speedyEntity";
import { Camo } from "../../classes/entity/hostile/camo/camoEntity";
import { Devil } from "../../classes/entity/hostile/devil/devilEntity";
import { Bomber } from "../../classes/entity/hostile/bomber/bomberEntity";
import { Factory } from "../../classes/entity/hostile/factory/factoryEntity";

export const entityRegistry: Record<string, typeof HostileEntity> = {
  Robot,
  Speedy,
  Camo,
  Devil,
  Bomber,
  Factory,
};
