import React, { useState, useEffect } from 'react'
import PracticeCode from './PracticeCode'
import UnderBar from './UnderBar'
import FinishedTest from './FinishedTest'
import './Main.css'
import { ScriptElementKindModifier } from 'typescript'

interface PropsInteface {
    code: string[]
    getCode: () => any

}

const Main = (props: PropsInteface) => {
    
    const [showStatusBar, setShowStatusBar] = useState(true)

    const [limit, setLimit] = useState({
        type: 'time', 
        timeLimit: 30, 
        lineLimit: 15
    })

    const setNewTimeLimit = (newTimeLimit: number) => {
        setLimit({...limit, type: 'time'})
        setLimit({...limit, timeLimit: newTimeLimit})
    }

    const setNewLineLimit = (newLineLimit: number) => {
        setLimit({...limit, type: 'line'})
        setLimit({...limit, lineLimit: newLineLimit})
    }
    
    const [timer, setTimer] = useState({
        time: 0, 
        started: false, 
        finished: false 
    })

    // timer 
    useEffect(() => {
        let interval: any = null
        if (timer.started) {
            interval = setInterval(() => {
                setTimer({...timer, time: timer.time + 1})
            }, 1000)
        } 
        if (limit.type === 'time' && limit.timeLimit - timer.time === 0) {
            setTimer({...timer, finished: true})
            clearInterval(interval)
        }
        if (timer.finished && limit.type !== 'time' && timer.time !== 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [timer]) 
    
    const startTimer = () => {
        if (!timer.started) setTimer({...timer, started: true})
    }

    const endTimer = () => {
        setTimer({...timer, finished: true})
    }

    const [test, setTest] = useState({
        chars: 0, 
        lineChars: 0,
        incorrectChars: 0, 
    })

    // const [testStats, setTestStats] = useState({
    //     wpm: Math.round(((test.chars + test.lineChars)/4.5)/(timer.time/60)),
    //     accuracy: Math.round(((test.chars + test.lineChars - test.incorrectChars)/(test.chars + test.lineChars)) * 100)
    // })

    const [wpm, setWpm] = useState([])
    const [errors, setErrors] = useState([])
    
    return (
        (!timer.finished ? 
            <div className='main-container'>
                <PracticeCode code={['void print() {', '    std::cout << "Hello World" << \n', '}']} 
                    test={test} 
                    setTest={setTest} 
                    startTimer={startTimer} 
                    endTimer={endTimer} 
                    showStatusBar={showStatusBar}
                />
                {showStatusBar ? <UnderBar   
                    wpm={(timer.time === 0 || test.chars + test.lineChars === 0) ? '' : Math.round(((test.chars + test.lineChars)/4.5)/(timer.time/60))} 
                    accuracy={test.chars + test.lineChars === 0 ? '' : Math.round(((test.chars + test.lineChars - test.incorrectChars)/(test.chars + test.lineChars)) * 100)}
                    time={limit.type === 'time' ? limit.timeLimit - timer.time : timer.started ? timer.time : ''} 
                    limit={limit.type}
                    limitValue={limit.type === 'time' ? limit.timeLimit : limit.lineLimit}
                    onSetTimeLimit={setNewTimeLimit}
                    onSetLineLimit={setNewLineLimit}
                /> : <div className='placeholder-status-bar'></div>}
                {/* show status bar button */}
                <button className='toggle-status-bar' onClick={() => (setShowStatusBar(!showStatusBar))}>{showStatusBar ? 'HIDE STATUS BAR' : 'SHOW STATUS BAR'}</button>
            </div>
            :
            <FinishedTest timeLimit={limit.timeLimit}/>
        )
    )
}

export default Main