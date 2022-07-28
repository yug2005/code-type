import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { Slider } from "./slider";
import { CgClose } from "react-icons/cg";
import "../../css/settings/settings.css";

const ESC = 27;
const SELECTED = "setting-selected";
const UNSELECTED = "setting-button";

interface Setting {
  difficulty: string;
  num_lines: number;
  use_cpm: boolean;
  fails_on: Object[];
  show_status: boolean;
  hide_status: boolean;
  show_wpm: boolean;
  show_accuracy: boolean;
  show_time: boolean;
  show_limits: boolean;
  website_theme: string;
  font_family: string;
  font_size: number;
  font_weight: string;
  focus_mode: boolean;
}

const Settings = (): JSX.Element => {
  const navigate = useNavigate();
  onkeydown = (e: any) => {
    if (e.keyCode === ESC) {
      navigate("/");
      return false;
    }
  };

  const [settings, setSettings] = useContext(UserContext);

  const getSettings = async () => {
    const res = await fetch(`http://localhost:5001/users/0`);
    const user = await res.json();
    setSettings(user.settings);
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="settings">
      <Link className="close-settings" to="/">
        <CgClose />
      </Link>
      <div className="settings-container test-settings">
        <h2>TEST SETTINGS</h2>
        <SettingOptions
          description="test difficulty"
          value={settings?.difficulty}
          setValue={(val: string) =>
            setSettings?.({ ...settings, difficulty: val })
          }
          options={["easy", "normal", "hard"]}
        />
        <SettingOptions
          description="number of lines shown"
          value={settings?.num_lines}
          setValue={(val: number) =>
            setSettings?.({ ...settings, num_lines: val })
          }
          options={[3, 4, 5]}
        />
        <OnOffSetting
          description="test fails on"
          value={settings?.fails_on.use}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              fails_on: { ...settings.fails_on, use: val },
            })
          }
        />
        {settings?.fails_on.use && (
          <div className="test-fails-container">
            <div className="test-fails-side-bar"></div>
            <div className="test-fails-options">
              <div className="setting-padding"></div>
              <div className="test-fails-setting">
                <div className="setting-description">minimum accuracy</div>
                <Slider
                  id="min-acc"
                  range={settings?.fails_on.accuracy}
                  setRange={(val: boolean) =>
                    setSettings?.({
                      ...settings,
                      fails_on: { ...settings.fails_on, accuracy: val },
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
                  range={settings?.fails_on.show_wpm}
                  setRange={(val: boolean) =>
                    setSettings?.({
                      ...settings,
                      test: {
                        ...settings.test,
                        fails_on: { ...settings.fails_on, wpm: val },
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
                  range={settings?.fails_on.chars}
                  setRange={(val: boolean) =>
                    setSettings?.({
                      ...settings,
                      test: {
                        ...settings.test,
                        fails_on: { ...settings.fails_on, chars: val },
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
          value={settings?.use_cpm}
          setValue={(val: boolean) =>
            setSettings?.({ ...settings, use_cpm: val })
          }
        />
      </div>
      <div className="settings-container status-bar-setting">
        <h2>STATUS BAR SETTINGS</h2>
        <OnOffSetting
          description="show status bar"
          value={settings?.show_status}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              show_status: val,
            })
          }
        />
        <OnOffSetting
          description="hide status bar when typing"
          value={settings?.hide_status}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              hide_status: val,
            })
          }
        />
        <OnOffSetting
          description="show limit settings for tests"
          value={settings?.show_limits}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              show_limits: val,
            })
          }
        />
        <OnOffSetting
          description={`show live ${
            settings?.cpm ? "characters" : "words"
          } per minute`}
          value={settings?.show_wpm}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              show_wpm: val,
            })
          }
        />
        <OnOffSetting
          description="show live accuracy"
          value={settings?.show_accuracy}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              show_accuracy: val,
            })
          }
        />
        <OnOffSetting
          description="always show time"
          value={settings?.show_time}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              show_time: val,
            })
          }
        />
      </div>
      <div className="settings-container appearance-settings">
        <h2>APPEARANCE SETTINGS</h2>
        <OnOffSetting
          description="enable focus mode"
          value={settings?.focus_mode}
          setValue={(val: boolean) =>
            setSettings?.({
              ...settings,
              focus_mode: val,
            })
          }
        />
        <SettingOptions
          description="theme"
          value={settings?.website_theme}
          setValue={(val: string) =>
            setSettings?.({
              ...settings,
              website_theme: val,
            })
          }
          options={["default", "custom"]}
        />
        <SettingOptions
          description="code font"
          value={settings?.font_family}
          setValue={(val: string) =>
            setSettings?.({
              ...settings,
              font_family: val,
            })
          }
          options={["default", "custom"]}
        />
        <div className="setting slider-setting">
          <div className="setting-description">
            <p>font size</p>
          </div>
          <Slider
            id="font-size"
            range={settings?.font_size}
            setRange={(val: number) =>
              setSettings?.({
                ...settings,
                font_size: val,
              })
            }
            min={20}
            max={25}
            step={1}
          />
        </div>
        <SettingOptions
          description="font weight"
          value={settings?.font_weight}
          setValue={(val: string) =>
            setSettings?.({
              ...settings,
              font_weight: val,
            })
          }
          options={["default", "bold"]}
        />
      </div>
      <div className="setting-padding"></div>
    </div>
  );
};

const SettingOptions = (props: {
  description: string;
  value: any;
  setValue: (val: any) => void;
  options: any[];
}) => {
  return (
    <div className="setting">
      <div className="setting-description">
        <p>{props.description}</p>
      </div>
      {props.options.map((option: any, index: number) => (
        <SettingButton
          key={index}
          {...props}
          text={option}
          option={option}
        />
      ))}
    </div>
  );
};

const SettingButton = (props: {
  value: any;
  setValue: (val: any) => void;
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
  value: any;
  setValue: any;
}) => {
  const on = props.value ? SELECTED : UNSELECTED;
  const off = props.value ? UNSELECTED : SELECTED;
  return (
    <div className="setting">
      <div className="setting-description">
        <p>{props.description}</p>
      </div>
      <div className="button-container">
        <button className={on} onClick={() => props.setValue(true)}>
          on
        </button>
        <button className={off} onClick={() => props.setValue(false)}>
          off
        </button>
      </div>
    </div>
  );
};

export default Settings;
