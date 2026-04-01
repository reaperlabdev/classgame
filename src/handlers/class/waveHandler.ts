import { EntityType } from "../../classes/entity/entityType";
import { PlayerBase } from "../../classes/entity/friendly/playerBaseEntity";
import { Game } from "../../game";
import { Robot } from "../../classes/entity/hostile/basic/robot/robotEntity";
import { WaveType } from "../../settings/wave/waveType";
import { specialSpawns, waveSpawns } from "../../settings/wave/waveVaules";
import { HostileEntity } from "../../classes/entity/hostile/hostileEntity";
import {
  entityValues,
  entityDefaults,
} from "../../settings/entity/entityValues";

export class WaveManager {
  game: Game;
  base: PlayerBase;

  private spawnTypes: (typeof HostileEntity)[] = [];
  private typeTracker: Record<string, [number, number]> = {};

  waveType: WaveType = WaveType.START;
  toSpawn: number = 5;

  private spawnTimer: number = 0;
  spawned: number = 0;

  pauseTimer: number = 0;
  currentWave: number = 1;

  constructor(game: Game) {
    this.game = game;

    this.base = this.game.globals.entityManager
      .getEntityArray()
      .find((ent): ent is PlayerBase => ent.type === EntityType.BASE)!;
  }

  reset(): void {
    this.game.globals.tileMapManager.genNewMap(this.game.globals.maps);
    this.game.globals.forceTimePaused = true;

    this.waveType = WaveType.START;
    this.toSpawn = 5;
    this.spawnTimer = 0;
    this.spawned = 0;
    this.pauseTimer = 0;
    this.currentWave = 1;

    for (const key of Object.keys(entityValues)) {
      entityValues[key].cost = entityDefaults[key].cost;
    }

    this.base = this.game.globals.entityManager
      .getEntityArray()
      .find((ent): ent is PlayerBase => ent.type === EntityType.BASE)!;

    this.game.globals.cash = this.game.globals.startingCash;
    this.base.health = this.base.maxHealth;
  }

  getSpawning(): number {
    let amt: number = this.toSpawn + this.currentWave * 0.1;
    return Math.floor(amt);
  }

  update(dt: number): void {
    let isSpecialWave = false;
    for (let i = 0; i < specialSpawns.length; i++) {
      if (this.currentWave === specialSpawns[i][0]) {
        isSpecialWave = true;
        break;
      }
    }

    if (this.base.health <= 0) {
      this.reset();
      return;
    }

    if (this.waveType === WaveType.START) {
      this.spawnTypes = [];
      this.typeTracker = {};

      if (isSpecialWave) {
        for (let i = 0; i < specialSpawns.length; i++) {
          if (this.currentWave === specialSpawns[i][0]) {
            const entries = specialSpawns[i][1];

            let totalToSpawn = 0;
            for (const [SpecialClass, max] of entries) {
              this.spawnTypes.push(SpecialClass);
              this.typeTracker[SpecialClass.name] = [max, 0];
              totalToSpawn += max;
            }
            this.toSpawn = totalToSpawn;
            break;
          }
        }
      } else {
        for (let i = 0; i < waveSpawns.length; i++) {
          if (this.currentWave >= waveSpawns[i][0]) {
            const SpawnClass = waveSpawns[i][1];
            const maxForThisEntry = waveSpawns[i][2];
            const className = SpawnClass.name;

            if (!this.typeTracker[className]) {
              this.spawnTypes.push(SpawnClass);
              this.typeTracker[className] = [0, 0];
            }
            this.typeTracker[className][0] += maxForThisEntry;
          }
        }
        this.toSpawn = this.currentWave === 1 ? 3 : this.getSpawning();
      }

      this.spawnTimer = 0;
      this.waveType = WaveType.SPAWNING;
    }

    if (this.waveType === WaveType.SPAWNING) {
      const baseInterval = 0.8;
      const waveFactor = 1 + (this.currentWave - 1) * 0.1;
      const spawnSpeed = Math.max(0.05, baseInterval / waveFactor);

      this.spawnTimer += dt;

      if (this.spawnTimer >= spawnSpeed) {
        const availableTypes = this.spawnTypes.filter(
          (T) => this.typeTracker[T.name][1] < this.typeTracker[T.name][0],
        );

        if (this.spawned < this.toSpawn && availableTypes.length > 0) {
          const SelectedClass =
            availableTypes[Math.floor(Math.random() * availableTypes.length)];
          new SelectedClass(this.game, 32);

          this.typeTracker[SelectedClass.name][1]++;
          this.spawned++;
          this.spawnTimer = 0;
        } else {
          this.waveType = WaveType.WAITING;
        }
      }
    }

    if (this.waveType === WaveType.WAITING) {
      const enemies = this.game.globals.entityManager
        .getEntityArray()
        .filter((ent): ent is Robot => ent.type === EntityType.HOSTILE);

      if (enemies.length === 0) {
        this.game.globals.cash += this.currentWave * 10;
        this.currentWave++;
        this.spawned = 0;
        this.waveType = WaveType.END;
        this.pauseTimer = 0;
      }
    }

    if (this.waveType === WaveType.END) {
      this.pauseTimer += dt;
      if (this.pauseTimer >= 3.0) {
        this.waveType = WaveType.START;
        this.pauseTimer = 0;
      }
    }
  }
}
