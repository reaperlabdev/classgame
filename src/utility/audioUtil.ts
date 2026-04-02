import { Game } from "../game";
import audioSettings from "../settings/audio/audioSettings.json";

type SoundConfig = {
  path: string;
  loop: boolean;
  type?: "music" | "effect";
  volume: number;
  pitch?: number;
};

let game: Game | null = null;
const audioContext = new AudioContext();
const bufferCache: Record<string, AudioBuffer> = {};
const activeSources: Record<string, AudioBufferSourceNode[]> = {};
const globalGains: Record<string, GainNode> = {};

const soundConfigs = audioSettings.sounds as Record<string, SoundConfig>;

export const audioUtilInit = (gameInstance: Game): void => {
  game = gameInstance;
};

const loadBuffer = async (name: string): Promise<AudioBuffer> => {
  if (bufferCache[name]) return bufferCache[name];

  const config = soundConfigs[name];
  if (!config) throw new Error(`Sound "${name}" not found`);

  const response = await fetch(config.path);
  const arrayBuffer = await response.arrayBuffer();
  return (bufferCache[name] = await audioContext.decodeAudioData(arrayBuffer));
};

const getOrCreateGain = (name: string): GainNode => {
  if (!globalGains[name]) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundConfigs[name]?.volume ?? 1;
    gainNode.connect(audioContext.destination);
    globalGains[name] = gainNode;
  }
  return globalGains[name];
};

export const preloadAll = async (): Promise<void> => {
  await Promise.all(Object.keys(soundConfigs).map(loadBuffer));
};

export const play = async (
  name: string,
  loop?: boolean,
  randomize: boolean = false,
): Promise<void> => {
  if (audioContext.state === "suspended") await audioContext.resume();
  const settings = game?.globals.settings.getSettings();

  const buffer = await loadBuffer(name);
  const config = soundConfigs[name];
  const gainNode = getOrCreateGain(name);

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = loop ?? config.loop;

  if (randomize) {
    source.playbackRate.value = 0.9 + Math.random() * 0.5;
  } else {
    source.playbackRate.value = config.pitch ?? 1;
  }

  source.connect(gainNode);
  source.start(0);
  if (!activeSources[name]) activeSources[name] = [];
  activeSources[name].push(source);

  source.onended = () => {
    activeSources[name] = activeSources[name].filter((s) => s !== source);
  };

  muteUnallowedPlayback();
};

export const muteUnallowedPlayback = (): void => {
  for (const name in soundConfigs) {
    const config = soundConfigs[name];
    const gainNode = getOrCreateGain(name);

    const isAllowed = checkIfAllowedPlayback(name);

    const targetVolume = isAllowed ? (config.volume ?? 1) : 0;

    gainNode.gain.setTargetAtTime(
      targetVolume,
      audioContext.currentTime,
      0.015,
    );
  }
};

export const checkIfAllowedPlayback = (name: string): boolean => {
  const config = soundConfigs[name];
  const settings = game?.globals.settings.getSettings();
  if (config.type === "music") {
    return settings?.music ?? false;
  } else if (config.type === "effect") {
    return settings?.sfx ?? false;
  }
  return false;
};

export const stop = (name: string): void => {
  activeSources[name]?.forEach((s) => {
    try {
      s.stop();
    } catch (e) {}
    s.disconnect();
  });
  activeSources[name] = [];
};

export const setVolume = (name: string, vol: number): void => {
  const node = getOrCreateGain(name);
  node.gain.setTargetAtTime(vol, audioContext.currentTime, 0.05);
};

export const crossfade = async (
  fromName: string,
  toName: string,
  duration: number = 1.5,
): Promise<void> => {
  if (audioContext.state === "suspended") await audioContext.resume();

  const fromGain = globalGains[fromName];
  const fromConfig = soundConfigs[fromName];
  const toConfig = soundConfigs[toName];

  if (fromGain && fromConfig) {
    fromGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.1);
  }

  setTimeout(async () => {
    stop(fromName);
    if (fromConfig) {
      getOrCreateGain(fromName).gain.setValueAtTime(
        fromConfig.volume ?? 1,
        audioContext.currentTime,
      );
    }

    await play(toName, toConfig?.loop);
    const toGain = getOrCreateGain(toName);
    toGain.gain.setValueAtTime(0, audioContext.currentTime);
    toGain.gain.setTargetAtTime(
      toConfig?.volume ?? 1,
      audioContext.currentTime,
      duration / 3,
    );
  }, 400); 
};
