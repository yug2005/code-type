import React, { useState } from 'react'
import Button from './Button'
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
    
    return (
        <div className='panel'>
            <div className='languages-panel'>
                <form className='form' >
                    <input className='search-bar' type='text' placeholder="Search for language ..." onChange={(e) => setSearchText(e.target.value)} />
                </form>
                {searchText == '' && <div className='search-suggestions'>
                    {preferredLanguages.map((language) => (
                        <Button text={language} button_id='preferred-language-btn' onClick={() => props.onLanguageClick(language)} />
                    ))}
                </div>}
                <div className='all-languages'></div>
            </div>
        </div>
    )
}

export default LanguagesPanel
