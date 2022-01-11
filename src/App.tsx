import React, { useState, useEffect } from 'react'
import Header from './components//header/Header'
import LanguagesPanel from './components//header/LanguagesPanel'
import SignIn from './components/signin/SignIn'
import PracticeCode from './components/main/PracticeCode'

function App() {
  
  const [language, setLanguage] = useState('')
  const [languagesPanelOpen, setLanguagesPanelOpen] = useState(false); 
  const [code, setCode] = useState([''])

  // const [languageList, setLanguageList] = useState([])

  // const getLanguage = async (language: string) => {
  //   const res = await fetch(`http://localhost:3001/${language}`)
  //   const data = await res.json()
  //   setLanguageList(data)
  // }

  const getCode = async (language: string, category: string) => {
    const len_res = await fetch(`http://localhost:3001/${language}/${category}`)
    const len_data = await len_res.json()
    const length: number = len_data[0].count
    const id: number = Math.floor(Math.random() * length + 1)
    const code_res = await fetch(`http://localhost:3001/${language}/${category}/${id}`)
    const code_data = await code_res.json()
    const code: string[] = code_data[0].body.split('\n')
    setCode(code)
  }

  const updateLanguage = (newLanguage: any) => {
    setLanguage(newLanguage)
    getCode('cpp', 'function')
    setLanguagesPanelOpen(false)
  }
  
  return (
    <div className="App">
      <Header language={language === '' ? 'languages' : language} onClickLanguages={() => (setLanguagesPanelOpen(true))} />
      {languagesPanelOpen && <LanguagesPanel onLanguageClick={updateLanguage} />}
      {/* <PracticeCode code={code}/> */}
      <SignIn />
    </div>
  );
}

export default App;
