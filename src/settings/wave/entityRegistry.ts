import { HostileEntity } from "../../classes/entity/hostile/hostileEntity";
import { Robot } from "../../classes/entity/hostile/robot/robotEntity";
import { Speedy } from "../../classes/entity/hostile/speedy/speedyEntity";
import { Camo } from "../../classes/entity/hostile/camo/camoEntity";
import { Devil } from "../../classes/entity/hostile/devil/devilEntity";

export const entityRegistry: Record<string, typeof HostileEntity> = {
  Robot,
  Speedy,
  Camo,
  Devil,
};
