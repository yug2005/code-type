import React, { useState, useEffect } from 'react'
import UnderBar from './UnderBar'
import './PracticeCode.css'

interface PracticeCodeInterface {
    code: string[]
}

const PracticeCode = (props: PracticeCodeInterface) => {
    // is the element active
    const [active, setActive] = useState(false)

    // practice code enabled when user clicks on container or presses certain keys
    const enable = () => {
        document.getElementById('practice-code-input')?.focus()
        console.log(props.code)
        console.log(props.code.map((line) => line.replace(/\s+/g, ' ').trim().split('')))
        setActive(true)
    }

    const callEnable = (e: any) => {
        if (e.key === 'Enter') enable()
    }

    const [limit, setLimit] = useState('time')

    const [timeLimit, setTimeLimit] = useState(30)
    const [lineLimit, setLineLimit] = useState(0)

    const setNewTimeLimit = (newTimeLimit: number) => {
        setLimit('time')
        setTimeLimit(newTimeLimit)
    }

    const setNewLineLimit = (newLineLimit: number) => {
        setLimit('line')
        setLineLimit(newLineLimit)
    }

    const [userInput, setUserInput] = useState('')
    const [lineIndex, setLineIndex] = useState(0)

    const [charCount, setCharCount] = useState(0)
    const [lineCharCount, setLineCharCount] = useState(0)

    const [correctCharCount, setCorrectCharCount] = useState(0)
    const [correctLineCharCount, setCorrectLineCharCount] = useState(0)
    const [incorrectCharCount, setincorrectCharCount] = useState(0)
    
    const [currentLine, setCurrentLine] = useState([''])
    const [previousLines, setPreviousLines] = useState([[''], ['']])

    const [time, setTime] = useState(limit === 'time' ? timeLimit : 0)
    const [userStarted, setUserStarted] = useState(false)
    const [userFinished, setUserFinished] = useState(false)

    const [showStatusBar, setShowStatusBar] = useState(true)
    
    // timer
    useEffect(() => {
        let interval: any = null
        if (userStarted) {
            interval = setInterval(() => {
                if (limit === 'time') setTime(time => time - 1)
                else setTime(time => time + 1)
            }, 1000)
        } 
        else if (limit === 'time' && time === 0) {
            console.log('clear interval called')
            clearInterval(interval)
        }
        else if (userFinished && limit !== 'time' && time !== 0) clearInterval(interval)
        return () => clearInterval(interval)
    }, [userStarted, time]) 

    const onUserInputChange = (e: any) => {
        startTimer()
        setUserInput(e.target.value)
        const line = props.code[lineIndex].replace(/\s+/g, ' ').trim()
        const input = (e.target.value).split('')
        const lastChar = e.target.value.charAt(e.target.value.length - 1)
        if (lastChar !== line[e.target.value.length - 1]) setincorrectCharCount(incorrectCharCount + 1)
        setLineCharCount(input.length) 
        setCorrectLineCharCount(input.filter((value: any, index: any) => value === line[index]).length)
    }
    
    const resetUserInput = (e: any) => {
        if (e.key === 'Enter'){
            setUserInput('')
            setLineIndex(lineIndex + 1)
            setCharCount(charCount + lineCharCount)
            setCorrectCharCount(correctCharCount + correctLineCharCount)

            console.log('previous lines before : ')
            console.log(previousLines)
            previousLines.push(currentLine)
            console.log('previous lines after pushing : ')
            console.log(previousLines)
            setCurrentLine([])
            if (previousLines.length === 3) previousLines.splice(0, 1)
            console.log('previous lines after removing : ')
            console.log(previousLines)

            if (lineIndex >= props.code.length) endTimer()
        }
    }

    const startTimer = () => {
        if (!userStarted) setUserStarted(true)
    }

    const endTimer = () => {
        setUserFinished(true)
    }

    const getPreviewCode = (): any => {
        return props.code.map((line) => line.replace(/\s+/g, ' ').trim().split('')).map((line: any, index: number) => 
        (((lineIndex < 2 && index < (showStatusBar ? 6 : 7)) || (index >= lineIndex - 2 && index <= lineIndex + (showStatusBar ? 3 : 4))) && 
            <div className='practice-code-line'>
                {/* tab at the start of the line if there is one */}
                {getTabSpace(index)}
                {/* code line to type out */}
                {getLine(line, index)}
            </div>
        ))
    }

    const getLine = (line: any, index: number) => {
        if (lineIndex - index === 2) {
            return line.map((char: any, charIndex: number) => ( 
                <span className='practice-code-text'
                    id={charIndex < userInput.length ? previousLines[0][charIndex] : ''}>
                <pre>{char}</pre></span> 
            ))
        }
        else if (lineIndex - index === 1) {
            return line.map((char: any, charIndex: number) => ( 
                <span className='practice-code-text'
                    id={charIndex < userInput.length ? previousLines[1][charIndex] : ''}>
                <pre>{char}</pre></span> 
            ))
        }
        else if (lineIndex === index) {           
            currentLine.map((val, index) => {
                currentLine.splice(index, 1)
            })
            line.map((char: string, charIndex: number) => {
                if (char === userInput[charIndex]) currentLine.push('text-correct')
                else if (char === ' ') currentLine.push('text-space-wrong')
                else currentLine.push('text-wrong')
            })
            console.log(currentLine)

            const returnLine = line.map((char: any, charIndex: number) => ( 
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
            return line.map((char: any, charIndex: number) => (
                <span className='practice-code-text'><pre>{char}</pre></span> 
            ))
        }
        // return line.map((char: any, charIndex: number) => (
        //     <span className='practice-code-text'><pre>{char}</pre></span> 
        // ))
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
            <div className='practice-code-container' onClick={enable} onKeyDown={(e) => callEnable(e)} > 
                {active ? getPreviewCode() : 
                (<div className='practice-code-click-to-start' id={!showStatusBar ? 'add-margin' : ''}>
                    <p>click or press enter to start...</p>
                </div>
                )}
            </div>

            {/* status bar under the practice code container */}
            {showStatusBar ? <UnderBar   
                wpm={(time === 0 || charCount + lineCharCount === 0) ? '' : Math.round(((charCount + lineCharCount)/4.5)/(time/60))} 
                accuracy={charCount + lineCharCount === 0 ? '' : Math.round(((charCount + lineCharCount - incorrectCharCount)/(charCount + lineCharCount)) * 100)}
                time={limit === 'time' ? timeLimit : userStarted ? time : ''} 
                limit={limit}
                limitValue={limit === 'time' ? timeLimit : lineLimit}
                onSetTimeLimit={setNewTimeLimit}
                onSetLineLimit={setNewLineLimit}
            /> : <div className='placeholder-status-bar'></div>}
            <button className='toggle-status-bar' onClick={() => (setShowStatusBar(!showStatusBar))}>{showStatusBar ? 'HIDE STATUS BAR' : 'SHOW STATUS BAR'}</button>
            {/* temporary text box */}
            <input type='text' id='practice-code-input' 
                onChange={(e) => onUserInputChange(e)} 
                onKeyPress={(e) => (resetUserInput(e))}>
            </input>
        </div>
    )
}

export default PracticeCode
