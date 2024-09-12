import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SettingContext } from "../../context/setting-context";
import { Slider } from "./slider";
import { CgClose } from "react-icons/cg";
import "../../css/settings/settings.css";

const SELECTED = "setting-selected";
const UNSELECTED = "setting-button";

const Settings = (): JSX.Element => {
  const navigate = useNavigate();
  onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      navigate("/");
      return false;
    }
  };

  const { settings, setSettings } = useContext(SettingContext);

  return (
    <div className="settings">
      <Link className="close-settings" to="/">
        <CgClose />
      </Link>
      <div className="settings-container test-settings">
        <h2>TEST SETTINGS</h2>
        <SettingOptions
          description="number of lines shown"
          value={settings.num_lines}
          setValue={(num_lines: number) =>
            setSettings({ ...settings, num_lines })
          }
          options={[3, 4, 5]}
        />
        <OnOffSetting
          description="test early fail settings"
          value={settings.early_fail_settings.use}
          setValue={(val: boolean) =>
            setSettings({
              ...settings,
              early_fail_settings: {
                ...settings.early_fail_settings,
                use: val,
              },
            })
          }
        />
        {settings.early_fail_settings.use && (
          <div className="test-fails-container">
            <div className="test-fails-side-bar"></div>
            <div className="test-fails-options">
              <div className="test-fails-setting">
                <div className="setting-description">minimum accuracy</div>
                <Slider
                  id="min-acc"
                  range={settings.early_fail_settings.accuracy}
                  setRange={(accuracy: number) =>
                    setSettings({
                      ...settings,
                      early_fail_settings: {
                        ...settings.early_fail_settings,
                        accuracy,
                      },
                    })
                  }
                  min={80}
                  max={100}
                  step={4}
                />
              </div>
              <div className="test-fails-setting">
                <div className="setting-description">
                  minimum words per minute
                </div>
                <Slider
                  id="min-words"
                  range={settings.early_fail_settings.wpm}
                  setRange={(wpm: number) =>
                    setSettings({
                      ...settings,
                      early_fail_settings: {
                        ...settings.early_fail_settings,
                        wpm,
                      },
                    })
                  }
                  min={30}
                  max={120}
                  step={10}
                />
              </div>
              <div className="test-fails-setting">
                <div className="setting-description">
                  maximum number of incorrect chars
                </div>
                <Slider
                  id="max-chars"
                  range={settings.early_fail_settings.chars}
                  setRange={(chars: number) =>
                    setSettings({
                      ...settings,
                      early_fail_settings: {
                        ...settings.early_fail_settings,
                        chars,
                      },
                    })
                  }
                  min={0}
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </div>
        )}
        <OnOffSetting
          description="use characters per minute"
          value={settings.use_cpm}
          setValue={(use_cpm: boolean) =>
            setSettings?.({ ...settings, use_cpm })
          }
        />
      </div>
      <div className="settings-container status-bar-setting">
        <h2>STATUS BAR SETTINGS</h2>
        <OnOffSetting
          description="show status bar"
          value={settings.show_status}
          setValue={(show_status: boolean) =>
            setSettings({ ...settings, show_status })
          }
        />
        <OnOffSetting
          description="hide status bar when typing"
          value={settings.hide_status}
          setValue={(hide_status: boolean) =>
            setSettings({ ...settings, hide_status })
          }
        />
        <OnOffSetting
          description="show limit settings for tests"
          value={settings.show_limits}
          setValue={(show_limits: boolean) =>
            setSettings({ ...settings, show_limits })
          }
        />
        <OnOffSetting
          description={`show live ${
            settings.use_cpm ? "characters" : "words"
          } per minute`}
          value={settings.show_wpm}
          setValue={(show_wpm: boolean) =>
            setSettings({ ...settings, show_wpm })
          }
        />
        <OnOffSetting
          description="show live accuracy"
          value={settings.show_accuracy}
          setValue={(show_accuracy: boolean) =>
            setSettings({ ...settings, show_accuracy })
          }
        />
        <OnOffSetting
          description="always show time"
          value={settings.show_time}
          setValue={(show_time: boolean) =>
            setSettings({ ...settings, show_time })
          }
        />
      </div>
      <div className="settings-container appearance-settings">
        <h2>APPEARANCE SETTINGS</h2>
        <SettingOptions
          description="font size"
          value={settings.font_size}
          setValue={(font_size: "small" | "default" | "large") =>
            setSettings({ ...settings, font_size })
          }
          options={["small", "default", "large"]}
        />
        <SettingOptions
          description="font weight"
          value={settings.font_weight}
          setValue={(font_weight: "default" | "bold") =>
            setSettings({ ...settings, font_weight })
          }
          options={["default", "bold"]}
        />
        <OnOffSetting
          description="enable focus mode"
          value={settings.focus_mode}
          setValue={(focus_mode: boolean) =>
            setSettings({ ...settings, focus_mode })
          }
        />
      </div>
      <div className="setting-padding"></div>
    </div>
  );
};

const SettingOptions = (props: {
  description: string;
  value: any;
  setValue(value: any): void;
  options: Array<any>;
}) => {
  return (
    <div className="setting">
      <div className="setting-description">
        <p>{props.description}</p>
      </div>
      {props.options.map((option: any, index: number) => (
        <SettingButton key={index} {...props} text={option} option={option} />
      ))}
    </div>
  );
};

const SettingButton = (props: {
  value: any;
  setValue(value: any): void;
  text: string;
  option: any;
}) => {
  return (
    <button
      className={props.value === props.option ? SELECTED : UNSELECTED}
      onClick={() => props.setValue(props.option)}
    >
      {props.text}
    </button>
  );
};

const OnOffSetting = (props: {
  description: string;
  value: boolean;
  setValue(value: boolean): void;
}) => {
  return (
    <div className="setting">
      <div className="setting-description">
        <p>{props.description}</p>
      </div>
      <div className="button-container">
        <button className={props.value ? "setting-selected" : "setting-button"} onClick={() => props.setValue(true)}>
          on
        </button>
        <button className={props.value ? "setting-button" : "setting-selected"} onClick={() => props.setValue(false)}>
          off
        </button>
      </div>
    </div>
  );
};

export default Settings;
