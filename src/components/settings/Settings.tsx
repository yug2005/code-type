import React, { useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { Slider } from './Slider'
import { CgClose } from 'react-icons/cg'
import './Settings.css'

const Settings = () => {
    const navigate = useNavigate()
    onkeydown = (e:any) => {
        if (e.keyCode === 27) {
            navigate('/')
            return false
        }
    } 

    const [settings, setSettings]:any = useContext(UserContext)

    const getSettings = async () => {
        const res = await fetch(`http://localhost:5001/users/0`)
        const user = await res.json()
        const settings = user.settings
        setSettings(settings);
    }

    useEffect(() => {
        getSettings()
    }, [])

    return (
        <div className='settings'>
            <Link className='close-settings' to='/'><CgClose /></Link>
            <div className='settings-container test-settings'>
                <h2>TEST SETTINGS</h2>
                <SettingOptions 
                    description="test difficulty"
                    value={settings?.test.difficulty}
                    setValue={(val:any) => setSettings?.({...settings, test: {...settings.test, difficulty: val}})}
                    options={['easy', 'normal', 'hard']}
                />
                <SettingOptions
                    description="number of lines shown"
                    value={settings?.test.lines}
                    setValue={(val:any) => setSettings?.({...settings, test: {...settings.test, lines: val}})}
                    options={[3, 4, 5]}
                />
                <OnOffSetting 
                    description="test fails on"
                    variable={settings?.test.fails_on.use}
                    setVariable={(val:boolean) => setSettings?.({...settings, test: {...settings.test, fails_on:
                        {...settings.test.fails_on, use: val}}})}
                />
                {settings?.test.fails_on.use && 
                <div className="test-fails-container">
                    <div className="test-fails-side-bar"></div>
                    <div className='test-fails-options'>
                        <div className="setting-padding"></div>
                        <div className="test-fails-setting">
                            <div className="setting-description">minimum accuracy</div>
                            <Slider id="min-acc" 
                                range={settings?.test.fails_on.accuracy} 
                                setRange={(val:boolean) => setSettings?.({...settings, test: {...settings.test, fails_on:
                                    {...settings.test.fails_on, accuracy: val}}})} 
                                min={80} max={100} step={4}
                            />
                        </div>
                        <div className="test-fails-setting">
                            <div className="setting-description">minimum words per minute</div>
                            <Slider id="min-words" 
                                range={settings?.test.fails_on.wpm} 
                                setRange={(val:boolean) => setSettings?.({...settings, test: {...settings.test, fails_on: 
                                    {...settings.test.fails_on, wpm: val}}})} 
                                min={30} max={120} step={10}
                            />
                        </div>
                        <div className="test-fails-setting">
                            <div className="setting-description">maximum number of incorrect chars</div>
                            <Slider id="max-chars" 
                                range={settings?.test.fails_on.chars} 
                                setRange={(val:boolean) => setSettings?.({...settings, test: {...settings.test, fails_on: 
                                    {...settings.test.fails_on, chars: val}}})}  
                                min={0} max={10} step={1}
                            />
                        </div>     
                    </div>
                </div>}
                <OnOffSetting
                    description="use characters per minute"
                    variable={settings?.test.cpm}
                    setVariable={(val:boolean) => setSettings?.({...settings, test: {...settings.test, cpm: val}})}
                />
            </div>
            <div className='settings-container status-bar-setting'>
                <h2>STATUS BAR SETTINGS</h2>
                <OnOffSetting 
                    description="show status bar"
                    variable={settings?.status_bar.show}
                    setVariable={(val:boolean) => setSettings?.({...settings, status_bar: 
                        {...settings.status_bar, show: val}})}
                />
                <OnOffSetting
                    description="hide status bar when typing"
                    variable={settings?.status_bar.hide}
                    setVariable={(val:boolean) => setSettings?.({...settings, status_bar: 
                        {...settings.status_bar, hide: val}})}
                />
                <OnOffSetting
                    description="show limit settings for tests"
                    variable={settings?.status_bar.limits}
                    setVariable={(val:boolean) => setSettings?.({...settings, status_bar: 
                        {...settings.status_bar, limits: val}})}
                />
                <OnOffSetting
                    description={`show live ${settings?.test.cpm ? 'characters' : 'words'} per minute`}
                    variable={settings?.status_bar.wpm}
                    setVariable={(val:boolean) => setSettings?.({...settings, status_bar: 
                        {...settings.status_bar, wpm: val}})}
                />
                <OnOffSetting
                    description="show live accuracy"
                    variable={settings?.status_bar.accuracy}
                    setVariable={(val:boolean) => setSettings?.({...settings, status_bar: 
                        {...settings.status_bar, accuracy: val}})}
                />
                <OnOffSetting
                    description="alwasy show time"
                    variable={settings?.status_bar.time}
                    setVariable={(val:boolean) => setSettings?.({...settings, status_bar: 
                        {...settings.status_bar, time: val}})}
                />
            </div>
            <div className="settings-container appearance-settings">
                <h2>APPEARANCE SETTINGS</h2>
                <OnOffSetting
                    description="enable focus mode"
                    variable={settings?.appearance.focus_mode}
                    setVariable={(val:boolean) => setSettings?.({...settings, appearance: 
                        {...settings.appearance, focus_mode: val}})}
                />
                <SettingOptions
                    description="theme"
                    value={settings?.appearance.theme}
                    setValue={(val:any) => setSettings?.({...settings, appearance: {...settings.appearance, theme: val}})}
                    options={['default', 'custom']}
                />
                <SettingOptions
                    description="code font"
                    value={settings?.appearance.font}
                    setValue={(val:any) => setSettings?.({...settings, appearance: {...settings.appearance, font: val}})}
                    options={['default', 'custom']}
                />
                <div className="setting slider-setting">
                    <div className="setting-description"><p>font size</p></div>
                    <Slider 
                        id="font-size"
                        range={settings?.appearance.f_size}
                        setRange={(val:number) => setSettings?.({...settings, appearance:
                            {...settings.appearance, f_size: val}})}
                        min={20} max={25} step={1}
                    />
                </div>
                <SettingOptions 
                    description="font weight"
                    value={settings?.appearance.f_weight}
                    setValue={(val:any) => setSettings?.({...settings, appearance: {...settings.appearance, f_weight: val}})}
                    options={['default', 'bold']}
                />
            </div>
            <div className="setting-padding"></div>
        </div>
    )
}

const SettingOptions = (props:{
    description: string, 
    value: any, 
    setValue: any,
    options: any
}) => {
    return (
        <div className="setting">
            <div className="setting-description"><p>{props.description}</p></div>
            {props.options.map((option:any, index:number) => (
                <SettingButton variable={props.value} setVariable={props.setValue} text={option} value={option} key={index}/>
            ))}
        </div>
    )
}

const SettingButton = (props:{
    variable:any, 
    setVariable:any, 
    text:string, 
    value:any,
}) => {
    return (
        <button 
            className={props.variable === props.value ? 'setting-selected' : 'setting-button'} 
            onClick={() => props.setVariable(props.value)}>
            {props.text}
        </button>
    )
}

const OnOffSetting = (props:{
    description: string,
    variable: any,
    setVariable: any
}) => {
    return (
        <div className="setting">
            <div className="setting-description"><p>{props.description}</p></div>
            <div className='button-container'>
                <button 
                    className={props.variable ? 'setting-selected' : 'setting-button'} 
                    onClick={() => props.setVariable(true)}>
                    on
                </button>
                <button 
                    className={!props.variable ? 'setting-selected' : 'setting-button'} 
                    onClick={() => props.setVariable(false)}>
                    off
                </button>
            </div>
        </div>
    )
}

export default Settings
