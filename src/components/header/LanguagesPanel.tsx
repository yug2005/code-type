import React, { useState } from 'react'
import { isPropertyAccessExpression } from 'typescript';
import Button from '../Button'
import './LanguagesPanel.css'; 

interface LanguagesPanelInterface {
    onLanguageClick(language: string): void; 
}

const supportedLanguages = [
    'c',
    'c#',
    'c++',
    'css', 
    'go',
    'html', 
    'java',
    'javascript', 
    'kotlin',
    'mysql',
    'php',
    'python',
    'xml'
]

const LanguagesPanel = (props: LanguagesPanelInterface) => {
    const [searchText, setSearchText] = useState('')
    const [preferredLanguages, setPreferredLanguages] = useState([
        'c++', 
        'javascript', 
        'java', 
        'python',
        'mysql', 
        'html'
    ])
    
    const [languages, setLanguages] = useState([
        'c', 
        'c#', 
        'c++', 
        'css', 
        'go',
        'html', 
        'java', 
        'javascript', 
        'kotlin',
        'mysql', 
        'php', 
        'python', 
        'xml',
        'assembly', 
        'clike', 
        'CQL', 
        'dart',
        'django', 
        'F#', 
        'flow', 
        'http', 
        'hxml', 
        'jsx', 
        'latex', 
        'livescript', 
        'matlab', 
        'perl', 
        'rust', 
        'swift', 
        'tsx', 
        'typescript', 
        'verilog', 
        'vhdl',
        'vue'
    ])

    const getFilteredLanguagesList = () => {
        let filteredLanguages = []

        if (searchText.length < 2) {
            filteredLanguages = languages.filter((val:string) => val.startsWith(searchText))
        }
        else filteredLanguages = languages.filter((val) =>  val.includes(searchText))
        return filteredLanguages
    }

    const getLanguagesList = (search: string) => {
        return (<div className='languages-list'>
            {getFilteredLanguagesList().map((val:string) => {
                const isSupported = supportedLanguages.includes(val)
                
                return (<button 
                        onClick={isSupported ? () => props.onLanguageClick(val) : () => {console.log("Language Not Supported")}} 
                        className={`listed-language ${isSupported ? '' : 'unsupported-language'}`}>
                    {val}
                    {!isSupported && <p className='unsupported-message'>Coming Soon</p>}
                </button>)
            })}
        </div>)
    }
    
    return (
        <div className='panel'>
            <div className='languages-panel'>
                <form className='form' onSubmit={() => {props.onLanguageClick(getFilteredLanguagesList()[0])}}>
                    <input className='search-bar' type='text' placeholder="Search for language ..." onChange={(e) => setSearchText(e.target.value)} />
                </form>
                {searchText === '' && <div className='search-suggestions'>
                    {preferredLanguages.map((language) => (
                        <Button text={language} button_id='preferred-language-btn' 
                        onClick={() => props.onLanguageClick(language)}/>
                    ))}
                </div>}
                {searchText === '' && <div className="search-suggestions-bottom-bar"></div>}
                {getLanguagesList(searchText)}
            </div>
            <div className='close-panel' onClick={() => props.onLanguageClick('')} ></div>
        </div>
    )
}

export default LanguagesPanel
