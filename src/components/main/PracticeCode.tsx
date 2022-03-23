import React, { useState, useEffect } from 'react'
import './PracticeCode.css'

import { FiChevronRight } from 'react-icons/fi'
import { FiChevronLeft } from 'react-icons/fi'

interface PropsInterface {
    code: string[]
    test: any
    setTest: any
    resetTest: any
    startTimer: () => void
    endTimer: () => void
    showStatusBar: boolean 
    userInput: any
    setUserInput: any
    lineIndex: any
    setLineIndex: any 
    currentLine: any 
    setCurrentLine: any 
    previousLines: any
    usingCustom: any
}

const PracticeCode = (props: PropsInterface) => {
    // whether the test is active
    const [active, setActive] = useState(false)
    
    const enable = () => {
        document.getElementById('practice-code-input')?.focus()
        setActive(true)
    }
    
    useEffect(() => {
        // setActive(document.activeElement === document.getElementById('practice-code-input'))
        enable()
    })

    // when the user types on keyboard
    const onUserInputChange = (e: any) => {
        props.startTimer()
        props.setUserInput(e.target.value)

        const line = props.code[props.lineIndex].replace(/\s+/g, ' ').trim()
        const input = (e.target.value).split('')
        const lastChar = e.target.value.charAt(e.target.value.length - 1)

        props.setTest({...props.test, lineChars: input.length, incorrectChars: 
        (lastChar !== line[e.target.value.length - 1]) ? props.test.incorrectChars + 1 : props.test.incorrectChars})

        props.setCurrentLine(input.map((val: string, index: number) => (
            val === line[index] ? 'text-correct' : line[index] === ' ' ? 'text-space-wrong' : 'text-wrong'
        )))     
    }
    
    // when the user presses enter on the keyboard
    const onUserEnter = (e: any) => {
        if (e.key === 'Enter'){
            props.setUserInput('')
            props.setLineIndex(props.lineIndex + 1)
            props.setTest({...props.test, chars: (props.test.chars + props.test.lineChars), lineChars: 0})
            props.previousLines.push(props.currentLine)
            if (props.previousLines.length === 3) props.previousLines.splice(0, 1)
            props.setCurrentLine([])
            if (props.lineIndex >= props.code.length - 1) props.endTimer()
        }
    }

    // get the line such that they are formatted correctly
    const getLine = (line: any, index: number) => {
        // the lines that the user has already typed out
        if (index < props.lineIndex) {
            return line.map((char: string, charIndex: number) => ( 
                <span className='practice-code-text practice-code-line-blur'
                id={props.previousLines[2 - props.lineIndex + index][charIndex]}>
                <pre>{char}</pre></span> 
            ))
        }
        // for the line that the user is currently typing
        else if (props.lineIndex === index) {           
            const returnLine = line.map((char: string, charIndex: number) => ( 
                <span className='practice-code-text'
                id={charIndex < props.userInput.length ? props.currentLine[charIndex] : ''}>
                <pre>{char}</pre></span> 
            ))
            // index cursor 
            returnLine.splice(props.userInput.length, 0, 
            <div>
                <span className={props.lineIndex === 0 && props.userInput.length === 0 ? 'cursor-blinking' : 'practice-code-cursor'}>
                    <pre> </pre>
                </span>
            </div>)
            return returnLine
        }
        // if the line is below where the user is currently
        else {
            return line.map((char: string) => (
                <span className='practice-code-text practice-code-line-blur'><pre>{char}</pre></span> 
            ))
        }
    }
        
    // get tab space for lines of code that have space at the start
    const getTabSpace = (index: number) => {
        return props.code[index].split('  ').splice(1).map(() => (
            <pre className='practice-code-text tab-space'> </pre>
        ))
    }
            
    // get the preview code that is going to be displayed
    const getPreviewCode = (): any => {
        return props.code.map((line) => line.replace(/\s+/g, ' ').trim().split('')).map((line: any, index: number) =>
            ((props.lineIndex < 1 && index < 4) || (index >= props.lineIndex - 1 && index <= props.lineIndex + 2)) && 
                <div className={`practice-code-line`} style={{opacity: 1 - 0.12 * Math.abs(index - props.lineIndex)}}>
                    {getTabSpace(index)}
                    {getLine(line, index)}
                </div>
            )
    }
        
    return (
        <div>
            {/* main practice code container */}
            <div className={`practice-code-container ${!props.showStatusBar ? 'practice-code-no-status-bar' : ''}`}
            onClick={enable} > 
                {active ? getPreviewCode() : 
                (<div className='practice-code-click-to-start' id={!props.showStatusBar ? 'add-margin' : ''}>
                    <p>click or press enter to start...</p>
                </div>
                )}
                {!props.usingCustom && <div className='practice-code-next-prev-buttons'>
                    <div className={`practice-code-button`} 
                         onClick={() => props.resetTest("prev")}>
                        <FiChevronLeft className="practice-code-left-arrow"/>
                    </div>
                    <div className="practice-code-button" onClick={() => props.resetTest("next")}>
                        <FiChevronRight className="practice-code-right-arrow"/>
                    </div>
                </div>}
            </div>
            {/* temporary input box (not displayed) */}
            <input type='text' id='practice-code-input' 
                value={props.userInput} 
                onChange={(e) => onUserInputChange(e)} 
                onKeyPress={(e) => (onUserEnter(e))}>
            </input>
        </div>
    )
}

export default PracticeCode
