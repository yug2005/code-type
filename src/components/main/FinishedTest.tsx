import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { MdNavigateNext } from 'react-icons/md'
import { IoRepeatOutline } from 'react-icons/io5'
import "./FinishedTest.css"

import {
    Chart as ChartJS,
    ChartType,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { FiAlignJustify } from 'react-icons/fi'
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface propsInterface {
    testDetails: any
    limit: string
    limitValue: number
    onNewTest: any
    language: string
}

const FinishedTest = (props: propsInterface) => {

    useEffect(() => {
        focusInput()
    }, [])

    const [userInput, setUserInput] = useState('')

    const focusInput = () => {
        document.getElementById('finished-test-input')?.focus()
    }

    const getWordInUserInput = (word: string) => {
        for (let i = word.length; i > 0; i--) {
            if (userInput.length - i !== -1 && userInput.lastIndexOf(word.substring(0, i)) === userInput.length - i) {
                if (i === word.length) props.onNewTest(word)
                return Array.from({length: word.length}, (val: any, index: number) => index < i ? 'typed' : '')
            }     
        }
        return ['', '', '', '', '']
    }

    const wpm = {
        labels: props.testDetails.wpmLabels,
        datasets: [
            {
                label: 'words per minute', 
                data: props.testDetails.wpmData,
                borderColor: '#606e7a',
                backgroundColor: '#8b949c'
            }
        ], 
    }

    const errors = {
        labels: props.testDetails.errorsLabels, 
        datasets: [
            {
                label: 'errors', 
                data: props.testDetails.errorsData,
                borderColor: '#795c58', 
                backgroundColor: '#ff7962', 
            }
        ]
    }

    const wpm_options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 14, 
                        family: 'Red Hat Mono',
                    }, 
                    color: '#606e7a', 
                }
            },
            title: {
                display: false,
                text: 'words per minute'
            },
        },
        scales: {
            xAxes: {
                title: {
                    display: false, 
                    text: 'time'
                },
                grid: {
                    display: true, 
                    color: 'rgba(125, 125, 125, 0.2)'
                },
                ticks: {
                    font: {
                        family: 'Red Hat Mono', 
                        size: 11
                    }, 
                    color: '#606e7ac0'
                }
            },
            yAxes: {
                title: {
                    display: false, 
                    text: 'words per minute'
                },
                grid: {
                    display: true, 
                    color: 'rgba(125, 125, 125, 0.1)'
                },
                ticks: {
                    font: {
                        family: 'Red Hat Mono', 
                        size: 11
                    }, 
                    color: '#606e7ac0'
                },
                min: 0, 
                suggestedMax: 120
            }
        }, 
        radius: 4, 
        hoverRadius: 8
    }

    const errors_options = {
        responsive: true,
        showLine: false, 
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 13, 
                        family: 'Red Hat Mono',
                    }, 
                    color: '#606e7a'
                }
            },
            title: {
                display: false,
                text: 'number of errors',
            },
        },
        scales: {
            xAxes: {
                title: {
                    display: false, 
                    text: 'time'
                },
                grid: {
                    display: true, 
                    color: 'rgba(125, 125, 125, 0.1)'
                }, 
                ticks: {
                    font: {
                        family: 'Red Hat Mono', 
                        size: 11
                    }, 
                    color: '#606e7ac0'
                }
            },
            yAxes: {
                title: {
                    display: false, 
                    text: 'number of errors'
                },
                grid: {
                    display: true, 
                    color: 'rgba(125, 125, 125, 0.1)'
                },
                ticks: {
                    stepSize: 1, 
                    font: {
                        family: 'Red Hat Mono', 
                        size: 11
                    }, 
                    color: '#606e7ac0'
                },
                min: 0, 
                suggestedMax: 3
            }
        }, 
        radius: 4, 
        hoverRadius: 8
    }

    return (
        <div className='test-finished-container' onClick={() => focusInput()}>
            <div className='test-finished-title'>
                <h2>TEST SUMMARY</h2>
            </div>
            <div className='charts-container' >
                <div className='errors-chart'>
                    <Line 
                        data={errors}
                        options={errors_options}
                        width="10px"
                        height="15px"
                    />
                </div>
                <div className='wpm-chart'>
                    <Line 
                        data={wpm}
                        options={wpm_options}
                        width="40px"
                        height="15px"
                    />
                </div>
            </div>
            <div className='others-container'>
                <div className='other-stat'>
                    <h3 id='test-details'>test details</h3>
                    <p>language: {props.language}</p>
                    {props.limit === 'time' ? 
                    <p id='test-type'>timed {props.limitValue}s</p> :
                    <p id='test-type'>{props.limitValue} lines</p>}
                </div>
                <div className='other-stat'>
                    <h3>average wpm</h3>
                    <div>{props.testDetails.averageWpm}</div>
                </div>
                <div className='other-stat'>
                    <h3>fastest wpm</h3>
                    <div>{props.testDetails.maxWpm}</div>
                </div>
                <div className='other-stat'>
                    <h3>slowest wpm</h3>
                    <div>{props.testDetails.minWpm}</div>
                </div>
                <div className='other-stat'>
                    <h3>accuracy</h3>
                    <div>{props.testDetails.accuracy}</div>
                </div>
                <div className='other-stat'> 
                    <h3>correct chars</h3>
                    <div>{props.testDetails.correctChars}</div>  
                </div>
            </div>
            <div className='finished-test-buttons'>
                <button className='button' onClick={() => props.onNewTest('next')}>
                    <div className='button-label'>
                        {"next".split('').map((char, index) => {
                            return <span id={getWordInUserInput('next')[index]}>{char}</span>
                        })} 
                    </div> 
                    <MdNavigateNext id='add-some-margin'/>
                </button>
                <button className='button' onClick={() => props.onNewTest('again')}>
                    <div className='button-label'>
                        {"again".split('').map((char, index) => {
                            return <span id={getWordInUserInput('again')[index]}>{char}</span>
                        })} 
                    </div>
                    <IoRepeatOutline id='add-some-margin'/>
                </button>
            </div>
            {/* temporary text box */}
            <input 
                className='temporary-input'
                id='finished-test-input'
                type='text' 
                value={userInput} 
                placeholder='type...'
                onChange={(e) => setUserInput(e.target.value)} 
                >
            </input>
            
        </div>
    )
}

export default FinishedTest
