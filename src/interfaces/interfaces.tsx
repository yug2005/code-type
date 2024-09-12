export type Limit = {
  type: string;
  value: number;
};

export type Timer = {
  hr_time: number;
  time: number;
  started: boolean;
  finished: boolean;
};

export type Test = {
  chars: number;
  lineChars: number;
  incorrectChars: number;
};

export type Tracker = {
  wpm: Array<Array<number>>;
  cpm: Array<Array<number>>;
  errors: Array<Array<number>>;
  temp: number;
};

export type TestDetails = {
  labels: Array<string>;
  data: Array<number>;
  errorsLabels: Array<string>;
  errorsData: Array<number>;
  average: number;
  max: number;
  min: number;
  accuracy: number;
  totalChars: number;
  correctChars: number;
};

export type CustomFile = {
  use: boolean;
  file: Array<string>;
  index: number;
};

export type EarlyFailSettings = {
  use: boolean;
  wpm: number;
  accuracy: number;
  chars: number;
}

export type UserSettings = {
  num_lines: number;
  early_fail_settings: EarlyFailSettings;
  use_cpm: boolean;
  show_status: boolean;
  hide_status: boolean;
  show_limits: boolean;
  show_wpm: boolean;
  show_accuracy: boolean;
  show_time: boolean;
  font_size: "small" | "default" | "large";
  font_weight: "default" | "bold";
  focus_mode: boolean;
}
