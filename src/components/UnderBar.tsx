import { useState } from 'react'
import './UnderBar.css';

interface BarInterface {
    wpm: number | string
    accuracy: number | string
    time: number
}

const UnderBar = (props: BarInterface) => {

    const [autocomplete, setAutocomplete] = useState(false); 
    const [snippets, setSnippets] = useState(false); 
    
    return (
        <div className='under-bar-container'>
            <div className='under-bar-item'>
                <label className='under-bar-label'>wpm</label>
                <p className='under-bar-value'>{props.wpm}</p>
            </div>
            <div className='under-bar-item'>
                <label className='under-bar-label'>accuracy</label>
                {props.accuracy !== '' && <p className='under-bar-value'>{props.accuracy}%</p>}
            </div>
            <div className='under-bar-item'>
                <label className='under-bar-label'>time</label>
                <p className='under-bar-value'>{props.time}s</p>
            </div>
            <div className='under-bar-item'>
                <label className='under-bar-label'>auto complete</label>
                <input className='under-bar-check' type='checkbox' checked={autocomplete} onChange={(e) => setAutocomplete(e.currentTarget.checked)} />
            </div>
            <div className='under-bar-item'>
                <label className='under-bar-label'>snippets</label>
                <input className='under-bar-check' type='checkbox' checked={snippets} onChange={(e) => setSnippets(e.currentTarget.checked)} />
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
