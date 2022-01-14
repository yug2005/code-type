import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CgClose } from 'react-icons/cg'
import './Settings.css'

const Settings = () => {
    // test settings
    const [testDifficulty, setTestDifficulty] = useState('normal')
    const [numOfLines, setNumOfLines] = useState(6)

    // status bar settings
    const [showStatusBar, setShowStatusBar] = useState(true)
    const [hideStatusBar, setHideStatusBar] = useState(false)
    const [showWpm, setShowWpm] = useState(true)
    const [showAccuracy, setShowAccuracy] = useState(true)
    const [showTimeAlways, setShowTimeAlways] = useState(true)    
    const [showLimitSettings, setShowLimitSettings] = useState(true)    

    // appearance settings
    const [theme, setTheme] = useState('default')
    const [font, setFont] = useState('default')
    const [focusMode, setFocusMode] = useState(false)

    return (
        <div className='settings'>
            <Link className='close-settings' to='/'><CgClose /></Link>
            {/* test settings */}
            <div className='settings-container test-settings'>
                <h2>TEST SETTINGS</h2>
                <div className='setting'>
                    <label>test difficulty</label>
                    <button className={testDifficulty === 'easy' ? 'setting-selected' : 'setting-button'} onClick={() => setTestDifficulty('easy')}>easy</button>
                    <button className={testDifficulty === 'normal' ? 'setting-selected' : 'setting-button'} onClick={() => setTestDifficulty('normal')}>normal</button>
                    <button className={testDifficulty === 'hard' ? 'setting-selected' : 'setting-button'} onClick={() => setTestDifficulty('hard')}>hard</button>
                </div>
                <div className='setting'>
                    <label>number of lines shown at one time</label>
                    <button className={numOfLines === 3 ? 'setting-selected' : 'setting-button'} onClick={() => setNumOfLines(3)}>3 lines</button>
                    <button className={numOfLines === 4 ? 'setting-selected' : 'setting-button'} onClick={() => setNumOfLines(4)}>4 lines</button>
                    <button className={numOfLines === 5 ? 'setting-selected' : 'setting-button'} onClick={() => setNumOfLines(5)}>5 lines</button>
                    <button className={numOfLines === 6 ? 'setting-selected' : 'setting-button'} onClick={() => setNumOfLines(6)}>6 lines</button>
                </div>
                <div className='setting'>
                    <label>test fails on</label>
                    <button className='setting-button'>accuracy</button>
                    <button className='setting-button'>minimum wpm</button>
                    <button className='setting-button'>number of chars incorrect</button>
                    <button className='setting-button'>number of words incorrect</button>
                </div>
            </div>
            {/* status bar settings */}
            <div className='settings-container status-bar-setting'>
                <h2>STATUS BAR SETTINGS</h2>
                <div className="setting">
                    <label>always show the status bar</label>
                    <button className={showStatusBar ? 'setting-selected' : 'setting-button'} onClick={() => setShowStatusBar(true)}>true</button>
                    <button className={!showStatusBar ? 'setting-selected' : 'setting-button'} onClick={() => setShowStatusBar(false)}>false</button>
                </div>
                <div className="setting">
                    <label>hide the status bar when typing</label>
                    <button className={hideStatusBar ? 'setting-selected' : 'setting-button'} onClick={() => setHideStatusBar(true)}>true</button>
                    <button className={!hideStatusBar ? 'setting-selected' : 'setting-button'} onClick={() => setHideStatusBar(false)}>false</button>
                </div>
                <div className="setting">
                    <label>show wpm in status bar</label>
                    <button className={showWpm ? 'setting-selected' : 'setting-button'} onClick={() => setShowWpm(true)}>true</button>
                    <button className={!showWpm ? 'setting-selected' : 'setting-button'} onClick={() => setShowWpm(false)}>false</button>
                </div>
                <div className="setting">
                    <label>show accuracy in status bar</label>
                    <button className={showAccuracy ? 'setting-selected' : 'setting-button'} onClick={() => setShowAccuracy(true)}>true</button>
                    <button className={!showAccuracy ? 'setting-selected' : 'setting-button'} onClick={() => setShowAccuracy(false)}>false</button>
                </div>
                <div className="setting">
                    <label>always show time (time will show outside the status bar when disabled)</label>
                    <button className={showTimeAlways ? 'setting-selected' : 'setting-button'} onClick={() => setShowTimeAlways(true)}>true</button>
                    <button className={!showTimeAlways ? 'setting-selected' : 'setting-button'} onClick={() => setShowTimeAlways(false)}>false</button>
                </div>
                <div className="setting">
                    <label>show limit settings for tests in status bar</label>
                    <button className={showLimitSettings ? 'setting-selected' : 'setting-button'} onClick={() => setShowLimitSettings(true)}>true</button>
                    <button className={!showLimitSettings ? 'setting-selected' : 'setting-button'} onClick={() => setShowLimitSettings(false)}>false</button>
                </div>
            </div>
            {/* appearance settings */}
            <div className="settings-container appearance-settings">
                <h2>APPEARANCE SETTINGS</h2>
                <div className="setting">
                    <label>website theme</label>
                    <button className={theme === 'default' ? 'setting-selected' : 'setting-button'} onClick={() => setTheme('default')}>default</button>
                    <button className={theme === 'custom' ? 'setting-selected' : 'setting-button'} onClick={() => setTheme('custom')}>custom</button>
                </div>
                <div className="setting">
                    <label>test font</label>
                    <button className={font === 'default' ? 'setting-selected' : 'setting-button'} onClick={() => setFont('default')}>consolas</button> 
                    <button className={font === 'custom' ? 'setting-selected' : 'setting-button'} onClick={() => setFont('custom')}>custom</button>
                </div>
                <div className="setting">
                    <label>enable focus mode</label>
                    <button className={focusMode ? 'setting-selected' : 'setting-button'} onClick={() => setFocusMode(true)}>true</button>
                    <button className={!focusMode ? 'setting-selected' : 'setting-button'} onClick={() => setFocusMode(false)}>false</button>
                </div>
            </div>
        </div>
    )
}

export default Settings
