import React, { useState, useEffect } from 'react'
import './PracticeCode.css'

interface PropsInterface {
    code: string[]
    test: any
    setTest: any
    startTimer: () => void
    endTimer: () => void
    showStatusBar: boolean 
}

const PracticeCode = (props: PropsInterface) => {
    // whether the test is active
    const [active, setActive] = useState(false)
    
    const enable = () => {
        document.getElementById('practice-code-input')?.focus()
        setActive(true)
    }
    
    useEffect(() => {
        enable()
    })

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

        props.setTest({...props.test, lineChars: input.length, incorrectChars: 
        (lastChar !== line[e.target.value.length - 1]) ? props.test.incorrectChars + 1 : props.test.incorrectChars})

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
            props.setTest({...props.test, chars: (props.test.chars + props.test.lineChars), lineChars: 0})
            previousLines.push(currentLine)
            if (previousLines.length === 3) previousLines.splice(0, 1)
            setCurrentLine([])
            if (lineIndex >= props.code.length - 1) props.endTimer()
        }
    }

    const getLine = (line: any, index: number) => {
        if (index < lineIndex) {
            return line.map((char: string, charIndex: number) => ( 
                <span className='practice-code-text practice-code-line-blur'
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
            returnLine.splice(userInput.length, 0, 
            <div>
                <span className={lineIndex === 0 && userInput.length === 0 ? 'cursor-blinking' : 'practice-code-cursor'}>
                    <pre> </pre>
                </span>
            </div>)
            return returnLine
        }
        else {
            return line.map((char: string) => (
                <span className='practice-code-text practice-code-line-blur'><pre>{char}</pre></span> 
                ))
            }
        }
        
    const getTabSpace = (index: number) => {
        return props.code[index].split('  ').splice(1).map(() => (
            <pre className='practice-code-text tab-space'> </pre>
        ))
    }
            
    const getPreviewCode = (): any => {
        return props.code.map((line) => line.replace(/\s+/g, ' ').trim().split('')).map((line: any, index: number) =>
            ((lineIndex < 1 && index < 4) || (index >= lineIndex - 1 && index <= lineIndex + 2)) && 
                <div className={`practice-code-line`} style={{opacity: 1 - 0.12 * Math.abs(index - lineIndex)}}>
                    {getTabSpace(index)}
                    {getLine(line, index)}
                </div>
            )
    }
        
    return (
        <>
            {/* main practice code container */}
            <div className='practice-code-container' onClick={enable} > 
                {active ? getPreviewCode() : 
                (<div className='practice-code-click-to-start' id={!props.showStatusBar ? 'add-margin' : ''}>
                    <p>click or press enter to start...</p>
                </div>
                )}
            </div>
            {/* temporary input box (not displayed) */}
            <input type='text' id='practice-code-input' 
                value={userInput} 
                onChange={(e) => onUserInputChange(e)} 
                onKeyPress={(e) => (onUserEnter(e))}>
            </input>
        </>
    )
}

export default PracticeCode
