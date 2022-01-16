import React, { useState, useEffect } from 'react'
import UnderBar from './UnderBar'
import './PracticeCode.css'

interface PracticeCodeInterface {
    code: string[]
    time: number
    charCount: number
    lineCharCount: number
    incorrectCharCount: number
    showStatusBar: boolean
    numberOfLinesShown: number
    startTimer: () => void
    endTimer: () => void

}

const PracticeCode = (props: PracticeCodeInterface) => {
    // is the element active
    const [active, setActive] = useState(false)

    // practice code enabled when user clicks on container or presses certain keys
    const enable = () => {
        document.getElementById('practice-code-input')?.focus()
        setActive(true)
    }

    const callEnable = (e: any) => {
        if (e.key === 'Enter') enable()
    }

    const [userInput, setUserInput] = useState('')
    const [lineIndex, setLineIndex] = useState(0)

    const [currentLine, setCurrentLine] = useState([''])
    const [previousLines, setPreviousLines] = useState([[''], ['']])

    const onUserInputChange = (e: any) => {
        props.startTimer()
        setUserInput(e.target.value)

        const line = props.code[lineIndex].replace(/\s+/g, ' ').trim()
        const input = (e.target.value).split('')
        const lastChar = e.target.value.charAt(e.target.value.length - 1)

        // console.log('input : ' + e.target.value)
        // console.log('props.time: ' + props.time)
        // console.log('line char count: ' + input.length)
        // console.log('total characters: ' + (props.charCount + props.lineCharCount))

        props.lineCharCount = input.length
        if (lastChar !== line[e.target.value.length - 1]) props.incorrectCharCount++
        console.log(props.incorrectCharCount)

        setCurrentLine(input.map((val: string, index: number) => {
            if (val === line[index]) return 'text-correct'
            else if (line[index] === ' ') return 'text-space-wrong'
            else return 'text-wrong'
        }))
    }
    
    const onUserEnter = (e: any) => {
        if (e.key === 'Enter'){
            setUserInput('')
            setLineIndex(lineIndex + 1)
            props.charCount += props.lineCharCount
            props.lineCharCount = 0 
            previousLines.push(currentLine)
            if (previousLines.length === 3) previousLines.splice(0, 1)
            setCurrentLine([])
            if (lineIndex >= props.code.length) 
                props.endTimer()
        }
    }

    const getPreviewCode = (): any => {
        return props.code.map((line) => line.replace(/\s+/g, ' ').trim().split('')).map((line: any, index: number) => 
        ((lineIndex < 2 && index < props.numberOfLinesShown) || (index >= lineIndex - 2 && index <= (lineIndex + props.numberOfLinesShown - 3)) && 
            <div className='practice-code-line'>
                {getTabSpace(index)}
                {getLine(line, index)}
            </div>
        ))
    }

    const getLine = (line: any, index: number) => {
        if (index < lineIndex) {
            return line.map((char: string, charIndex: number) => ( 
                <span className='practice-code-text'
                    id={previousLines[2 - lineIndex + index][charIndex]}>
                <pre>{char}</pre></span> 
            ))
        }
        else if (lineIndex === index) {           
            const returnLine = line.map((char: string, charIndex: number) => ( 
                <span className='practice-code-text'
                    id={charIndex < userInput.length ? currentLine[charIndex] : ''}>
                <pre>{char}</pre></span> 
            ))
            // index cursor 
            returnLine.splice(userInput.length, 0, <div>
                <span className={lineIndex === 0 && userInput.length === 0 ? 'cursor-blinking' : 'practice-code-cursor'}>
                    <pre> </pre>
                </span>
            </div>)
            return returnLine
        }
        else {
            return line.map((char: string) => (
                <span className='practice-code-text'><pre>{char}</pre></span> 
            ))
        }
    }

    const getTabSpace = (index: number) => {
        // console.log('get Tab space is called')
        return props.code[index].split('    ').splice(1).map(() => (
            <pre className='practice-code-text tab-space'>   </pre>
        ))
    }

    return (
        <div className='practice-code'>
            {/* main practice code container */}
            <div className='practice-code-container' onClick={enable} > 
                {active ? getPreviewCode() : 
                (<div className='practice-code-click-to-start' id={!props.showStatusBar ? 'add-margin' : ''}>
                    <p>click or press enter to start...</p>
                </div>
                )}
            </div>
            <input type='text' id='practice-code-input' 
                value={userInput} 
                onChange={(e) => onUserInputChange(e)} 
                onKeyPress={(e) => (onUserEnter(e))}>
            </input>
        </div>
    )
}

export default PracticeCode
