import { EntityType } from "../classes/entity/entityType";
import { PlayerBase } from "../classes/entity/friendly/playerBaseEntity";
import { Game } from "../game";
import { Robot } from "../classes/entity/hostile/robot/robotEntity";
import { WaveType } from "../classes/wave/waveType";

export class WaveManager {
  game: Game;
  base: PlayerBase;

  waveType: WaveType = WaveType.START;
  toSpawn: number = 5;

  lastSpawned: number = Date.now();
  spawned: number = 0;

  pauseStart: number = 0; // <-- changed
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
    this.pauseStart = 0; // <-- reset
    this.currentWave = 1;

    this.game.globals.entityManager.getEntityArray().forEach((ent) => {
      if (ent !== this.base) {
        this.game.globals.entityManager.removeEntity(ent.id);
      }
    });

    this.base.health = this.base.maxHealth;
  }

  getSpawning(): number {
    let amt: number = this.toSpawn * 1.1;
    console.log(amt);
    return amt;
  }

  update(dt: number): void {
    if (this.base.health <= 0) {
      this.reset();
      return;
    }

    if (this.waveType === WaveType.START) {
      this.toSpawn = this.getSpawning();
      this.waveType = WaveType.SPAWNING;
    }

    if (this.waveType === WaveType.SPAWNING) {
      if (Date.now() - this.lastSpawned < 1000) return;

      if (this.spawned < this.toSpawn) {
        new Robot(this.game);
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
        this.currentWave++;
        this.spawned = 0;
        this.waveType = WaveType.END;
        this.pauseStart = Date.now(); // <-- start pause timer
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
