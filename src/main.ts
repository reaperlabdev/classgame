import { uiDebug } from "./classes/ui/debug/debugUi";
import { SpawnUi } from "./classes/ui/spawn/spawnUi";

import { Game } from "./game";

import map1 from "./assets/maps/1.json";
import map2 from "./assets/maps/2.json";
import map3 from "./assets/maps/3.json";
import map4 from "./assets/maps/4.json";
import map5 from "./assets/maps/5.json";

const maps = [map1, map2, map3, map4, map5];

import { PlayerBase } from "./classes/entity/friendly/playerBaseEntity";
import { getOrderedPath } from "./utility/entityPathing";
import { WaveManager } from "./handlers/class/waveHandler";
import { loadImage } from "./utility/imageUtil";

import pathImageSrc from "./assets/tiles/path.png";
import grassImageSrc from "./assets/tiles/grass.png";
import rockImageSrc from "./assets/tiles/rock.png";
import waterImageSrc from "./assets/tiles/water.png";

import robotImageSrc1 from "./assets/robots/robot1.png";
import robotImageSrc2 from "./assets/robots/robot2.png";
import robotImageSrc3 from "./assets/robots/robot3.png";

import camoImageSrc1 from "./assets/robots/camo1.png";
import camoImageSrc2 from "./assets/robots/camo2.png";
import camoImageSrc3 from "./assets/robots/camo3.png";

import spiderImageSrc from "./assets/robots/spider.png";

import turretImageSrc from "./assets/turrets/turret.png";
import sniperImageSrc from "./assets/turrets/sniper.png";
import machineImageSrc from "./assets/turrets/machine.png";
import empImageSrc from "./assets/turrets/emp.png";
import spikeImageSrc from "./assets/turrets/spike.png";

import { HudUi } from "./classes/ui/hud/hudUi";
import { play, setVolume } from "./utility/audioUtil";
import { UpgradeUi } from "./classes/ui/upgrade/upgradeUi";
import { EndingUi } from "./classes/ui/ending/endingUi";
import { SettingsUi } from "./classes/ui/settings/settingsUi";
import { StartingUi } from "./classes/ui/starting/startingUi";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderContext = canvas.getContext("2d")!;

const game = new Game(canvas, renderContext);

async function main(): Promise<void> {
  // add game to document
  (document as any).game = game;
  game.globals.maps = maps;

  // load sprites
  await game.globals.spriteManager.addSprite("path", loadImage(pathImageSrc));
  await game.globals.spriteManager.addSprite("grass", loadImage(grassImageSrc));
  await game.globals.spriteManager.addSprite("rock", loadImage(rockImageSrc));
  await game.globals.spriteManager.addSprite("water", loadImage(waterImageSrc));

  await game.globals.spriteManager.addSprite(
    "robot1",
    loadImage(robotImageSrc1),
  );
  await game.globals.spriteManager.addSprite(
    "robot2",
    loadImage(robotImageSrc2),
  );
  await game.globals.spriteManager.addSprite(
    "robot3",
    loadImage(robotImageSrc3),
  );

  await game.globals.spriteManager.addSprite("camo1", loadImage(camoImageSrc1));
  await game.globals.spriteManager.addSprite("camo2", loadImage(camoImageSrc2));
  await game.globals.spriteManager.addSprite("camo3", loadImage(camoImageSrc3));

  await game.globals.spriteManager.addSprite(
    "spider",
    loadImage(spiderImageSrc),
  );

  await game.globals.spriteManager.addSprite(
    "turret",
    loadImage(turretImageSrc),
  );
  await game.globals.spriteManager.addSprite(
    "sniper",
    loadImage(sniperImageSrc),
  );

  await game.globals.spriteManager.addSprite(
    "machine",
    loadImage(machineImageSrc),
  );

  await game.globals.spriteManager.addSprite("emp", loadImage(empImageSrc));

  await game.globals.spriteManager.addSprite("spike", loadImage(spikeImageSrc));

  console.log(game.globals.spriteManager.sprites);

  game.globals.mouseHandler.init();

  new uiDebug(game);

  game.globals.tileMapManager.genNewMap(maps);

  // setup spawn UI
  new StartingUi(game);

  new SpawnUi(game);

  new HudUi(game);

  new UpgradeUi(game);

  new SettingsUi(game);

  new EndingUi(game);

  game.globals.waveManager = new WaveManager(game);

  let lastTime = 0;

  function tick(currentTime: number): void {
    const dt = lastTime ? (currentTime - lastTime) / 1000 : 0;
    lastTime = currentTime;

    const cappedDt: number = Math.min(dt, 0.1);

    game.globals.updater.update(
      game.globals.doubleSpeed ? 2 * cappedDt : cappedDt,
    );

    game.globals.time += game.globals.doubleSpeed ? 2 * cappedDt : cappedDt;

    if (
      !game.globals.paused &&
      !game.globals.forceTimePaused &&
      !game.globals.starting
    ) {
      game.globals.waveManager?.update(cappedDt);
    }

    game.globals.renderer.render();

    if (game.globals.keyboardHandler.isKeyDown("o")) {
      game.globals.cash = 1000000;
    }

    requestAnimationFrame(tick);
  }

  // Initial call
  requestAnimationFrame(tick);

  async function audio() {
    await new Promise((resolve) => {
      document.addEventListener("click", resolve, { once: true });
    });

    setVolume("bgMusic", 0.1);
    setVolume("hostileDeath", 0.1);
    setVolume("devilDeath", 0.1);
    setVolume("shooting", 1);
    //play("bgMusic", true);
  }

  audio();
}

main();
