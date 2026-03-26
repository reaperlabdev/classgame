import { EntityType } from "../classes/entity/entityType";
import { PlayerBase } from "../classes/entity/friendly/playerBaseEntity";
import { Game } from "../game";
import { Robot } from "../classes/entity/hostile/robot/robotEntity";
import { WaveType } from "../classes/wave/waveType";
import { waveSpawns } from "../classes/wave/waveSpawns";
import { HostileEntity } from "../classes/entity/hostile/hostileEntity";
import { placementSettings } from "../classes/entity/entityValues";

export class WaveManager {
  game: Game;
  base: PlayerBase;

  waveType: WaveType = WaveType.START;
  toSpawn: number = 5;

  lastSpawned: number = Date.now();
  spawned: number = 0;

  pauseStart: number = 0;
  currentWave: number = 1;

  constructor(game: Game) {
    this.game = game;

    this.base = this.game.globals.entityManager
      .getEntityArray()
      .find((ent): ent is PlayerBase => ent.type === EntityType.BASE)!;
  }

  reset(): void {
    this.waveType = WaveType.START;
    this.toSpawn = 5;
    this.lastSpawned = Date.now();
    this.spawned = 0;
    this.pauseStart = 0;
    this.currentWave = 1;
    this.game.globals.cash = this.game.globals.startingCash;

    this.game.globals.entityManager.getEntityArray().forEach((ent) => {
      if (ent !== this.base) {
        this.game.globals.entityManager.removeEntity(ent.id);
      }
    });

    this.base.health = this.base.maxHealth;
  }

  getSpawning(): number {
    // increase spawn amt per wave
    let amt: number = this.toSpawn + this.currentWave * 0.1;
    console.log(amt);
    return amt;
  }

  update(dt: number): void {
    let spawnTypes: (typeof HostileEntity)[] = [];

    for (let i = 0; i < waveSpawns.length; i++) {
      if (this.currentWave >= waveSpawns[i][0]) {
        spawnTypes.push(waveSpawns[i][1]);
      }
    }

    if (this.currentWave === 1) {
      this.toSpawn = 3;
    }

    if (this.base.health <= 0) {
      this.reset();
      return;
    }

    if (this.waveType === WaveType.START) {
      this.toSpawn = this.getSpawning();
      this.waveType = WaveType.SPAWNING;
    }

    if (this.waveType === WaveType.SPAWNING) {
      const baseInterval = 800;
      const waveFactor = 1 + (this.currentWave - 1) * 0.1;
      const spawnSpeed = Math.max(50, baseInterval / waveFactor);
      if (Date.now() - this.lastSpawned < spawnSpeed) return;

      if (this.spawned < this.toSpawn) {
        new spawnTypes[Math.floor(Math.random() * spawnTypes.length)](
          this.game,
          32,
        );
        this.lastSpawned = Date.now();
        this.spawned++;
      } else {
        this.waveType = WaveType.WAITING;
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
        this.pauseStart = Date.now();
      }
    }

    if (this.waveType === WaveType.END) {
      if (Date.now() - this.pauseStart >= 3000) {
        this.waveType = WaveType.START;
        this.pauseStart = 0;
      }
    }
  }
}
