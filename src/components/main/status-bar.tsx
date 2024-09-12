import React, { useState, useContext } from "react";
import { FiCheck } from "react-icons/fi";
import { SettingContext } from "../../context/setting-context";
import { Limit } from "../../interfaces/interfaces";
import "../../css/main/status-bar.css";

interface StatusBarInterface {
  wpm: number | string;
  cpm: number | string;
  accuracy: number | string;
  time: number | string;
  limit: Limit;
  setLimit(limit: Limit): void;
  onFileSubmit(file: string): void;
}

const fileTypes =
  ".c,.cs,.cpp,.h,.hpp,.css,.go,.html,.java,.js,.jsx,.ts,.tsx,.kt,.sql,.php,.py,.txt";

const StatusBar = (props: StatusBarInterface) => {
  const { settings } = useContext(SettingContext);

  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<string>("");
  const [formattedFile, setFormattedFile] = useState<string>("");
  const [fileUploadWindowOpen, setFileUploadWindowOpen] =
    useState<boolean>(false);

  const onUpload = () => {
    document.getElementById("file-upload-input")?.click();
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;
    if (files === null || files.length === 0) return;
    if (files[0].size > 10000000) {
      alert("The file size exceeds 10 MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = () => {
      const file: string | undefined = reader.result?.toString();
      if (!file) return;
      let numLines: number = file.split("\n").length;
      if (numLines > 500) {
        alert("This file is too large.");
        return;
      }
      setFile(file);
      let temp: string = file.replaceAll(/\s*$/g, "");
      temp = temp.replaceAll(/\n\s*\n/g, "\n");
      setFormattedFile(temp);
      setFileName(files[0].name);
      setFileUploadWindowOpen(true);
    };
  };

  const onFileSubmit = (file: any) => {
    setFileUploadWindowOpen(false);
    props.onFileSubmit(file);
  };

  return (
    <div className="under-bar-container">
      {fileUploadWindowOpen && (
        <FileUploadWindow
          file={file}
          fileName={fileName}
          formattedFile={formattedFile}
          setFormattedFile={setFormattedFile}
          onCancel={() => setFileUploadWindowOpen(false)}
          onFileSubmit={onFileSubmit}
        />
      )}
      {/* wpm, accuracy, and time display */}
      {settings.show_wpm && (
        <div className="under-bar-item" style={{ width: "70px" }}>
          <label className="under-bar-label">
            {settings.use_cpm ? "cpm" : "wpm"}
          </label>
          <p className="under-bar-value">
            {settings.use_cpm ? props.cpm : props.wpm}
          </p>
        </div>
      )}
      {settings.show_accuracy && (
        <div className="under-bar-item" style={{ width: "150px" }}>
          <label className="under-bar-label">accuracy</label>
          {props.accuracy !== "" && (
            <p className="under-bar-value">{props.accuracy}%</p>
          )}
        </div>
      )}
      <div className="under-bar-item" style={{ width: "100px" }}>
        <label className="under-bar-label">time</label>
        {props.time !== "" && <p className="under-bar-value">{props.time}s</p>}
      </div>
      {/* test limit settings */}
      {settings.show_limits && (
        <React.Fragment>
          <div className="under-bar-setting">
            <label
              className={`under-bar-label ${
                props.limit.type === "time" ? "selected-setting" : ""
              }`}
            >
              timed
            </label>
            <div className="under-bar-drop-down">
              {[15, 30, 45, 60].map((time_limit: number) => (
                <button
                  className="drop-down-button"
                  onClick={() => props.setLimit({ type: "time", value: time_limit })}
                >
                  <p>{time_limit} sec</p>
                  {props.limit.type === "time" && props.limit.value === time_limit && (
                    <FiCheck className="drop-down-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="under-bar-setting">
            <label
              className={`under-bar-label ${
                props.limit.type === "line" ? "selected-setting" : ""
              }`}
            >
              lines
            </label>
            <div className="under-bar-drop-down">
              {[5, 10, 15, 20].map((num_lines: number) => (
                <button
                  className="drop-down-button"
                  onClick={() => props.setLimit({ type: "line", value: num_lines })}
                >
                  <p>{num_lines} lines</p>
                  {props.limit.type === "line" && props.limit.value === num_lines && (
                    <FiCheck className="drop-down-check" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="under-bar-setting">
            <label className="under-bar-label">custom</label>
            <div className="under-bar-drop-down" style={{translate: "0 -45px"}}>
              <button className="drop-down-button" onClick={onUpload}>
                upload
              </button>
              <input
                id="file-upload-input"
                type="file"
                name="file upload"
                accept={fileTypes}
                onChange={(e) => onFileUpload(e)}
                hidden
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

interface FileUploadWindowInterface {
  file: string;
  fileName: string;
  formattedFile: string;
  setFormattedFile(file: string): void;
  onCancel(): void;
  onFileSubmit(file: string): void;
}

const FileUploadWindow = ({
  file,
  fileName,
  formattedFile,
  setFormattedFile,
  onCancel,
  onFileSubmit,
}: FileUploadWindowInterface) => {
  const [removeLines, setRemoveLines] = useState<boolean>(true);
  const [removeComments, setRemoveComments] = useState<boolean>(false);
  const [formatFile, setFormatFile] = useState<boolean>(false);

  const getFormattedFile = (
    removeLines: Boolean,
    removeComments: Boolean,
    formatFile: Boolean
  ) => {
    var temp = file;
    temp = temp.replaceAll(/\s*$/g, "");

    const fileExtension: string = fileName.split(".").pop()!;

    if (removeComments) {
      if (
        [
          "c",
          "cs",
          "cpp",
          "h",
          "hpp",
          "java",
          "js",
          "jsx",
          "ts",
          "tsx",
        ].includes(fileExtension)
      ) {
        temp = temp.replaceAll(/\s*[/][/].*\n?/g, "");
        temp = temp.replaceAll(/[/][/].*/g, "");
        temp = temp.replaceAll(/[/]\*([^/]|\n)*\*[/]/g, "");
      } else {
        console.log("This file cannot have comments removed.");
      }
    }
    if (formatFile) {
      temp = temp.replaceAll(/\n\s*\{/g, " {");
      temp = temp.replaceAll(/\s*;/g, ";");
      temp = temp.replaceAll(/\{(\w)/g, "{ $1");
      temp = temp.replaceAll(/(\w)\}/g, "$1 }");
    }
    if (removeLines) {
      temp = temp.replaceAll(/\n\s*\n/g, "\n");
      temp = temp.replace(/^\s*\n/g, "");
    }
    setFormattedFile(temp);
  };

  return (
    <div className="file-upload-window">
      <div className="file-upload">
        {/* <div className='file-upload-title'>Upload</div> */}
        <div className="file-name">{fileName}</div>
        <div className="file-preview">
          <pre>{formattedFile}</pre>
        </div>
        <form className="file-upload-options">
          <input
            type="checkbox"
            className="file-upload-checkbox"
            name="remove extra lines"
            checked={removeLines}
            onChange={() => {
              setRemoveLines(!removeLines);
              getFormattedFile(!removeLines, removeComments, formatFile);
            }}
          />
          <label className="file-upload-label">remove extra lines</label>
          <input
            type="checkbox"
            className="file-upload-checkbox"
            name="remove comments"
            checked={removeComments}
            onChange={() => {
              setRemoveComments(!removeComments);
              getFormattedFile(removeLines, !removeComments, formatFile);
            }}
          />
          <label className="file-upload-label">remove comments</label>
          <input
            type="checkbox"
            className="file-upload-checkbox"
            name="format file"
            checked={formatFile}
            onChange={() => {
              setFormatFile(!formatFile);
              getFormattedFile(removeLines, removeComments, !formatFile);
            }}
          />
          <label className="file-upload-label">format file</label>
        </form>
        <div className="file-upload-buttons">
          <button className="setting-button" onClick={onCancel}>
            cancel
          </button>
          <button
            className="file-upload-button"
            onClick={() => onFileSubmit(formattedFile)}
          >
            upload
          </button>
        </div>
      </div>
      <div className="close-file-upload" onClick={onCancel}></div>
    </div>
  );
};

export default StatusBar;
