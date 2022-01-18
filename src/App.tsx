import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components//header/Header";
import SignIn from "./components/signin/SignIn";
import LanguagesPanel from "./components/header/LanguagesPanel";
import Main from "./components/main/Main";
import Settings from "./components/settings/Settings"

function App() {
  const [language, setLanguage] = useState("");
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState(false);
  const [code, setCode] = useState([""]);

  const fetchCode = async (language: string) => {
      const len_res = await fetch(
        `http://localhost:3001/${language}`
      );
      const len_data = await len_res.json();
      const length: number = len_data[0].count;
      const id: number = Math.floor(Math.random() * length + 1);
      const code_res = await fetch(
        `http://localhost:3001/${language}/${id}`
      );
      const code_data = await code_res.json();
      const code: string[] = code_data[0].body.split("\n");
      setCode(code);
  };

  const getCode = ():any => {
    const code = fetchCode('cpp')
    if (code === null) return ''
    else return code
  }

  const updateLanguage = (newLanguage: any) => {
      setLanguage(newLanguage);
      // fetchCode("cpp");
      setLanguagesPanelOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <Header
          language={language === "" ? "languages" : language}
          onClickLanguages={() => setLanguagesPanelOpen(true)}
        />
        {languagesPanelOpen && (
          <LanguagesPanel onLanguageClick={updateLanguage} />
        )}
        <Routes>
          <Route path="/" element={<Main getCode={getCode} code={code}/>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path='/settings' element={<Settings />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
