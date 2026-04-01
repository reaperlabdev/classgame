import { uiDebug } from "./classes/ui/debug/debugUi";
import { SpawnUi } from "./classes/ui/spawn/spawnUi";

import { Game } from "./game";

import map1 from "./assets/maps/1.json";
import map2 from "./assets/maps/2.json";
import map3 from "./assets/maps/3.json";
import map4 from "./assets/maps/4.json";
import map5 from "./assets/maps/5.json";
import map6 from "./assets/maps/6.json";

const maps = [map1, map2, map3, map4, map5, map6];

import { WaveManager } from "./handlers/class/waveHandler";
import { loadImage } from "./utility/imageUtil";

import pathImageSrc from "./assets/tiles/path.png";
import grassImageSrc from "./assets/tiles/grass.png";
import rockImageSrc from "./assets/tiles/rock.png";
import waterImageSrc from "./assets/tiles/water.png";

import treeImageSrc1 from "./assets/decor/tree1.png";
import treeImageSrc2 from "./assets/decor/tree2.png";

import trailerImageSrc from "./assets/decor/trailer.png";
import flagImageSrc from "./assets/decor/flag.png";

import rockImageSrc1 from "./assets/decor/rock1.png";
import rockImageSrc2 from "./assets/decor/rock2.png";
import rockImageSrc3 from "./assets/decor/rock3.png";

import robotImageSrc1 from "./assets/robots/robot1.png";
import robotImageSrc2 from "./assets/robots/robot2.png";
import robotImageSrc3 from "./assets/robots/robot3.png";
import robotImageSrc4 from "./assets/robots/robot4.png";

import camoImageSrc1 from "./assets/robots/camo1.png";
import camoImageSrc2 from "./assets/robots/camo2.png";
import camoImageSrc3 from "./assets/robots/camo3.png";
import camoImageSrc4 from "./assets/robots/camo4.png";

import spiderImageSrc1 from "./assets/robots/spider1.png";
import spiderImageSrc2 from "./assets/robots/spider2.png";
import spiderImageSrc3 from "./assets/robots/spider3.png";
import spiderImageSrc4 from "./assets/robots/spider4.png";

import bomberImageSrc1 from "./assets/robots/bomber1.png";
import bomberImageSrc2 from "./assets/robots/bomber2.png";
import bomberImageSrc3 from "./assets/robots/bomber3.png";
import bomberImageSrc4 from "./assets/robots/bomber4.png";

import turretImageSrc from "./assets/turrets/turret.png";
import sniperImageSrc from "./assets/turrets/sniper.png";
import machineImageSrc from "./assets/turrets/machine.png";
import empImageSrc from "./assets/turrets/emp.png";
import spikeImageSrc from "./assets/turrets/spike.png";

import { HudUi } from "./classes/ui/hud/hudUi";
import { audioUtilInit, play, setVolume } from "./utility/audioUtil";
import { UpgradeUi } from "./classes/ui/upgrade/upgradeUi";
import { EndingUi } from "./classes/ui/ending/endingUi";
import { SettingsUi } from "./classes/ui/settings/settingsUi";
import { StartingUi } from "./classes/ui/starting/startingUi";
import { SettingsLoader } from "./settings/settingsLoader";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const renderContext = canvas.getContext("2d")!;

const game = new Game(canvas, renderContext);

async function main(): Promise<void> {
  // add game to document
  (document as any).game = game;
  game.globals.maps = maps;

  game.globals.settings.loadSettings();
  audioUtilInit(game);

  // load sprites
  await game.globals.spriteManager.addSprite("path", loadImage(pathImageSrc));
  await game.globals.spriteManager.addSprite("grass", loadImage(grassImageSrc));
  await game.globals.spriteManager.addSprite("rock", loadImage(rockImageSrc));
  await game.globals.spriteManager.addSprite("water", loadImage(waterImageSrc));

  await game.globals.spriteManager.addSprite("tree1", loadImage(treeImageSrc1));
  await game.globals.spriteManager.addSprite("tree2", loadImage(treeImageSrc2));

  await game.globals.spriteManager.addSprite("rock1", loadImage(rockImageSrc1));
  await game.globals.spriteManager.addSprite("rock2", loadImage(rockImageSrc2));
  await game.globals.spriteManager.addSprite("rock3", loadImage(rockImageSrc3));

  await game.globals.spriteManager.addSprite(
    "trailer",
    loadImage(trailerImageSrc),
  );

  await game.globals.spriteManager.addSprite("flag", loadImage(flagImageSrc));

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
  await game.globals.spriteManager.addSprite(
    "robot4",
    loadImage(robotImageSrc4),
  );

  await game.globals.spriteManager.addSprite("camo1", loadImage(camoImageSrc1));
  await game.globals.spriteManager.addSprite("camo2", loadImage(camoImageSrc2));
  await game.globals.spriteManager.addSprite("camo3", loadImage(camoImageSrc3));
  await game.globals.spriteManager.addSprite("camo4", loadImage(camoImageSrc4));

  await game.globals.spriteManager.addSprite(
    "spider1",
    loadImage(spiderImageSrc1),
  );
  await game.globals.spriteManager.addSprite(
    "spider2",
    loadImage(spiderImageSrc2),
  );
  await game.globals.spriteManager.addSprite(
    "spider3",
    loadImage(spiderImageSrc3),
  );
  await game.globals.spriteManager.addSprite(
    "spider4",
    loadImage(spiderImageSrc4),
  );

  await game.globals.spriteManager.addSprite(
    "bomber1",
    loadImage(bomberImageSrc1),
  );
  await game.globals.spriteManager.addSprite(
    "bomber2",
    loadImage(bomberImageSrc2),
  );
  await game.globals.spriteManager.addSprite(
    "bomber3",
    loadImage(bomberImageSrc3),
  );
  await game.globals.spriteManager.addSprite(
    "bomber4",
    loadImage(bomberImageSrc4),
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
      !game.globals.starting &&
      game.globals.pauseSeconds <= 0
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
    play("bgMusic", true);
  }

  audio();
}

main();
