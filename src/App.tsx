import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SettingContext, defaultSettings } from "./context/setting-context";
import Main from "./components/main/main";
import Header from "./components/header/header";
import SignIn from "./components/signin/sign-in";
import Settings from "./components/settings/settings";
import SelectLanguage from "./components/header/select-language";
import { CustomFile, UserSettings } from "./interfaces/interfaces";

function App() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // passed in to Main component to reset the state of the test
  const [refresh, setRefresh] = useState<boolean>(false);

  const [language, setLanguage] = useState<string>("javascript");
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState<boolean>(false);
  const [code, setCode] = useState<Array<string>>([]);
  const [codeBlocks, setCodeBlocks] = useState<Array<Array<string>>>([]);

  onkeydown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      if (languagesPanelOpen) {
        setLanguagesPanelOpen(false);
      }
      return false;
    } else if (e.code === "Tab") {
      return false;
    }
  };

  // if the user wants to upload a custom file for use
  const customFile = useRef<CustomFile>({
    use: false,
    file: [],
    index: 0,
  });

  // when the user changes the language through the language panel
  const updateLanguage = (newLanguage: string) => {
    // parse the name of the language
    if (newLanguage === "c++") newLanguage = "cpp";
    if (newLanguage === "c#") newLanguage = "csharp";
    // if the language is already in use, just close the panel
    if (newLanguage === "" || newLanguage === language) {
      setLanguagesPanelOpen(false);
      return;
    }
    setLanguage(newLanguage);
    setLanguagesPanelOpen(false);
    customFile.current = {
      use: false,
      file: [],
      index: 0,
    };
  };

  useEffect(() => {
    getAllCodeBlocks();
  }, [language]);

  useEffect(() => {
    getNewCodeBlock();
  }, [codeBlocks]);

  // Gets all the code block for a specified language from the mysql database
  // Callback to the function that gets the starting code block
  const getAllCodeBlocks = () => {
    fetch(`https://code-type-api.org/${language}`).then((response) => {
      response.json().then((data: Array<{ id: number, code: string }>) => {
        let blocks: Array<Array<string>> = [];
        data.forEach(({ code }: { code: string }) => {
          blocks.push(code.split(/\n/));
        });
        setCodeBlocks(blocks);
      });
    });
  };

  // Gets a new code block with the number of lines specified
  const getNewCodeBlock = (numLines: number = 50) => {
    if (customFile.current.use) {
      getCustomCodeBlock(numLines);
      return;
    }
    if (codeBlocks.length === 0) {
      return;
    }
    let block: Array<string> = [];
    let used = new Set<number>();
    while (block.length < numLines) {
      // find a new random code block that has not already been used
      let index = Math.floor(Math.random() * codeBlocks.length);
      while (used.has(index)) {
        index = Math.floor(Math.random() * codeBlocks.length);
      }
      used.add(index);
      codeBlocks[index].forEach((line: string) => {
        if (block.length < numLines) block.push(line);
      });
    }
    setCode(block);
  };

  // if the current code block does not have enough lines, this function adds more lines
  const adjustCodeLines = (numLines: number) => {
    if (customFile.current.use) {
      adjustCustomLines(numLines);
      return;
    }

    const numCodeBlocks = codeBlocks.length;
    if (numCodeBlocks === 0) {
      alert("There are no code blocks available for this language.");
      return;
    }
    while (code.length > numLines) {
      code.pop();
    }
    const usedIndices = new Set();
    while (code.length < numLines) {
      // find a new random code block that has not already been used
      var index = Math.floor(Math.random() * numCodeBlocks + 1);
      let maxIterations = 0;
      while (usedIndices.has(index)) {
        index = Math.floor(Math.random() * numCodeBlocks + 1);
        if (maxIterations > numCodeBlocks * 5) {
          alert("There are not enough code blocks for " + numLines + " lines");
          return;
        }
        maxIterations++;
      }
      usedIndices.add(index);
      // add lines from the code block to the test until you enough lines
      const codeBlock = codeBlocks[index][0];
      for (let line of codeBlock) {
        code.push(line);
        if (code.length === numLines) break;
      }
    }
  };

  // when the user submits a new custom file
  const onCustomFileSubmit = (file: string) => {
    customFile.current = {
      use: true,
      file: file.split("\n"),
      index: 0,
    };
    getCustomCodeBlock();
  };

  // gets a new code block from the custom file
  const getCustomCodeBlock = (numLines: number = 50) => {
    if (!customFile.current.file) return;
    const temp: any = [];
    var index = customFile.current.index;
    for (let i = 0; i < numLines; i++) {
      temp.push(customFile.current.file[index]);
      index++;
      if (index === customFile.current.file.length) index = 0;
    }
    customFile.current.index = index;
    setCode(temp);
  };

  // if the current code block does not have enough lines, this function adds more lines
  const adjustCustomLines = (numLines: number) => {
    var index = customFile.current.index;
    while (code.length > numLines) {
      if (index === 0) index = customFile.current.file.length;
      code.pop();
      index--;
    }
    customFile.current.index = index;
    while (code.length < numLines) {
      if (index === customFile.current.file.length) index = 0;
      code.push(customFile.current.file[index]);
      index++;
    }
    customFile.current.index = index;
  };

  return (
    <Router>
      <div className="App">
        {languagesPanelOpen && (
          <SelectLanguage onLanguageClick={updateLanguage} />
        )}
        <SettingContext.Provider value={{ settings, setSettings }}>
          <Header
            language={customFile.current.use ? "custom" : language}
            onClickLanguages={() => setLanguagesPanelOpen(true)}
          />
          <Routes>
            <Route
              path="/code-type"
              element={
                <Main
                  language={customFile.current.use ? "custom" : language}
                  code={code}
                  getCodeBlock={getNewCodeBlock}
                  adjustCodeLines={adjustCodeLines}
                  onFileSubmit={onCustomFileSubmit}
                  usingCustom={customFile.current.use}
                  refresh={refresh}
                />
              }
            />
            {/* <Route path="/signin" element={<SignIn />} /> */}
            <Route path="/code-type/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/code-type" replace />} />
          </Routes>
        </SettingContext.Provider>
      </div>
    </Router>
  );
}

export default App;
