const audio = document.getElementById("audiohandler") as HTMLAudioElement;

const sounds: Record<string, HTMLAudioElement> = {
  bgMusic: new Audio("./src/assets/sfx/music1.wav"),
  hostileDeath: new Audio("./src/assets/sfx/death.wav"),
};

sounds.bgMusic.loop = true;

export const play = (name: string) => {
  const audio = sounds[name];
  if (!audio) {
    console.error(`Sound "${name}" not found`);
    return;
  }
  audio.currentTime = 0;
  audio.play().catch((err) => console.error("Playback failed:", err));
};

export const stop = (name: string) => {
  const audio = sounds[name];
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
};

export const setVolume = (name: string, vol: number) => {
  const audio = sounds[name];
  if (!audio) return;
  audio.volume = vol;
};

export const seekTo = (seconds: number) => {
  audio.currentTime = seconds;
};

export const loadFile = (path: string) => {
  audio.src = path;
  audio.load();
};
