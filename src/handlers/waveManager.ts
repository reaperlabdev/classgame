import { PlayerBase } from "../classes/entity/friendly/playerBaseEntity";
import { Game } from "../game";
import { EntityType } from "../classes/entity/entityType";
import { WaveType } from "../classes/wave/waveType";
import { Robot } from "../classes/entity/hostile/robotEntity";

export class WaveManager {
  game: Game;
  base: PlayerBase;

  waveType: WaveType = WaveType.START;
  toSpawn: number = 0;
  lastSpawned: number = Date.now();
  spawned: number = 0;
  timePaused: number = 0;

  currentWave: number = 1;

  constructor(game: Game) {
    this.game = game;
    this.base = this.game.globals.entityManager
      .getEntityArray()
      .find((ent): ent is PlayerBase => ent.type === EntityType.BASE)!;
  }

  update(dt: number): void {
    if (this.waveType === WaveType.START) {
      this.toSpawn = this.currentWave * 5;
      this.waveType = WaveType.SPAWNING;
    }
    if (this.waveType === WaveType.SPAWNING) {
      if (Date.now() - this.lastSpawned < 1000) {
        return;
      }
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
      }
    }
    if (this.waveType === WaveType.END) {
      this.timePaused += dt;
      if (this.timePaused >= 5) {
        this.waveType = WaveType.START;
        this.timePaused = 0;
      }
    }
  }
}
