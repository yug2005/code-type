import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/user-context";
import CodeView from "./code-view";
import StatusBar from "./status-bar";
import TestStats from "./test-stats";
import "../../css/main/main.css";

interface PropsInteface {
  language: string;
  code: any;
  getCodeBlock: any;
  adjustCodeLines: any;
  onFileSubmit: any;
  usingCustom: any;
  refresh: any;
}

const Main = (props: PropsInteface) => {
  const [settings, setSettings]: any = useContext(UserContext);

  useEffect(() => {
    resetTest(false);
  }, [props.refresh]);

  const [userInput, setUserInput] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [currentLine, setCurrentLine] = useState([""]);
  const [previousLines, setPreviousLines] = useState([[""], [""]]);

  const [limit, setLimit] = useState({
    type: "time",
    timeLimit: 30,
    lineLimit: 15,
  });

  const setNewTimeLimit = (newTimeLimit: number) => {
    setLimit({ ...limit, type: "time", timeLimit: newTimeLimit });
    props.adjustCodeLines(50);
  };

  const setNewLineLimit = (newLineLimit: number) => {
    setLimit({ ...limit, type: "line", lineLimit: newLineLimit });
    props.adjustCodeLines(newLineLimit);
  };

  // object for the timer
  const [timer, setTimer] = useState({
    hr_time: 0,
    time: 0,
    started: false,
    finished: false,
  });

  // stores the test details
  const [test, setTest] = useState({
    chars: 0,
    lineChars: 0,
    incorrectChars: 0,
  });

  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const [trackers, setTrackers]: any = useState({
    wpm: [],
    cpm: [],
    errors: [],
    temp: 0,
  });

  // timer
  useEffect(() => {
    let interval: any = null;
    if (timer.finished) {
      clearInterval(interval);
    } else {
      if (timer.started) {
        if (settings?.hide_status)
          setSettings?.({
            ...settings,
            show_status: false,
          });
        interval = setInterval(() => {
          setTrackers({ ...trackers, temp: test.incorrectChars });
          // increment timer
          setTimer({ ...timer, time: timer.time + 1 });
          // determine the wpm
          if (timer.time > 0) {
            const { wpm, cpm, accuracy } = computeStats();
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
        setSettings?.({
          ...settings,
          show_status: true,
        });
      }
      // when the timer limit is reached
      if (limit.type === "time" && limit.timeLimit - timer.time === 0) {
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
      if (settings?.fails_on.use) {
        if (
          wpm < settings?.fails_on.wpm ||
          accuracy < settings?.fails_on.accuracy
        ) {
          endTimer();
        }
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

  // starts the timer
  const startTimer = () => {
    if (!timer.started) setTimer({ ...timer, started: true });
  };

  // ends the timer
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
      if (limit.type === "line") props.getCodeBlock(limit.lineLimit);
      else props.getCodeBlock();
    }
  };

  // object for storing the test statistics
  const [testDetails, setTestDetails] = useState({
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
    const tracker = settings?.use_cpm ? trackers.cpm : trackers.wpm;
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
  const onFileSubmit = (file: any) => {
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
        showStatusBar={settings?.show_status && !settings?.focus_mode}
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
      {settings?.show_status && !settings?.focus_mode && (
        <StatusBar
          wpm={timer.time === 0 || test.chars + test.lineChars === 0 ? "" : wpm}
          cpm={timer.time === 0 || test.chars + test.lineChars === 0 ? "" : cpm}
          accuracy={test.chars + test.lineChars === 0 ? "" : accuracy}
          time={
            limit.type === "time"
              ? limit.timeLimit - timer.time
              : timer.started
              ? timer.time
              : ""
          }
          limit={limit.type}
          limitValue={limit.type === "time" ? limit.timeLimit : limit.lineLimit}
          onSetTimeLimit={setNewTimeLimit}
          onSetLineLimit={setNewLineLimit}
          onFileSubmit={onFileSubmit}
        />
      )}
      {/* show status bar button */}
      {!settings?.hide_status && (
        <button
          className="toggle-status-bar"
          onClick={() =>
            setSettings?.({
              ...settings,
              show_status: !settings.show_status,
            })
          }
        >
          {settings?.show_status ? "hide" : "show"} status bar
        </button>
      )}
    </div>
  ) : (
    <TestStats
      testDetails={testDetails}
      limit={limit.type}
      limitValue={limit.type === "time" ? limit.timeLimit : limit.lineLimit}
      resetTest={resetTest}
      language={props.language}
    />
  );
};

export default Main;
