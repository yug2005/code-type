import React, { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import './UnderBar.css';

interface BarInterface {
    wpm: number | string
    accuracy: number | string
    time: number | string
    limit: string
    limitValue: number
    onSetTimeLimit: (newTimeLimit: number) => void
    onSetLineLimit: (newLineLimit: number) => void
}

const UnderBar = (props: BarInterface) => {

    const [autocomplete, setAutocomplete] = useState(false)
    const [snippets, setSnippets] = useState(false)
    
    return (
        <div className='under-bar-container'>
            <div className='under-bar-item' id='wpm'>
                <label className='under-bar-label'>wpm</label>
                <p className='under-bar-value'>{props.wpm}</p>
            </div>
            <div className='under-bar-item' id='accuracy'>
                <label className='under-bar-label'>accuracy</label>
                {props.accuracy !== '' && <p className='under-bar-value'>{props.accuracy}%</p>}
            </div>
            <div className='under-bar-item' id='time'>
                <label className='under-bar-label'>time</label>
                {props.time !== '' && <p className='under-bar-value'>{props.time}s</p>}
            </div>

            <div className='under-bar-setting'>
                <label className={`under-bar-label ${props.limit === 'time' ? 'selected-setting' : ''}`}>timed</label>
                <div className='under-bar-drop-down'>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(30)}>
                        {props.limit === 'time' && props.limitValue === 30 && <FiCheck className='drop-down-check'/>}
                        <p>30 sec</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(45)}>
                        {props.limit === 'time' && props.limitValue === 45 && <FiCheck className='drop-down-check'/>}
                        <p>45 sec</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(60)}>
                        {props.limit === 'time' && props.limitValue === 60 && <FiCheck className='drop-down-check'/>}
                        <p>60 sec</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(90)}>
                        {props.limit === 'time' && props.limitValue === 90 && <FiCheck className='drop-down-check'/>}
                        <p>90 sec</p>
                    </button>
                    
                </div>
            </div>
            <div className='under-bar-setting'>
                <label className={`under-bar-label ${props.limit === 'line' ? 'selected-setting' : ''}`}>lines</label>
                <div className="under-bar-drop-down">
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(5)}>
                        {props.limit === 'line' && props.limitValue === 5 && <FiCheck className='drop-down-check'/>}
                        <p>5 lines</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(10)}>
                        {props.limit === 'line' && props.limitValue === 10 && <FiCheck className='drop-down-check'/>}
                        <p>10 lines</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(15)}>
                        {props.limit === 'line' && props.limitValue === 15 && <FiCheck className='drop-down-check'/>}
                        <p>15 lines</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(20)}>
                        {props.limit === 'line' && props.limitValue === 20 && <FiCheck className='drop-down-check'/>}
                        <p>20 lines</p>
                    </button>
                </div>
            </div>
            <div className='under-bar-setting'>
                <label className='under-bar-label'>custom</label>
                <div className="under-bar-drop-down" id='custom-drop-down'>
                    <button className="drop-down-button">full file</button>
                    <button className="drop-down-button">upload</button>
                </div>
            </div>
        </div>
    )
}

UnderBar.defaultProps = {
    wpm: '',
    time: 30, 
    accuracy: 100, 
}

export default UnderBar
