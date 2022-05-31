import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import PracticeCode from './PracticeCode'
import UnderBar from './UnderBar'
import FinishedTest from './FinishedTest'
import './Main.css'

interface PropsInteface {
    language: string
    code: any
    getCodeBlock: any
    adjustCodeLines: any
    onFileSubmit: any
    usingCustom: any
    refresh: any
}

const Main = (props: PropsInteface) => {
    const [settings, setSettings]:any = useContext(UserContext)
    
    useEffect(() => {
        resetTest(false)
    }, [props.refresh])

    const [userInput, setUserInput] = useState('')
    const [lineIndex, setLineIndex] = useState(0)
    const [currentLine, setCurrentLine] = useState([''])
    const [previousLines, setPreviousLines] = useState([[''], ['']])

    const [limit, setLimit] = useState({
        type: 'time', 
        timeLimit: 30, 
        lineLimit: 15
    })

    const setNewTimeLimit = (newTimeLimit: number) => {
        setLimit({...limit, type: 'time', timeLimit: newTimeLimit})
        props.adjustCodeLines(50)
    }

    const setNewLineLimit = (newLineLimit: number) => {
        setLimit({...limit, type: 'line', lineLimit: newLineLimit})
        props.adjustCodeLines(newLineLimit)
    }
    
    // object for the timer
    const [timer, setTimer] = useState({
        hr_time: 0,
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
                if (settings?.status_bar.hide)
                    setSettings?.({...settings, status_bar: {...settings.status_bar, show: false}})
                interval = setInterval(() => {
                    setTempIncorrectChars(test.incorrectChars)
                    // increment timer
                    setTimer({...timer, time: timer.time + 1})
                    // determine the wpm
                    if (timer.time > 0) {
                        const currentWpm = Math.round((test.chars+test.lineChars)/4.5/(timer.time/60.0))
                        wpm.push([currentWpm, timer.time])
                    }
                    // determine the number of errors
                    if (test.incorrectChars > tempIncorrectChars) {
                        const numErrors = test.incorrectChars - tempIncorrectChars
                        errors.push([numErrors, timer.time])
                    }
                }, 1000)
            } 
            else if (settings?.status_bar.hide && !settings?.status_bar.show) {
                setSettings?.({...settings, status_bar: {...settings.status_bar, show: true}})
            }
            // when the timer limit is reached
            if (limit.type === 'time' && limit.timeLimit - timer.time === 0) {
                endTimer()
                clearInterval(interval)
            }
        }
        return () => clearInterval(interval)
    }, [timer]) 
    
    // starts the timer
    const startTimer = () => {
        if (!timer.started) setTimer({...timer, started: true})
    }

    // ends the timer
    const endTimer = () => {
        setTimer({...timer, finished: true})
        getTestDetails()
    }

    // stores the test details
    const [test, setTest] = useState({
        chars: 0, 
        lineChars: 0,
        incorrectChars: 0, 
    })

    const [currentWpm, setCurrentWpm] = useState(0)
    const [currentAccuracy, setCurrentAccuracy] = useState(100)

    useEffect(() => {
        if (timer.started && !timer.finished && (test.chars + test.lineChars) > 0) {
            const totalChars = test.chars + test.lineChars
            let currentWpm = Math.round((totalChars*60.0)/(timer.time*4.5))
            let currentAccuracy = Math.max(Math.round((totalChars-test.incorrectChars)/totalChars*100),0)
            // adjust for wpm being very high at the start
            // TODO: find a better method for this
            if (timer.time < 3) currentWpm = Math.floor(currentWpm / 2)
            console.log("Current accuracy : " + currentAccuracy)
            setCurrentWpm(currentWpm)
            setCurrentAccuracy(currentAccuracy)
            if (settings?.test.fails_on.use) {
                if (currentWpm < settings?.test.fails_on.wpm || currentAccuracy < settings?.test.fails_on.accuracy) {
                    console.log(`Test failed with wpm ${currentWpm} and accuracy ${currentAccuracy}`)
                    endTimer()
                }
            }
        }
    }, [timer, test])

    // reset all the variables for new test
    const resetTest = (newTest:boolean) => {
        setTimer({
            hr_time: 0,
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
        setUserInput('')
        setLineIndex(0)
        setCurrentLine([''])
        setPreviousLines([[''], ['']])
        if (newTest) {
            if (limit.type === 'line') props.getCodeBlock(limit.lineLimit)
            else props.getCodeBlock()
        }
    }

    // object for storing the test statistics
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

    // getting the test statistics for after the test
    const getTestDetails = () => {
        // wpm labels and data
        let wpmLabels: any = []
        let wpmData: any = []
        if (wpm.length > 0) {
            let iterator = Math.ceil(wpm.length / 10)
            for (let i = 0; i <= wpm.length + 1; i += iterator){
                wpmLabels.push(i + 's')
                if (wpm[i]) wpmData.push(wpm[i][0])
                else wpmData.push(wpm[wpm.length - 1][0])
            }
        }
        else wpmLabels = ['0s', '1s', '2s', '3s']
        // errors labels  
        const errorsLabels = wpm.length === 0 ? ['0s', '3s'] : errors.length === 0 ? 
        ['0s', Math.ceil(timer.time / 2) + 's', timer.time + 's'] : 
        errors.length < 3 ? ['0s', ...errors.map((val:any) => (val[1] + 's')), timer.time + 's'] :
        errors.map((val:any) => (val[1] + 's'))
        // errors data
        const errorsData = errors.length === 0 ? 
        [NaN, NaN, NaN] : errors.length < 3 ? [NaN, ...errors.map((val:any) => (val[0])), NaN] 
        : errors.map((val:any) => (val[0]))
        // average, best, and worst wpm
        let sum = 0, max = 0, min = wpm.length > 0 ? Infinity : 0
        for (let i = 0; i < wpm.length; i++){
            sum += wpm[i][0]
            if (wpm[i][0] > max) max = wpm[i][0]
            if (wpm[i][0] < min) min = wpm[i][0]
        }
        const average = wpm.length > 0 ? Math.round(sum / wpm.length) : 0
        // total chars in the test
        const totalChars = props.code.reduce((a:any, b:any) => a + b.replace(/\s+/g, ' ').trim().length, 0)
        // setting all properties
        setTestDetails({
            wpmLabels: wpmLabels, 
            wpmData: wpmData, 
            errorsLabels: errorsLabels, 
            errorsData: errorsData, 
            averageWpm: average, 
            maxWpm: max, 
            minWpm: min, 
            accuracy: currentAccuracy,
            totalChars: totalChars, 
            correctChars: Math.max(test.chars - test.incorrectChars, 0)
        })
    }

    // when the user submits a file, then reset the test
    const onFileSubmit = (file:any) => {
        resetTest(false)
        props.onFileSubmit(file)
    }

    return (
        (!timer.finished ? 
            <div className='main-container'>
                {/* practice code block */}
                <PracticeCode 
                    code={props.code} 
                    test={test} 
                    setTest={setTest} 
                    resetTest={resetTest}
                    startTimer={startTimer} 
                    endTimer={endTimer} 
                    showStatusBar={settings?.status_bar.show && !settings?.appearance.focus_mode}
                    userInput={userInput}
                    setUserInput={setUserInput}
                    lineIndex={lineIndex}
                    setLineIndex={setLineIndex} 
                    currentLine={currentLine} 
                    setCurrentLine={setCurrentLine} 
                    previousLines={previousLines}
                    usingCustom={props.usingCustom}
                />
                {/* status bar below the practice code */}
                {settings?.status_bar.show && !settings?.appearance.focus_mode && <UnderBar   
                    wpm={(timer.time === 0 || test.chars + test.lineChars === 0) ? '' : currentWpm} 
                    accuracy={test.chars + test.lineChars === 0 ? '' : currentAccuracy}
                    time={limit.type === 'time' ? limit.timeLimit-timer.time : timer.started ? timer.time : ''} 
                    limit={limit.type} limitValue={limit.type === 'time' ? limit.timeLimit : limit.lineLimit}
                    onSetTimeLimit={setNewTimeLimit}
                    onSetLineLimit={setNewLineLimit}
                    onFileSubmit={onFileSubmit}
                />}
                {/* show status bar button */}
                {!settings?.status_bar.hide && <button className='toggle-status-bar' 
                    onClick={() => setSettings?.({...settings, status_bar: {...settings.status_bar, show: !settings?.status_bar.show}})}>
                    {settings?.status_bar.show ? 'hide' : 'show'} status bar
                </button>}
            </div> : 
            <FinishedTest 
                testDetails={testDetails}
                limit={limit.type} 
                limitValue={limit.type === 'time' ? limit.timeLimit : limit.lineLimit}
                resetTest={resetTest}
                language={props.language}
            />
        )
    )
}

export default Main