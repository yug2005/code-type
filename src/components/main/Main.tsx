import React, { useState, useEffect } from 'react'
import PracticeCode from './PracticeCode'
import UnderBar from './UnderBar'
import FinishedTest from './FinishedTest'
import './Main.css'

interface PropsInteface {
    language: string
}

const Main = (props: PropsInteface) => {
    
    const [code, setCode] = useState([""]);

    const getCode = async (language: string) => {
        const len_res = await fetch(
            `http://localhost:3001/${language}`
        );
        const len_data = await len_res.json();
        const length: number = len_data[0].count;
        const id: number = Math.floor(Math.random() * length + 1);
        const code_res = await fetch(
            `http://localhost:3001/${language}/${id}`
        );
        const code_data = await code_res.json();
        const code: string[] = code_data[0].body.split("\n");
        setCode(code);
    }

    useEffect(() => {
        getCode('cpp')
    }, [])
    
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
    
    const [wpm, setWpm]:any = useState([])
    const [errors, setErrors]:any = useState([])
    const [tempIncorrectChars, setTempIncorrectChars] = useState(0)

    // timer 
    useEffect(() => {
        let interval: any = null
        if (timer.finished) {
            clearInterval(interval)
        } 
        else {        
            if (timer.started) {
                interval = setInterval(() => {
                    setTempIncorrectChars(test.incorrectChars)
                    setTimer({...timer, time: timer.time + 1})
                    if (timer.time > 0) wpm.push([Math.round(((test.chars + test.lineChars)/4.5)/(timer.time/60)), timer.time])
                    if (test.incorrectChars > tempIncorrectChars) errors.push([test.incorrectChars - tempIncorrectChars, timer.time])
                }, 1000)
            } 
            if (limit.type === 'time' && limit.timeLimit - timer.time === 0) {
                endTimer()
                clearInterval(interval)
            }
        }
        return () => clearInterval(interval)
    }, [timer]) 
    
    const startTimer = () => {
        if (!timer.started) setTimer({...timer, started: true})
    }

    const endTimer = () => {
        setTimer({...timer, finished: true})
        getTestDetails()
    }

    const [test, setTest] = useState({
        chars: 0, 
        lineChars: 0,
        incorrectChars: 0, 
    })

    const resetTest = (command: string) => {
        setTimer({
            time: 0, 
            started: false, 
            finished: false
        })
        setWpm([])
        setErrors([])
        setTempIncorrectChars(0)
        setTest({
            chars: 0, 
            lineChars: 0, 
            incorrectChars: 0
        })
        if (command === 'next') getCode('cpp')
    }


    const [testDetails, setTestDetails] = useState({
        wpmLabels: [], 
        wpmData: [], 
        errorsLabels: [], 
        errorsData: [], 
        averageWpm: 0, 
        maxWpm: 0, 
        minWpm: Infinity, 
        accuracy: 100, 
        totalChars: 0, 
        correctChars: 0
    })

    const getTestDetails = () => {
        // wpm labels and data
        const wpmLabels: any = []
        const wpmData: any = []
        let iterator = Math.ceil(wpm.length / 10)
        for (let i = 0; i <= wpm.length + 1; i += iterator){
            wpmLabels.push(i + 's')
            if (wpm[i]) wpmData.push(wpm[i][0])
            else wpmData.push(wpm[wpm.length - 1][0])
        }
        // errors labels  
        const errorsLabels = errors.length === 0 ? 
        ['0s', Math.ceil(wpm.length / 2) + 's', (wpm.length + 1) + 's'] : 
        errors.length < 3 ? ['0s', ...errors.map((val:any) => (val[1] + 's')), (wpm.length + 1) + 's'] :
        errors.map((val:any) => (val[1] + 's'))
        // errors data
        const errorsData = errors.length === 0 ? 
        [-1, -1, -1] : errors.length < 3 ? [-1, ...errors.map((val:any) => (val[0])), -1] 
        : errors.map((val:any) => (val[0]))
        // average, best, and worst wpm
        let sum = 0, max = 0, min = Infinity
        for (let i = 0; i < wpm.length; i++){
            sum += wpm[i][0]
            if (wpm[i][0] > max) max = wpm[i][0]
            if (wpm[i][0] < min) min = wpm[i][0]
        }
        const average = Math.round(sum / wpm.length)
        // accuracy
        const accuracy = Math.max(Math.round(((test.chars + test.lineChars - test.incorrectChars) / 
        (test.chars + test.lineChars)) * 100), 0)

        let totalChars = 0 
        code.map((val) => totalChars += val.replace(/\s+/g, ' ').trim().length)

        // setting all properties
        setTestDetails({
            wpmLabels: wpmLabels, 
            wpmData: wpmData, 
            errorsLabels: errorsLabels, 
            errorsData: errorsData, 
            averageWpm: average, 
            maxWpm: max, 
            minWpm: min, 
            accuracy: accuracy,
            totalChars: totalChars, 
            correctChars: Math.max(test.chars - test.incorrectChars, 0)
        })
        document.getElementById('finished-test-input')?.focus()
    }
    
    return (
        (!timer.finished ? 
            <div className='main-container'>
                <PracticeCode code={code} 
                    test={test} 
                    setTest={setTest} 
                    startTimer={startTimer} 
                    endTimer={endTimer} 
                    showStatusBar={showStatusBar}
                />
                {showStatusBar ? <UnderBar   
                    wpm={(timer.time === 0 || test.chars + test.lineChars === 0) ? '' : Math.round(((test.chars + test.lineChars)/4.5)/(timer.time/60))} 
                    accuracy={test.chars + test.lineChars === 0 ? '' : Math.max(Math.round(((test.chars + test.lineChars - test.incorrectChars)/(test.chars + test.lineChars)) * 100), 0)}
                    time={limit.type === 'time' ? limit.timeLimit - timer.time : timer.started ? Math.min(timer.time, 300) : ''} 
                    limit={limit.type}
                    limitValue={limit.type === 'time' ? limit.timeLimit : limit.lineLimit}
                    onSetTimeLimit={setNewTimeLimit}
                    onSetLineLimit={setNewLineLimit}
                /> : <div className='placeholder-status-bar'></div>}
                {/* show status bar button */}
                <button className='toggle-status-bar' onClick={() => (setShowStatusBar(!showStatusBar))}>{showStatusBar ? 'HIDE STATUS BAR' : 'SHOW STATUS BAR'}</button>
            </div>
            :
            <FinishedTest 
                testDetails={testDetails}
                limit={limit.type} 
                limitValue={limit.type === 'time' ? limit.timeLimit : limit.lineLimit}
                onNewTest={resetTest}
            />
        )
    )

    // return (<FinishedTest 
    //     testDetails={testDetails}
    //     limit={limit.type} 
    //     limitValue={limit.type === 'time' ? limit.timeLimit : limit.lineLimit}
    // />)
}

export default Main