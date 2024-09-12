import { UserSettings } from "../interfaces/interfaces";
import { createContext } from "react";

export const defaultSettings: UserSettings = {
  num_lines: 4,
  early_fail_settings: {
    use: false,
    accuracy: 96,
    wpm: 60,
    chars: 0,
  },
  use_cpm: false,
  show_status: true,
  hide_status: false,
  show_wpm: true,
  show_accuracy: true,
  show_limits: true,
  show_time: true,
  font_size: "default",
  font_weight: "default",
  focus_mode: false,
};

type SettingContextType = {
  settings: UserSettings;
  setSettings(settings: UserSettings): void;
};

export const SettingContext = createContext<SettingContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});
