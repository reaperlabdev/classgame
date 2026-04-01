import { muteUnallowedPlayback } from "../utility/audioUtil";

const SETTINGS_KEY = "game_settings";

export interface Settings {
  music: boolean;
  sfx: boolean;
  effects: boolean;
  volume: number;
}

const defaultSettings: Settings = {
  music: true,
  sfx: true,
  effects: true,
  volume: 1.0,
};

class SettingsLoader {
  private static settings: Settings = { ...defaultSettings };

  loadSettings(): void {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const json: Partial<Settings> = raw ? JSON.parse(raw) : {};
      SettingsLoader.settings = { ...defaultSettings, ...json };
    } catch {
      SettingsLoader.settings = { ...defaultSettings };
    }
  }

  getSettings(): Settings {
    return SettingsLoader.settings;
  }

  saveSettings(): void {
    muteUnallowedPlayback();
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(SettingsLoader.settings),
      );
    } catch {
      console.warn("Failed to save settings to localStorage.");
    }
  }
}

export { SettingsLoader };
