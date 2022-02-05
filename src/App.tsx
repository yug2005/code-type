import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components//header/Header";
import SignIn from "./components/signin/SignIn";
import LanguagesPanel from "./components/header/LanguagesPanel";
import Main from "./components/main/Main";
import Settings from "./components/settings/Settings"

function App() {
  const [language, setLanguage] = useState('');
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState(false);
  
  const updateLanguage = (newLanguage: any) => {
    setLanguage(newLanguage);
    setLanguagesPanelOpen(false);
  };

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
          <Route path="/" element={<Main language={language}/>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path='/settings' element={<Settings />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
