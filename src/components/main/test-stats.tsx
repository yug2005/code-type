import React, { useState, useEffect, useContext } from "react";
import { Line } from "react-chartjs-2";
import { MdNavigateNext } from "react-icons/md";
import { IoRepeatOutline } from "react-icons/io5";
import { UserContext } from "../../context/user-context";
import "../../css/main/test-stats.css";

import {
  Chart as ChartJS,
  ChartType,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TestStats = (props: {
  testDetails: any;
  limit: string;
  limitValue: number;
  resetTest: any;
  language: string;
}) => {
  const [settings, setSettings]: any = useContext(UserContext);

  useEffect(() => {
    document.getElementById("finished-test-input")?.focus();
    setUserInput("");
  }, []);

  const map: any = {};
  onkeydown = onkeyup = (e: any) => {
    map[e.keyCode] = e.type == "keydown";
    // when the user is holding down the tab key
    if (map[9]) {
      document
        .getElementById("next-test-button")
        ?.classList.add("finished-test-buttons-hover");
    } else {
      document
        .getElementById("next-test-button")
        ?.classList.remove("finished-test-buttons-hover");
    }
    // when the user presses tab and enter
    if (map[9] && map[13]) {
      props.resetTest(true);
      return false;
    }
  };

  const [userInput, setUserInput] = useState("");

  const getWordInUserInput = (word: string) => {
    for (let i = word.length; i > 0; i--) {
      if (
        userInput.length - i !== -1 &&
        userInput.lastIndexOf(word.substring(0, i)) === userInput.length - i
      ) {
        if (i === word.length) props.resetTest(word === "next");
        return Array.from({ length: word.length }, (val: any, index: number) =>
          index < i ? "typed" : ""
        );
      }
    }
    return ["", "", "", "", ""];
  };

  const style = getComputedStyle(document.body);
  const chart_color = style.getPropertyValue("--chart-color");
  const chart_text_color = style.getPropertyValue("--chart-text-color");
  const wpm_color = style.getPropertyValue("--chart-wpm-color");
  const wpm_border_color = style.getPropertyValue("--chart-wpm-border-color");
  const error_color = style.getPropertyValue("--chart-error-color");
  const error_border_color = style.getPropertyValue(
    "--chart-error-border-color"
  );

  const wpm = {
    labels: props.testDetails.labels,
    datasets: [
      {
        label: `${settings?.use_cpm ? "characters" : "words"} per minute`,
        data: props.testDetails.data,
        backgroundColor: wpm_color,
        borderColor: wpm_border_color,
      },
    ],
  };

  const errors = {
    labels: props.testDetails.errorsLabels,
    datasets: [
      {
        label: "errors",
        data: props.testDetails.errorsData,
        backgroundColor: error_color,
        borderColor: error_border_color,
      },
    ],
  };

  const wpm_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            family: "Red Hat Mono",
          },
          color: chart_text_color,
        },
      },
      title: {
        display: false,
        text: `${settings?.use_cpm ? "characters" : "words"} per minute`,
      },
      tooltip: {
        callbacks: {
          label: (item: any) =>
            `${item.formattedValue} ${settings?.use_cpm ? "cpm" : "wpm"}`,
        },
      },
    },
    scales: {
      xAxes: {
        title: {
          display: false,
          text: "time",
        },
        grid: {
          display: true,
          color: chart_color,
        },
        ticks: {
          font: {
            family: "Red Hat Mono",
            size: 11,
          },
          color: chart_text_color,
        },
      },
      yAxes: {
        title: {
          display: false,
          text: `${settings?.use_cpm ? "characters" : "words"} per minute`,
        },
        grid: {
          display: true,
          color: chart_color,
        },
        ticks: {
          font: {
            family: "Red Hat Mono",
            size: 11,
          },
          color: chart_text_color,
        },
        min: 0,
        suggestedMax: settings?.use_cpm ? 540 : 120,
      },
    },
    radius: 4,
    hoverRadius: 6,
  };

  const errors_options = {
    responsive: true,
    showLine: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 13,
            family: "Red Hat Mono",
          },
          color: chart_text_color,
        },
      },
      title: {
        display: false,
        text: "number of errors",
      },
      tooltip: {
        callbacks: {
          label: (item: any) =>
            `${item.formattedValue} error${
              item.formattedValue === "1" ? "" : "s"
            }`,
        },
      },
    },
    scales: {
      xAxes: {
        title: {
          display: false,
          text: "time",
        },
        grid: {
          display: true,
          color: chart_color,
        },
        ticks: {
          font: {
            family: "Red Hat Mono",
            size: 11,
          },
          color: chart_text_color,
        },
      },
      yAxes: {
        title: {
          display: false,
          text: "number of errors",
        },
        grid: {
          display: true,
          color: chart_color,
        },
        ticks: {
          stepSize: 1,
          font: {
            family: "Red Hat Mono",
            size: 11,
          },
          color: chart_text_color,
        },
        min: 0,
        suggestedMax: 3,
      },
    },
    radius: 4,
    hoverRadius: 6,
  };

  return (
    <div className="test-finished-container">
      <div className="test-finished-title">
        <h2>TEST SUMMARY</h2>
      </div>
      <div className="charts-container">
        <div className="errors-chart">
          <Line
            data={errors}
            options={errors_options}
            width="10px"
            height="15px"
          />
        </div>
        <div className="wpm-chart">
          <Line data={wpm} options={wpm_options} width="40px" height="15px" />
        </div>
      </div>
      <div className="others-container">
        <div className="other-stat">
          <h3 id="test-details">test details</h3>
          <p>language: {props.language}</p>
          {props.limit === "time" ? (
            <p id="test-type">timed {props.limitValue}s</p>
          ) : (
            <p id="test-type">{props.limitValue} lines</p>
          )}
        </div>
        <div className="other-stat">
          <h3>average {settings?.use_cpm ? "cpm" : "wpm"}</h3>
          <div>{props.testDetails.average}</div>
        </div>
        <div className="other-stat">
          <h3>fastest {settings?.use_cpm ? "cpm" : "wpm"}</h3>
          <div>{props.testDetails.max}</div>
        </div>
        <div className="other-stat">
          <h3>slowest {settings?.use_cpm ? "cpm" : "wpm"}</h3>
          <div>{props.testDetails.min}</div>
        </div>
        <div className="other-stat">
          <h3>accuracy</h3>
          <div>{props.testDetails.accuracy}</div>
        </div>
        <div className="other-stat">
          <h3>correct chars</h3>
          <div>{props.testDetails.correctChars}</div>
        </div>
      </div>
      <div className="finished-test-buttons">
        <button
          className="finished-test-button"
          onClick={() => props.resetTest(false)}
        >
          <div className="button-label">
            {"again".split("").map((char, index) => {
              return (
                <span id={getWordInUserInput("again")[index]}>{char}</span>
              );
            })}
          </div>
          <IoRepeatOutline id="prev-icon" />
        </button>
        <button
          className="finished-test-button"
          id="next-test-button"
          onClick={() => props.resetTest(true)}
        >
          <div className="button-label">
            {"next".split("").map((char, index) => {
              return <span id={getWordInUserInput("next")[index]}>{char}</span>;
            })}
          </div>
          <MdNavigateNext id="next-icon" />
        </button>
      </div>
      {/* temporary text box */}
      <input
        id="finished-test-input"
        type="text"
        onChange={(e) => setUserInput(e.target.value)}
      ></input>
    </div>
  );
};

export default TestStats;
