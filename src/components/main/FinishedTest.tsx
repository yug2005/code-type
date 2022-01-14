import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { MdNavigateNext } from 'react-icons/md'
import { IoReader, IoRepeatOutline } from 'react-icons/io5'
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
    timeLimit: number
}

const FinishedTest = (props: propsInterface) => {
    const labels = []
    for (let i = 0; i <= props.timeLimit; (i += props.timeLimit / 10)) labels.push(i + 's')
    
    const wpm = {
        labels: labels,
        datasets: [
            {
                label: 'words per minute', 
                data: Array.from({length: 11}, () => Math.floor(Math.random() * 20 ) + 80),
                borderColor: '#606e7a',
                backgroundColor: '#8b949c'
            }
        ], 
    }

    const errors = {
        labels: ['3s', '6s', '15s', '21s', '24s'], 
        datasets: [
            {
                label: 'errors', 
                data: [1, 3, 2, 4, 2],
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
                suggestedMax: 4
            }
        }, 
        radius: 4, 
        hoverRadius: 8
    }

    const [userInput, setUserInput] = useState('')

    const getWordInUserInput = (word: string) => {
        for (let i = word.length; i > 0; i--) {
            if (userInput.length - i !== -1 && userInput.lastIndexOf(word.substring(0, i)) === userInput.length - i) {
                return Array.from({length: word.length}, (val: any, index: number) => index < i ? 'typed' : '')
            }     
        }
        return ['', '', '', '', '']
    }

    return (
        <div className='test-finished-container'>
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
                    <h3>test details</h3>
                    <p>234 chars</p>
                    <p>time {props.timeLimit}s</p>
                </div>
                <div className='other-stat'>
                    <h3>average wpm</h3>
                    <div>72</div>
                </div>
                <div className='other-stat'>
                    <h3>fastest wpm</h3>
                    <div>93</div>
                </div>
                <div className='other-stat'>
                    <h3>slowest wpm</h3>
                    <div>61</div>
                </div>
                <div className='other-stat'>
                    <h3>accuracy</h3>
                    <div>93%</div>
                </div>
                <div className='other-stat'> 
                    <h3>correct chars</h3>
                    <div>223</div>
                </div>
            </div>
            <div className='finished-test-buttons'>
                <button className='button'>
                    <div className='button-label'>
                        {"next".split('').map((char, index) => {
                            return <span id={getWordInUserInput('next')[index]}>{char}</span>
                        })} 
                    </div> 
                    <MdNavigateNext id='add-some-margin'/>
                </button>
                <button className='button'>
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
