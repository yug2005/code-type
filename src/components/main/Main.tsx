import React, { useState, useEffect } from 'react'
import PracticeCode from './PracticeCode'
import UnderBar from './UnderBar'
import FinishedTest from './FinishedTest'

interface PropsInteface {
    getCode: () => any
}

const Main = (props: PropsInteface) => {
    
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
    
    const [time, setTime] = useState(0)
    const [userStarted, setUserStarted] = useState(false)
    const [userFinished, setUserFinished] = useState(false)

    const [showStatusBar, setShowStatusBar] = useState(true)
    
    // timer 
    useEffect(() => {
        let interval: any = null
        if (userStarted) {
            interval = setInterval(() => {
                setTime(time => time + 1)
            }, 1000)
        } 
        if (limit === 'time' && timeLimit - time === 0) {
            setUserFinished(true)
            clearInterval(interval)
        }
        if (userFinished && limit !== 'time' && time !== 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [userStarted, time]) 
    
    const startTimer = () => {
        if (!userStarted) setUserStarted(true)
    }

    const endTimer = () => {
        setUserFinished(true)
    }
    
    const [charCount, setCharCount] = useState(0)
    const [lineCharCount, setLineCharCount] = useState(0)
    const [incorrectCharCount, setincorrectCharCount] = useState(0)
    
    return (
        <div className='main-container'>
            {!userFinished ? 
                <div>
                    <PracticeCode code={['']} time={time}  charCount={charCount} lineCharCount={lineCharCount} incorrectCharCount={incorrectCharCount} showStatusBar={showStatusBar} numberOfLinesShown={6} startTimer={startTimer} endTimer={endTimer} />
                    {showStatusBar ? <UnderBar   
                        wpm={(time === 0 || charCount + lineCharCount === 0) ? '' : Math.round(((charCount + lineCharCount)/4.5)/(time/60))} 
                        accuracy={charCount + lineCharCount === 0 ? '' : Math.round(((charCount + lineCharCount - incorrectCharCount)/(charCount + lineCharCount)) * 100)}
                        time={limit === 'time' ? timeLimit - time : userStarted ? time : ''} 
                        limit={limit}
                        limitValue={limit === 'time' ? timeLimit : lineLimit}
                        onSetTimeLimit={setNewTimeLimit}
                        onSetLineLimit={setNewLineLimit}
                    /> : <div className='placeholder-status-bar'></div>}
                    {/* show status bar button */}
                    <button className='toggle-status-bar' onClick={() => (setShowStatusBar(!showStatusBar))}>{showStatusBar ? 'HIDE STATUS BAR' : 'SHOW STATUS BAR'}</button>
                </div>
                :
                <FinishedTest timeLimit={timeLimit}/>
            }
        </div>
    )
}

export default Main