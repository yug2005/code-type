import React, { useState, useEffect, useContext } from "react";
import { SettingContext } from "../../context/setting-context";
import CodeView from "./code-view";
import StatusBar from "./status-bar";
import TestStats from "./test-stats";
import {
  Limit,
  Test,
  Timer,
  TestDetails,
  Tracker,
} from "../../interfaces/interfaces";
import "../../css/main/main.css";

interface PropsInteface {
  language: string;
  code: Array<string>;
  getCodeBlock(numLines?: number): void;
  adjustCodeLines(numLines: number): void;
  onFileSubmit(file: string): void;
  usingCustom: boolean;
  refresh: boolean;
}

const Main = (props: PropsInteface) => {
  const { settings, setSettings } = useContext(SettingContext);

  const [userInput, setUserInput] = useState<string>("");
  const [lineIndex, setLineIndex] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<Array<string>>([""]);
  const [previousLines, setPreviousLines] = useState<Array<Array<string>>>([
    [""],
    [""],
  ]);

  const [limit, setLimit] = useState<Limit>({
    type: "time",
    value: 30,
  });

  // object for the timer
  const [timer, setTimer] = useState<Timer>({
    hr_time: 0,
    time: 0,
    started: false,
    finished: false,
  });

  // stores the test details
  const [test, setTest] = useState<Test>({
    chars: 0,
    lineChars: 0,
    incorrectChars: 0,
  });

  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);

  const [trackers, setTrackers] = useState<Tracker>({
    wpm: [],
    cpm: [],
    errors: [],
    temp: 0,
  });

  useEffect(() => {
    resetTest(false);
  }, [props.refresh]);

  useEffect(() => {
    resetTest(limit.type === "line");
  }, [limit]);

  // timer
  useEffect(() => {
    let interval: any = null;
    if (timer.finished) {
      clearInterval(interval);
    } else {
      if (timer.started) {
        if (settings.hide_status) {
          setSettings({ ...settings, show_status: false });
        }
        interval = setInterval(() => {
          setTrackers({ ...trackers, temp: test.incorrectChars });
          setTimer({ ...timer, time: timer.time + 1 });
          // determine the wpm/cpm
          if (timer.time > 0) {
            const { wpm, cpm } = computeStats();
            trackers.wpm.push([wpm, timer.time]);
            trackers.cpm.push([cpm, timer.time]);
          }
          // determine the number of errors
          if (test.incorrectChars > trackers.temp) {
            const numErrors = test.incorrectChars - trackers.temp;
            trackers.errors.push([numErrors, timer.time]);
          }
        }, 1000);
      } else if (settings && settings.hide_status && !settings.show_status) {
        setSettings({ ...settings, show_status: true });
      }
      // when the timer limit is reached
      if (limit.type === "time" && limit.value - timer.time === 0) {
        endTimer();
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (timer.started && !timer.finished && test.chars + test.lineChars > 0) {
      const { wpm, cpm, accuracy } = computeStats();
      setWpm(wpm);
      setCpm(cpm);
      setAccuracy(accuracy);
      if (
        settings.early_fail_settings.use &&
        (wpm < settings.early_fail_settings.wpm ||
          accuracy < settings.early_fail_settings.accuracy)
      ) {
        endTimer();
      }
    }
  }, [timer, test]);

  const computeStats = () => {
    const totalChars = test.chars + test.lineChars;
    let wpm = Math.round((totalChars * 60.0) / (timer.time * 4.5));
    let cpm = Math.round((totalChars * 60.0) / timer.time);
    let accuracy = Math.max(
      Math.round(((totalChars - test.incorrectChars) / totalChars) * 100),
      0
    );
    // adjust for wpm being very high at the start
    if (timer.time < 3) {
      wpm = Math.floor(wpm / 2);
      cpm = Math.floor(cpm / 2);
    }
    return { wpm, cpm, accuracy };
  };

  const startTimer = () => {
    if (!timer.started) setTimer({ ...timer, started: true });
  };

  const endTimer = () => {
    setTimer({ ...timer, finished: true });
    getTestDetails();
  };

  // reset all the variables for new test
  const resetTest = (newTest: boolean) => {
    setTimer({
      hr_time: 0,
      time: 0,
      started: false,
      finished: false,
    });
    setTest({
      chars: 0,
      lineChars: 0,
      incorrectChars: 0,
    });
    setTrackers({
      wpm: [],
      cpm: [],
      errors: [],
      temp: 0,
    });
    setUserInput("");
    setLineIndex(0);
    setCurrentLine([""]);
    setPreviousLines([[""], [""]]);
    if (newTest) {
      if (limit.type === "line") props.getCodeBlock(limit.value);
      else props.getCodeBlock();
    }
  };

  // object for storing the test statistics
  const [testDetails, setTestDetails] = useState<TestDetails>({
    labels: [],
    data: [],
    errorsLabels: [],
    errorsData: [],
    average: 0,
    max: 0,
    min: Infinity,
    accuracy: 100,
    totalChars: 0,
    correctChars: 0,
  });

  // getting the test statistics for after the test
  const getTestDetails = () => {
    // wpm labels and data
    let labels: any = [];
    let data: any = [];
    const tracker = settings.use_cpm ? trackers.cpm : trackers.wpm;
    if (tracker.length > 0) {
      let iterator = Math.ceil(tracker.length / 10);
      for (let i = 0; i <= tracker.length + 1; i += iterator) {
        labels.push(i + "s");
        if (tracker[i]) data.push(tracker[i][0]);
        else data.push(tracker[tracker.length - 1][0]);
      }
    } else labels = ["0s", "1s", "2s", "3s"];
    // errors labels
    const errors = trackers.errors;
    const errorsLabels =
      tracker.length === 0
        ? ["0s", "3s"]
        : errors.length === 0
        ? ["0s", Math.ceil(timer.time / 2) + "s", timer.time + "s"]
        : errors.length < 3
        ? ["0s", ...errors.map((val: any) => val[1] + "s"), timer.time + "s"]
        : errors.map((val: any) => val[1] + "s");
    // errors data
    const errorsData =
      errors.length === 0
        ? [NaN, NaN, NaN]
        : errors.length < 3
        ? [NaN, ...errors.map((val: any) => val[0]), NaN]
        : errors.map((val: any) => val[0]);
    // average, best, and worst wpm
    let sum = 0,
      max = 0,
      min = tracker.length > 0 ? Infinity : 0;
    for (let i = 0; i < tracker.length; i++) {
      sum += tracker[i][0];
      if (tracker[i][0] > max) max = tracker[i][0];
      if (tracker[i][0] < min) min = tracker[i][0];
    }
    const average = tracker.length > 0 ? Math.round(sum / tracker.length) : 0;
    // total chars in the test
    const totalChars = props.code.reduce(
      (a: any, b: any) => a + b.replace(/\s+/g, " ").trim().length,
      0
    );
    // setting all properties
    setTestDetails({
      labels: labels,
      data: data,
      errorsLabels: errorsLabels,
      errorsData: errorsData,
      average: average,
      max: max,
      min: min,
      accuracy: accuracy,
      totalChars: totalChars,
      correctChars: Math.max(test.chars - test.incorrectChars, 0),
    });
  };

  // when the user submits a file, then reset the test
  const onFileSubmit = (file: string) => {
    resetTest(false);
    props.onFileSubmit(file);
  };

  return !timer.finished ? (
    <div className="main-container">
      {/* practice code block */}
      <CodeView
        code={props.code}
        test={test}
        setTest={setTest}
        resetTest={resetTest}
        startTimer={startTimer}
        endTimer={endTimer}
        showStatusBar={settings.show_status && !settings.focus_mode}
        userInput={userInput}
        setUserInput={setUserInput}
        lineIndex={lineIndex}
        setLineIndex={setLineIndex}
        currentLine={currentLine}
        setCurrentLine={setCurrentLine}
        previousLines={previousLines}
        usingCustom={props.usingCustom}
      />
      {/* status bar below the practice code */}
      {settings.show_status && !settings.focus_mode && (
        <StatusBar
          wpm={timer.time === 0 || test.chars + test.lineChars === 0 ? "" : wpm}
          cpm={timer.time === 0 || test.chars + test.lineChars === 0 ? "" : cpm}
          accuracy={test.chars + test.lineChars === 0 ? "" : accuracy}
          time={
            limit.type === "time"
              ? limit.value - timer.time
              : timer.started
              ? timer.time
              : ""
          }
          limit={limit}
          setLimit={setLimit}
          onFileSubmit={onFileSubmit}
        />
      )}
      {/* show status bar button */}
      {!settings.hide_status && !settings.focus_mode && (
        <button
          className="toggle-status-bar"
          onClick={() =>
            setSettings({
              ...settings,
              show_status: !settings.show_status,
            })
          }
        >
          {settings.show_status ? "hide" : "show"} status bar
        </button>
      )}
    </div>
  ) : (
    <TestStats
      testDetails={testDetails}
      limit={limit}
      resetTest={resetTest}
      language={props.language}
    />
  );
};

export default Main;
