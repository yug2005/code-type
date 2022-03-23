import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components//header/Header";
import SignIn from "./components/signin/SignIn";
import LanguagesPanel from "./components/header/LanguagesPanel";
import Main from "./components/main/Main";
import Settings from "./components/settings/Settings"

function App() {
  const [refresh, setRefresh] = useState(false)
  
  const [language, setLanguage] = useState('');
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState(false);
  const [code, setCode] = useState([""])
  const [codeBlocks, setCodeBlocks]:any = useState([])

  const customFile = useRef({
    use: false,
    file: [], 
    index: 0
  })
  
  const updateLanguage = (newLanguage: any) => {
    setLanguage(newLanguage);
    newLanguage = newLanguage.replaceAll('+', 'p')
    newLanguage = newLanguage.replaceAll('#', 's')
    if (newLanguage === language) {
      setLanguagesPanelOpen(false)
      return
    }
    // console.log("Getting code for language : " + newLanguage)
    getAllCodeBlocks(newLanguage, getNewCodeBlock); 
    setLanguagesPanelOpen(false);
    customFile.current = {
      use: false, 
      file: [], 
      index: 0
    }
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
    setRefresh(!refresh)
    if (customFile.current.use) {
      getCustomCodeBlock(numLines)
      return
    }
    
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
  const adjustCodeLines = (numLines: number) => {
    if (customFile.current.use) {
      adjustCustomLines(numLines)
      return
    }

    const numCodeBlocks = codeBlocks.length
    if (numCodeBlocks === 0) {
      alert("There are no code blocks available for this language.")
      return
    }
    while (code.length > numLines) {
      code.pop()
    }
    const usedIndices = new Set()
    while (code.length < numLines) {
      // find a new random code block that has not already been used
      var index = Math.floor(Math.random() * numCodeBlocks + 1)
      let maxIterations = 0
      while (usedIndices.has(index)) {
        index = Math.floor(Math.random() * numCodeBlocks + 1)
        if (maxIterations > numCodeBlocks * 5) {
          alert("There are not enough code blocks for " + numLines + " lines")
          return
        }
        maxIterations++
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

  const onCustomFileSubmit = (file: any) => {
    customFile.current = {
      use: true, 
      file: file.split('\n'), 
      index: 0
    }
    getCustomCodeBlock()
  }

  const getCustomCodeBlock = (numLines = 50) => {
    if (!customFile.current.file) return
    const temp:any = []
    var index = customFile.current.index
    for (let i = 0; i < numLines; i++) {
      temp.push(customFile.current.file[index])
      index++
      if (index === customFile.current.file.length) index = 0; 
    }
    customFile.current.index = index
    setCode(temp)
  }

  const adjustCustomLines = (numLines: number) => {
    var index = customFile.current.index
    while (code.length > numLines) {
      if (index === 0) index = customFile.current.file.length
      code.pop()
      index--
    }
    customFile.current.index = index
    while (code.length < numLines) {
      if (index == customFile.current.file.length) index = 0
      code.push(customFile.current.file[index])
      index++; 
    }
    customFile.current.index = index
  }

  useEffect(() => {
      getAllCodeBlocks(language === "" ? "javascript" : language, getNewCodeBlock)
  }, [])

  return (
    <Router>
      <div className="App">
        {languagesPanelOpen && (
          <LanguagesPanel onLanguageClick={updateLanguage} />
        )}
        <Header
          language={customFile.current.use ? "custom" : language === "" ? "languages" : language}
          onClickLanguages={() => setLanguagesPanelOpen(true)}
        />
        <Routes>
          <Route path="/" element={
            <Main 
              language={customFile.current.use ? "custom" : language === "" ? 'javascript' : language} 
              code={code} 
              getCodeBlock={getNewCodeBlock} 
              adjustCodeLines={adjustCodeLines}
              onFileSubmit={onCustomFileSubmit}
              usingCustom={customFile.current.use}
              refresh={refresh}
            />
          }/>
          <Route path="/signin" element={<SignIn />} />
          <Route path='/settings' element={<Settings />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
