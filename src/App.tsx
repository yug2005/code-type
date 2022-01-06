import './App.css';
import { useState } from 'react'
import Header from './components/Header'
import LanguagesPanel from './components/LanguagesPanel'
import PracticeCode from './components/PracticeCode'

function App() {
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState(false); 
  
  return (
    <div className="App">
      <Header onClickLanguages={() => (setLanguagesPanelOpen(true))}/>
      {languagesPanelOpen && <LanguagesPanel onClick={() => (console.log(''))} />}
      <PracticeCode />
    </div>
  );
}

export default App;
