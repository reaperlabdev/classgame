const audioContext = new AudioContext();
const bufferCache: Record<string, AudioBuffer> = {};
const activeSources: Record<string, AudioBufferSourceNode> = {};
const volumes: Record<string, GainNode> = {};

const soundPaths: Record<string, string> = {
  bgMusic: "./src/assets/sfx/music1.wav",
  hostileDeath: "./src/assets/sfx/death.wav",
};

const loadBuffer = async (name: string): Promise<AudioBuffer> => {
  if (bufferCache[name]) return bufferCache[name];
  const response = await fetch(soundPaths[name]);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  bufferCache[name] = audioBuffer;
  return audioBuffer;
};

export const play = async (name: string, loop = false) => {
  const buffer = await loadBuffer(name);

  // Stop any existing instance
  activeSources[name]?.stop();
  activeSources[name]?.disconnect();

  const gainNode = audioContext.createGain();
  gainNode.gain.value = volumes[name] ? volumes[name].gain.value : 1;
  gainNode.connect(audioContext.destination);
  volumes[name] = gainNode;

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = loop; // sample-accurate looping, zero gap
  source.connect(gainNode);
  source.start(0);

  activeSources[name] = source;
};

export const stop = (name: string) => {
  activeSources[name]?.stop();
  activeSources[name]?.disconnect();
  delete activeSources[name];
};

export const setVolume = (name: string, vol: number) => {
  if (volumes[name]) {
    volumes[name].gain.value = vol;
  }
};

// Start bg music looping on init
