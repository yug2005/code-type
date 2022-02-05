import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CgClose } from 'react-icons/cg'
import './Settings.css'

const Settings = () => {
    // test settings
    const [testDifficulty, setTestDifficulty] = useState('normal')
    const [numOfLines, setNumOfLines] = useState(4)

    // test fails on setting
    const [testFails, setTestFails] = useState(false)
    const [minAccuracy, setMinAccuracy] = useState(95)
    const [minWpm, setMinWpm] = useState(null)
    const [maxIncorrectChars, setMaxIncorrectChars] = useState(null)
    const [maxIncorrectWords, setMaxIncorrectWords] = useState(null)

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
                    <div className='setting-description'><p>test difficulty</p></div>
                    <SettingButton variable={testDifficulty} setVariable={setTestDifficulty} text='easy' value='easy' deselectable={false} />
                    <SettingButton variable={testDifficulty} setVariable={setTestDifficulty} text='normal' value='normal' deselectable={false} />
                    <SettingButton variable={testDifficulty} setVariable={setTestDifficulty} text='hard' value='hard' deselectable={false} />
                </div>
                <div className='setting'>
                    <div className='setting-description'><p>number of lines shown at one time</p></div>
                    <SettingButton variable={numOfLines} setVariable={setNumOfLines} text='3 lines' value={3} deselectable={false} />
                    <SettingButton variable={numOfLines} setVariable={setNumOfLines} text='4 lines' value={4} deselectable={false} />
                    <SettingButton variable={numOfLines} setVariable={setNumOfLines} text='5 lines' value={5} deselectable={false} />
                </div>
                <div className='setting test-fails'>
                    <div className='setting-description'><p>test fails on</p></div>
                    <OnOffButton variable={testFails} setVariable={setTestFails} />
                </div>
            </div>
            {testFails && <div className='test-fails-options'>
                <div className="test-fails-setting">
                    <div className="setting-description">minimum accuracy</div>
                    <SettingButton variable={minAccuracy} setVariable={setMinAccuracy} text='90%' value={90} deselectable={true} />
                    <SettingButton variable={minAccuracy} setVariable={setMinAccuracy} text='95%' value={95} deselectable={true} />
                    <SettingButton variable={minAccuracy} setVariable={setMinAccuracy} text='100%' value={100} deselectable={true} />
                </div>
                <div className="test-fails-setting">
                    <div className="setting-description">minimum words per minute</div>
                    <SettingButton variable={minWpm} setVariable={setMinWpm} text='40' value={40} deselectable={true} />
                    <SettingButton variable={minWpm} setVariable={setMinWpm} text='60' value={60} deselectable={true} />
                    <SettingButton variable={minWpm} setVariable={setMinWpm} text='80' value={80} deselectable={true} />
                </div>
                <div className="test-fails-setting">
                    <div className="setting-description">maximum number of incorrect chars</div>
                    <SettingButton variable={maxIncorrectChars} setVariable={setMaxIncorrectChars} text='2' value={2} deselectable={true} />
                    <SettingButton variable={maxIncorrectChars} setVariable={setMaxIncorrectChars} text='3' value={3} deselectable={true} />
                    <SettingButton variable={maxIncorrectChars} setVariable={setMaxIncorrectChars} text='4' value={4} deselectable={true} />
                    <SettingButton variable={maxIncorrectChars} setVariable={setMaxIncorrectChars} text='5' value={5} deselectable={true} />
                </div>
                <div className="test-fails-setting">
                    <div className="setting-description">maximum number of incorrect words</div>
                    <SettingButton variable={maxIncorrectWords} setVariable={setMaxIncorrectWords} text='1' value={1} deselectable={true} />
                    <SettingButton variable={maxIncorrectWords} setVariable={setMaxIncorrectWords} text='2' value={2} deselectable={true} />
                    <SettingButton variable={maxIncorrectWords} setVariable={setMaxIncorrectWords} text='3' value={3} deselectable={true} />
                </div>             
            </div>}
            {/* status bar settings */}
            <div className='settings-container status-bar-setting'>
                <h2>STATUS BAR SETTINGS</h2>
                <div className="setting">
                    <div className='setting-description'><p>always show the status bar</p></div>
                    <OnOffButton variable={showStatusBar} setVariable={setShowStatusBar} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>hide the status bar when typing</p></div>
                    <OnOffButton variable={hideStatusBar} setVariable={setHideStatusBar} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>show wpm in status bar</p></div>
                    <OnOffButton variable={showWpm} setVariable={setShowWpm} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>show accuracy in status bar</p></div>
                    <OnOffButton variable={showAccuracy} setVariable={setShowAccuracy} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>always show time (time will show outside the status bar when disabled)</p></div>
                    <OnOffButton variable={showTimeAlways} setVariable={setShowTimeAlways} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>show limit settings for tests in status bar</p></div>
                    <OnOffButton variable={showLimitSettings} setVariable={setShowLimitSettings} />
                </div>
            </div>
            {/* appearance settings */}
            <div className="settings-container appearance-settings">
                <h2>APPEARANCE SETTINGS</h2>
                <div className="setting">
                    <div className='setting-description'><p>website theme</p></div>
                    <SettingButton variable={theme} setVariable={setTheme} text='default' value='default' deselectable={false} />
                    <SettingButton variable={theme} setVariable={setTheme} text='custom' value='custom' deselectable={false} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>test font</p></div>
                    <SettingButton variable={font} setVariable={setFont} text='consolas' value='default' deselectable={false} />
                    <SettingButton variable={font} setVariable={setFont} text='custom' value='custom' deselectable={false} />
                </div>
                <div className="setting">
                    <div className='setting-description'><p>enable focus mode</p></div>
                    <OnOffButton variable={focusMode} setVariable={setFocusMode} />
                </div>
            </div>
        </div>
    )
}

interface SettingButtonInterface {
    variable:any, 
    setVariable:any, 
    text:string, 
    value:any
    deselectable: boolean
}

const SettingButton = (props:SettingButtonInterface) => {
    return (
        <button className={props.variable === props.value ? 'setting-selected' : 'setting-button'} onClick={() => {
            if (props.deselectable && props.variable === props.value) props.setVariable(null) 
            else props.setVariable(props.value)
        }} >{props.text}</button>
    )
}

interface OnOffInterface {
    variable: any
    setVariable: any
}

const OnOffButton = (props:OnOffInterface) => {
    return (
        <div className='button-container'>
            <button className={props.variable ? 'setting-selected' : 'setting-button'} onClick={() => props.setVariable(true)}>on</button>
            <button className={!props.variable ? 'setting-selected' : 'setting-button'} onClick={() => props.setVariable(false)}>off</button>
        </div>
    )
}

export default Settings
