import { useState, useEffect } from 'react'
import UnderBar from './UnderBar'
import './PracticeCode.css'; 

const PracticeCode = () => {
    const [practiceCode] = useState([
        'void Node::insert(int value)',
        '{',
        '    if (value < data)',
        '    {',
        '        if (left == nullptr) left = new Node(value);',
        '        else left->insert(value);',
        '    }',
        '    else',
        '    {',
        '        if (right == nullptr) right = new Node(value);',
        '        else right->insert(value);',
        '    }',
        '}',
    ])

    const [previewText, setPreviewText] = useState([['']])

    const [userInput, setUserInput] = useState('')
    const [lineIndex, setLineIndex] = useState(0)

    const [charCount, setCharCount] = useState(0)
    const [lineCharCount, setLineCharCount] = useState(0)

    const [correctCharCount, setCorrectCharCount] = useState(0)
    const [correctLineCharCount, setCorrectLineCharCount] = useState(0)
    const [incorrectCharCount, setincorrectCharCount] = useState(0)

    const [time, setTime] = useState(0)
    const [userStarted, setUserStarted] = useState(false)
    const [userFinished, setUserFinished] = useState(false)

    useEffect(() => {
        setPreviewText(practiceCode.map((line) => line.replace(/\s+/g, ' ').trim().split('')))
        let interval: any = null
        if (userStarted) {
            interval = setInterval(() => {
                setTime(time => time + 1)
            }, 1000)
        } else if (!userStarted && time !== 0) clearInterval(interval)

        return () => clearInterval(interval)
    }, [userStarted, time])

    const onUserInputChange = (e: any) => {
        setUserInput(e.target.value)
        startTimer()

        console.log('line before : ' + practiceCode[lineIndex])

        const line = practiceCode[lineIndex].replace(/\s+/g, ' ').trim() // 'if(value<data)
        const input = (e.target.value).split('')
        const lastChar = e.target.value.charAt(e.target.value.length - 1)
        if (lastChar !== line[e.target.value.length - 1]) setincorrectCharCount(incorrectCharCount + 1)

        console.log('incorrect characters : ' + (incorrectCharCount + (lastChar !== line[e.target.value.length - 1] ? 1 : 0)))

        setLineCharCount(input.length) // pushing last character
        // note push() retuns the length of the array with the new element
        console.log('line : ' + line)
        console.log('input : ' + input)
        console.log('Number of characters : ' + input.length)

        setCorrectLineCharCount(input.filter((value: any, index: any) => value == line[index]).length)
        
        console.log('Number of correct characters : ' + input.filter((value: any, index: any) => value === line[index]).length)
    }
    
    const resetUserInput = (e: any) => {
        if (e.key == 'Enter'){
            setUserInput('')
            setLineIndex(lineIndex + 1)
            setCharCount(charCount + lineCharCount)
            setCorrectCharCount(correctCharCount + correctLineCharCount)
            if (lineIndex >= previewText.length) endTimer()
        }
    }

    const startTimer = () => {
        if (!userStarted) setUserStarted(true)
    }

    const endTimer = () => {
        setUserStarted(false)
    }

    const getLine = (line: any, index: any) => {
        return line.map((char: any, index_2: any) => (
            <span className='practice-code-text'
                id={index < lineIndex ? 'text-correct' : 
                index == lineIndex && index_2 < userInput.length 
                ? (char === userInput[index_2] ? 'text-correct' : 
                char === ' ' ? 'text-space-wrong' : 'text-wrong') : 'text-uncompleted'}>
            <pre>{char}</pre></span>
        ))
    }

    return (
        <div className='practice-code'>
            {/* main practice code container */}
            <button className='practice-code-button'>
                <div className='practice-code-container'>
                    {previewText.map((line, index_1) => 
                        (((lineIndex < 2 && index_1 < 6) || (index_1 >= lineIndex - 2 && index_1 <= lineIndex + 3)) && 
                        <div className='practice-code-line'>
                            {/* tab at the start of the line if there is one */}
                            {practiceCode[index_1].split('   ').splice(1).map((index) => (
                                <pre className='practice-code-text tab-space'>   </pre>
                            ))}
                            {/* code line to type out */}
                            {getLine(line, index_1)}
                        </div>
                    ))}
                </div>
            </button>

            {/* status bar under the practice code container */}
            <UnderBar   
                wpm={(time == 0 || charCount + lineCharCount == 0) ? '' : Math.round(((charCount + lineCharCount)/4.5)/(time/60))} 
                accuracy={charCount + lineCharCount == 0 ? '' : Math.round(((charCount + lineCharCount - incorrectCharCount)/(charCount + lineCharCount)) * 100)}
                time={time} />

            {/* temporary text box to type into */}
            <input type='text' value={userInput} placeholder='Start typing ...' className='text-input' onChange={(e) => onUserInputChange(e)} onKeyPress={(e) => (resetUserInput(e))}></input>
        </div>
    )
}

export default PracticeCode
