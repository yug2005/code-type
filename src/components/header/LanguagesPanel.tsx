import React, { useState } from 'react'
import { isPropertyAccessExpression } from 'typescript';
import Button from '../Button'
import './LanguagesPanel.css'; 

interface LanguagesPanelInterface {
    onLanguageClick(language: string): void; 
}

const LanguagesPanel = (props: LanguagesPanelInterface) => {
    const [searchText, setSearchText] = useState('')
    const [preferredLanguages, setPreferredLanguages] = useState([
        'c++', 
        'javascript', 
        'typescript', 
        'python',
        'c', 
        'html'
    ])

    const [languages, setLanguages] = useState([
        'assembly', 
        'c', 
        'c#', 
        'c++', 
        'clike', 
        'CQL', 
        'css', 
        'dart',
        'django', 
        'F#', 
        'flow', 
        'html', 
        'http', 
        'hxml', 
        'java', 
        'javascript', 
        'json', 
        'jsx', 
        'latex', 
        'livescript', 
        'matlab', 
        'mysql', 
        'perl', 
        'php', 
        'python', 
        'rust', 
        'swift', 
        'tsx', 
        'typescript', 
        'verilog', 
        'vhdl',
        'vue',
        'xml'
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
                return <button onClick={() => props.onLanguageClick(val)} className='listed-language'>{val}</button>
            })}
        </div>)
    }
    
    return (
        <div className='panel'>
            <div className='languages-panel'>
                <form className='form' onSubmit={() => {props.onLanguageClick(getFilteredLanguagesList()[0])}}>
                    <input className='search-bar' type='text' placeholder="Search for language ..." onChange={(e) => setSearchText(e.target.value)} />
                </form>
                {searchText == '' && <div className='search-suggestions'>
                    {preferredLanguages.map((language) => (
                        <Button text={language} button_id='preferred-language-btn' onClick={() => props.onLanguageClick(language)} />
                    ))}
                </div>}
                <div className='languages-list-before'></div>
                {getLanguagesList(searchText)}
            </div>
            <div className='close-panel' onClick={() => props.onLanguageClick('')} ></div>
        </div>
    )
}

export default LanguagesPanel
