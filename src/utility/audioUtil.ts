// AI

import audioSettings from "../settings/audio/audioSettings.json";

type SoundConfig = {
  path: string;
  loop: boolean;
  volume: number;
  pitch?: number;
};

const audioContext = new AudioContext();
const bufferCache: Record<string, AudioBuffer> = {};
const activeSources: Record<string, AudioBufferSourceNode[]> = {};
const volumes: Record<string, GainNode> = {};
const pitches: Record<string, BiquadFilterNode> = {};

const soundConfigs: Record<string, SoundConfig> = audioSettings.sounds;

const loadBuffer = async (name: string): Promise<AudioBuffer> => {
  if (bufferCache[name]) return bufferCache[name];

  const config = soundConfigs[name];
  if (!config)
    throw new Error(`Sound "${name}" is not registered in audioSettings.json`);

  const response = await fetch(config.path);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  bufferCache[name] = audioBuffer;
  return audioBuffer;
};

const getOrCreateGain = (name: string): GainNode => {
  if (!volumes[name]) {
    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundConfigs[name]?.volume ?? 1;
    gainNode.connect(audioContext.destination);
    volumes[name] = gainNode;
  }
  return volumes[name];
};

const getOrCreatePitch = (name: string): BiquadFilterNode => {
  if (!pitches[name]) {
    const pitchNode = audioContext.createBiquadFilter();
    pitchNode.type = "highpass";
    pitchNode.frequency.value = soundConfigs[name]?.pitch ?? 1;
    pitchNode.connect(audioContext.destination);
    pitches[name] = pitchNode;
  }
  return pitches[name];
};

export const preloadAll = async (): Promise<void> => {
  await Promise.all(Object.keys(soundConfigs).map(loadBuffer));
};

export const play = async (
  name: string,
  loop?: boolean,
  pitch?: number,
): Promise<void> => {
  const buffer = await loadBuffer(name);
  const config = soundConfigs[name];
  const gainNode = getOrCreateGain(name);
  const pitchNode = getOrCreatePitch(name);

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = loop ?? config.loop;
  source.connect(gainNode);
  source.connect(pitchNode);
  source.start(0);

  if (!activeSources[name]) activeSources[name] = [];
  activeSources[name].push(source);

  source.onended = () => {
    activeSources[name] = activeSources[name].filter((s) => s !== source);
  };
};

export const stop = (name: string): void => {
  activeSources[name]?.forEach((s) => {
    s.stop();
    s.disconnect();
  });
  activeSources[name] = [];
};

export const stopOldest = (name: string): void => {
  const oldest = activeSources[name]?.shift();
  if (oldest) {
    oldest.stop();
    oldest.disconnect();
  }
};

export const getActiveCount = (name: string): number => {
  return activeSources[name]?.length ?? 0;
};

export const setVolume = (name: string, vol: number): void => {
  if (volumes[name]) {
    volumes[name].gain.value = vol;
  }
};
