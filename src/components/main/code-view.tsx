import React, { useState, useEffect, useContext } from "react";
import { SettingContext } from "../../context/setting-context";
import "../../css/main/code-view.css";

import { FiChevronRight } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { Test } from "../../interfaces/interfaces";

interface PropsInterface {
  code: Array<string>;
  test: Test;
  setTest(test: Test): void;
  resetTest(newTest: boolean): void;
  startTimer: () => void;
  endTimer: () => void;
  showStatusBar: boolean;
  userInput: string;
  setUserInput(input: string): void;
  lineIndex: number;
  setLineIndex(index: number): void;
  currentLine: Array<string>;
  setCurrentLine(line: Array<string>): void;
  previousLines: Array<Array<string>>;
  usingCustom: boolean;
}

const CodeView = (props: PropsInterface) => {
  const { settings } = useContext(SettingContext);

  // whether the test is active
  const [active, setActive] = useState<boolean>(settings?.focus_mode);

  const enable = () => {
    document.getElementById("practice-code-input")?.focus();
    setActive(true);
  };

  useEffect(() => {
    enable();
  }, []);

  useEffect(() => {
    props.resetTest(false);
  }, [active]);

  // when the user types on keyboard
  const onUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: string = e.target.value;
    props.startTimer();
    props.setUserInput(input);

    const line = props.code[props.lineIndex].replace(/\s+/g, " ").trim();
    const numIncorrect =
      props.test.incorrectChars +
      Number(input[input.length - 1] !== line[input.length - 1]);

    if (settings.early_fail_settings.use && settings.early_fail_settings.chars <= numIncorrect) {
      console.log("Test Failed");
      props.endTimer();
    }

    props.setTest({
      ...props.test,
      lineChars: input.length,
      incorrectChars: numIncorrect,
    });

    props.setCurrentLine(
      input
        .split("")
        .map((val: string, index: number) =>
          val === line[index]
            ? "text-correct"
            : line[index] === " "
            ? "text-space-wrong"
            : "text-wrong"
        )
    );
  };

  const keyEventMap = new Map<string, boolean>();
  const handleKeyPress = (e: React.KeyboardEvent) => {
    keyEventMap.set(e.code, e.type === "keydown");
    // if the user presses the esc key
    if (keyEventMap.get("Escape")) {
      setActive(false);
      return false;
    }
    // when the user is holding down the tab key
    if (keyEventMap.get("Tab")) {
      document
        .getElementById("next-button")
        ?.classList.add("practice-code-button-hover");
    } else {
      document
        .getElementById("next-button")
        ?.classList.remove("practice-code-button-hover");
    }
    // when the user presses tab and enter
    if (keyEventMap.get("Tab") && keyEventMap.get("Enter")) {
      props.resetTest(true);
      return false;
    }
    // when the user presses enter only
    else if (keyEventMap.get("Enter")) {
      props.setUserInput("");
      props.setLineIndex(props.lineIndex + 1);
      props.setTest({
        ...props.test,
        chars: props.test.chars + props.test.lineChars,
        lineChars: 0,
      });
      props.previousLines.push(props.currentLine);
      if (props.previousLines.length === 3) props.previousLines.splice(0, 1);
      props.setCurrentLine([]);
      if (props.lineIndex >= props.code.length - 1) props.endTimer();
    }
  };

  // get the line such that they are formatted correctly
  const getLine = (line: Array<string>, index: number) => {
    // the lines that the user has already typed out
    if (index < props.lineIndex) {
      return line.map((char: string, charIndex: number) => (
        <span
          key={charIndex}
          className="practice-code-text"
          id={props.previousLines[2 - props.lineIndex + index][charIndex]}
        >
          <pre>{char}</pre>
        </span>
      ));
    }
    // for the line that the user is currently typing
    else if (props.lineIndex === index) {
      const returnLine = line.map((char: string, charIndex: number) => (
        <span
          key={charIndex}
          className="practice-code-text"
          id={
            charIndex < props.userInput.length
              ? props.currentLine[charIndex]
              : ""
          }
        >
          <pre>{char}</pre>
        </span>
      ));
      // index cursor
      returnLine.splice(
        props.userInput.length,
        0,
        <div>
          <span
            className={`practice-code-cursor ${
              props.lineIndex + props.userInput.length === 0
                ? "cursor-blinking"
                : ""
            }`}
          >
            <pre> </pre>
          </span>
        </div>
      );
      return returnLine;
    }
    // if the line is below where the user is currently
    else {
      return line.map((char: string, charIndex: number) => (
        <span key={charIndex} className="practice-code-text">
          <pre>{char}</pre>
        </span>
      ));
    }
  };

  // get tab space for lines of code that have space at the start
  const getTabSpace = (index: number) => {
    return props.code[index]
      .split(/\s{4}/)
      .splice(1)
      .map((_, i) => (
        <pre key={i} className="practice-code-text">
          {"    "}
        </pre>
      ));
  };

  // get the preview code that is going to be displayed
  const codeLines = (
    <div className="code-container">
      {props.code
        .map((line: string) => line.replace(/\s+/g, " ").trim().split(""))
        .map(
          (line: Array<string>, index: number) =>
            ((props.lineIndex < 1 && index < 4) ||
              (index >= props.lineIndex - 1 &&
                index <= props.lineIndex + 2)) && (
              <div
                key={index}
                className="practice-code-line"
                style={{
                  opacity: 1 - 0.15 * Math.abs(index - props.lineIndex),
                }}
              >
                {getTabSpace(index)}
                {getLine(line, index)}
              </div>
            )
        )}
    </div>
  );

  const clickToStart = (
    <div className="click-to-start">
      <p>click or press enter to start...</p>
    </div>
  );

  const nextPrevButtons = (
    <div className="practice-code-next-prev-buttons">
      <div
        className="practice-code-button"
        onClick={() => props.resetTest(false)}
      >
        <FiChevronLeft className="practice-code-left-arrow" />
      </div>
      <div
        id="next-button"
        className="practice-code-button"
        onClick={() => props.resetTest(true)}
      >
        <FiChevronRight className="practice-code-right-arrow" />
      </div>
    </div>
  );

  const emptyInput = (
    <input
      type="text"
      id="practice-code-input"
      value={props.userInput}
      onChange={onUserInputChange}
      onKeyDown={handleKeyPress}
      onKeyUp={handleKeyPress}
    ></input>
  );

  return (
    <div
      className={`practice-code-container ${
        !props.showStatusBar ? "no-status-bar" : ""
      } ${settings?.focus_mode ? "practice-code-focus-mode" : ""}`}
      style={{
        fontSize: settings?.font_size,
        fontWeight: settings?.font_weight,
      }}
      onClick={enable}
    >
      {active ? codeLines : clickToStart}
      {active && !props.usingCustom && nextPrevButtons}
      {emptyInput}
    </div>
  );
};

export default CodeView;
