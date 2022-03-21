import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components//header/Header";
import SignIn from "./components/signin/SignIn";
import LanguagesPanel from "./components/header/LanguagesPanel";
import Main from "./components/main/Main";
import Settings from "./components/settings/Settings"

function App() {
  const [language, setLanguage] = useState('');
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState(false);
  const [code, setCode] = useState([""])
  const [codeBlocks, setCodeBlocks]:any = useState([])
  
  const updateLanguage = (newLanguage: any) => {
    setLanguage(newLanguage);
    newLanguage = newLanguage.replaceAll('+', 'p')
    newLanguage = newLanguage.replaceAll('#', 's')
    if (newLanguage == language) {
      setLanguagesPanelOpen(false)
      return
    }
    // console.log("Getting code for language : " + newLanguage)
    getAllCodeBlocks(newLanguage, getNewCodeBlock); 
    setLanguagesPanelOpen(false);
  };
  
  // Gets all the code block for a specified language from the mysql database
  // Callback to the function that gets the starting code block
  const getAllCodeBlocks = async (language: string, callback:any = () => {return}) => {
    codeBlocks.length = 0
    const code_res = await fetch(
      `http://localhost:3001/${language}/all`
    )
    const code_data = await code_res.json()
    for (let index = 0; index < code_data.length; index++) {
      const code: string[] = code_data[index].body.split(/\n/)
      for (let line = 0; line < code.length; line++) {
        code[line] = code[line].replaceAll("newline", String.raw`\n`)
      }
      codeBlocks.push([code, code_data[index].numLines])
    }
    callback()
  }

  // Gets a new code block with the number of lines specified
  const getNewCodeBlock = (numLines = 50) => {
    const numCodeBlocks = codeBlocks.length
    setCodeBlocks(codeBlocks)
    // If there are no code blocks, alert the user and return
    if (numCodeBlocks === 0) {
      alert("There are no code blocks available for this language.")
      return
    }
    const temp = []
    const usedIndices = new Set()
    while (temp.length < numLines) {
      // find a new random code block that has not already been used
      var index = Math.floor(Math.random() * numCodeBlocks + 1)
      while (usedIndices.has(index)) {
        index = Math.floor(Math.random() * numCodeBlocks + 1)
      }
      usedIndices.add(index)
      // add lines from the code block to the test until you enough lines
      const codeBlock = codeBlocks[index][0]
      for (let line of codeBlock) {
        temp.push(line)
        if (temp.length === numLines) break
      }
    }
    setCode(temp)
  }

  // if the current code block does not have enough lines, this function adds more lines
  const addCodeLines = (numLines: number) => {
    const numCodeBlocks = codeBlocks.length
    if (numCodeBlocks === 0) {
      alert("There are no code blocks available for this language.")
      return
    }
    const usedIndices = new Set()
    while (code.length < numLines) {
      // find a new random code block that has not already been used
      var index = Math.floor(Math.random() * numCodeBlocks + 1)
      while (usedIndices.has(index)) {
        index = Math.floor(Math.random() * numCodeBlocks + 1)
      }
      usedIndices.add(index)
      // add lines from the code block to the test until you enough lines
      const codeBlock = codeBlocks[index][0]
      for (let line of codeBlock) {
        code.push(line)
        if (code.length === numLines) break
      }
    }
  }

  useEffect(() => {
      // currently supported : c++, javascript, python, css, html
      getAllCodeBlocks(language === "" ? "javascript" : language, getNewCodeBlock)
  }, [])

  return (
    <Router>
      <div className="App">
        {languagesPanelOpen && (
          <LanguagesPanel onLanguageClick={updateLanguage} />
        )}
        <Header
          language={language === "" ? "languages" : language}
          onClickLanguages={() => setLanguagesPanelOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Main language={language === "" ? 'javascript' : language} code={code} getCodeBlock={getNewCodeBlock} addCodeLines={addCodeLines}/>}/>
          <Route path="/signin" element={<SignIn />} />
          <Route path='/settings' element={<Settings />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
