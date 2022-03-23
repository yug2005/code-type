import React, { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import './UnderBar.css';

interface BarInterface {
    wpm: number | string
    accuracy: number | string
    time: number | string
    limit: string
    limitValue: number
    onSetTimeLimit: (newTimeLimit: number) => void
    onSetLineLimit: (newLineLimit: number) => void
    onFileSubmit: any
}

const fileTypes = ".c,.cs,.cpp,.h,.hpp,.css,.go,.html,.java,.js,.jsx,.ts,.tsx,.kt,.sql,.php,.py,.txt"

const UnderBar = (props: BarInterface) => {

    const [fileName, setFileName]:any = useState()
    const [file, setFile]:any = useState()
    const [formattedFile, setFormattedFile]:any = useState()
    const [fileUploadWindowOpen, setFileUploadWindowOpen] = useState(false)
    
    const onUpload = () => {
        document.getElementById("file-upload-input")?.click(); 
    }

    const onFileUpload = (e: any) => {
        const files = e.target.files; 
        if (!files[0]) return
        if (files[0].size > 10000000) {
            alert("The file size exceeds 10 MB.")
            return
        }
        const reader = new FileReader(); 
        reader.readAsText(files[0])
        reader.onload = () => {
            const file = reader.result?.toString()
            if (!file) return
            const numLines = file.split('\n').length
            if (numLines > 500) {
                alert("This file is too large.")
                setFile("")
                return
            }
            setFile(file)
            var temp = file.replaceAll(/\s*$/g, '')
            temp = temp.replaceAll(/\n\s*\n/g, "\n")
            setFormattedFile(temp)
            setFileName(files[0].name)
            setFileUploadWindowOpen(true)
            e.target.value = null
        }
    }

    const onFileSubmit = (file:any) => {
        setFileUploadWindowOpen(false)
        props.onFileSubmit(file)
    } 

    return (
        <div className='under-bar-container'>
            {fileUploadWindowOpen && 
                <FileUploadWindow file={file} fileName={fileName} 
                formattedFile={formattedFile}
                setFormattedFile={setFormattedFile}
                onCancel={() => setFileUploadWindowOpen(false)}
                onFileSubmit={onFileSubmit}
                />
            }
            {/* wpm, accuracy, and time display */}
            <div className='under-bar-item' id='wpm'>
                <label className='under-bar-label'>wpm</label>
                <p className='under-bar-value'>{props.wpm}</p>
            </div>
            <div className='under-bar-item' id='accuracy'>
                <label className='under-bar-label'>accuracy</label>
                {props.accuracy !== '' && <p className='under-bar-value'>{props.accuracy}%</p>}
            </div>
            <div className='under-bar-item' id='time'>
                <label className='under-bar-label'>time</label>
                {props.time !== '' && <p className='under-bar-value'>{props.time}s</p>}
            </div>
            {/* timed setting */}
            <div className='under-bar-setting'>
                <label className={`under-bar-label ${props.limit === 'time' ? 'selected-setting' : ''}`}>timed</label>
                <div className='under-bar-drop-down'>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(15)}>
                        {props.limit === 'time' && props.limitValue === 15 && <FiCheck className='drop-down-check'/>}
                        <p>15 sec</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(30)}>
                        {props.limit === 'time' && props.limitValue === 30 && <FiCheck className='drop-down-check'/>}
                        <p>30 sec</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(45)}>
                        {props.limit === 'time' && props.limitValue === 45 && <FiCheck className='drop-down-check'/>}
                        <p>45 sec</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetTimeLimit(60)}>
                        {props.limit === 'time' && props.limitValue === 60 && <FiCheck className='drop-down-check'/>}
                        <p>60 sec</p>
                    </button>
                </div>
            </div>
            {/* lines setting */}
            <div className='under-bar-setting'>
                <label className={`under-bar-label ${props.limit === 'line' ? 'selected-setting' : ''}`}>lines</label>
                <div className="under-bar-drop-down">
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(5)}>
                        {props.limit === 'line' && props.limitValue === 5 && <FiCheck className='drop-down-check'/>}
                        <p>5 lines</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(10)}>
                        {props.limit === 'line' && props.limitValue === 10 && <FiCheck className='drop-down-check'/>}
                        <p>10 lines</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(15)}>
                        {props.limit === 'line' && props.limitValue === 15 && <FiCheck className='drop-down-check'/>}
                        <p>15 lines</p>
                    </button>
                    <button className='drop-down-button' onClick={() => props.onSetLineLimit(20)}>
                        {props.limit === 'line' && props.limitValue === 20 && <FiCheck className='drop-down-check'/>}
                        <p>20 lines</p>
                    </button>
                </div>
            </div>
            {/* custom setting */}
            <div className='under-bar-setting'>
                <label className='under-bar-label'>custom</label>
                <div className="under-bar-drop-down" id='custom-drop-down'>
                    <button className="drop-down-button">full file</button>
                    <button className="drop-down-button" onClick={() => onUpload()}>upload</button>
                    <input id="file-upload-input" type="file" name="file upload" accept={fileTypes}
                    onChange={(e) => onFileUpload(e)} hidden/>
                </div>
            </div>
        </div>
    )
}

const FileUploadWindow = ({file, fileName, formattedFile, setFormattedFile, onCancel, onFileSubmit}:any) => { 

    const [removeLines, setRemoveLines] = useState(true)
    const [removeComments, setRemoveComments] = useState(false)
    const [formatFile, setFormatFile] = useState(false)

    const getFormattedFile = (removeLines:Boolean, removeComments:Boolean, formatFile:Boolean) => {
        var temp = file 
        temp = temp.replaceAll(/\s*$/g, '')

        const fileExtension = fileName?.split('.').pop();

        if (removeComments) {
            if (['c', 'cs', 'cpp', 'h', 'hpp', 'java', 'js', 'jsx', 'ts', 'tsx'].includes(fileExtension)) {
                temp = temp.replaceAll(/\s*[/][/].*\n?/g, '')
                temp = temp.replaceAll(/[/][/].*/g, '')
                temp = temp.replaceAll(/[/]\*([^/]|\n)*\*[/]/g, '')
            }
            else {
                console.log("This file cannot have comments removed.")
            }
        }
        if (formatFile) {
            temp = temp.replaceAll(/\n\s*\{/g, " {")
            temp = temp.replaceAll(/\s*;/g, ";")
            temp = temp.replaceAll(/\{(\w)/g, "{ $1")
            temp = temp.replaceAll(/(\w)\}/g, "$1 }")
        }
        if (removeLines) {
            temp = temp.replaceAll(/\n\s*\n/g, "\n")
            temp = temp.replace(/^\s*\n/g, '')
        }
        setFormattedFile(temp)
    }
    
    return (
        <div className="file-upload-window">
            <div className="file-upload">
                {/* <div className='file-upload-title'>Upload</div> */}
                <div className='file-name'>{fileName}</div> 
                <div className="file-preview">
                    <pre>{formattedFile}</pre>
                </div>
                <form className="file-upload-options">
                    <input type="checkbox" className="file-upload-checkbox" name="remove extra lines" 
                    checked={removeLines} onChange={() => {
                        setRemoveLines(!removeLines)
                        getFormattedFile(!removeLines, removeComments, formatFile)
                    }}/>
                    <label className='file-upload-label' >remove extra lines</label>
                    <input type="checkbox" className="file-upload-checkbox" name="remove comments" 
                    checked={removeComments} onChange={() => {
                        setRemoveComments(!removeComments)
                        getFormattedFile(removeLines, !removeComments, formatFile)
                    }}/>
                    <label className='file-upload-label' >remove comments</label>
                    <input type="checkbox" className="file-upload-checkbox" name="format file" 
                    checked={formatFile} onChange={() => {
                        setFormatFile(!formatFile)
                        getFormattedFile(removeLines, removeComments, !formatFile)
                    }}/>
                    <label className='file-upload-label' >format file</label>
                </form>
                <div className="file-upload-buttons">
                    <button className="setting-button" onClick={onCancel}>cancel</button>
                    <button className="file-upload-button" onClick={() => onFileSubmit(formattedFile)}>
                        upload
                    </button>
                </div>
            </div>
            <div className='close-file-upload' onClick={onCancel}></div>
        </div>
    )
}

// const DropDown = ({label, limitVariable, limitValueVariable, limitType, options, onClick}:any) => {
//     const underlineLabel = limitVariable === limitType ? 'selected-setting' : ''
    
//     return (
//         <div className='under-bar-setting'>
//             <label className={`under-bar-label ${underlineLabel}`}>{label}</label>
//             <div className="under-bar-drop-down">
//                 {options.map((option:any) => {
//                     <DropDownButton 
//                         limitVariable={limitVariable}
//                         limitValueVariable={limitValueVariable}
//                         limit={limitType}
//                         limitValue={option}
//                         onClick={onClick}
//                     />
//                 })}
//             </div>
//         </div>
//     )
// }

// const DropDownButton = ({limitVariable, limitValueVariable, limit, limitValue, onClick}:any) => {
//     const showCheck = limitVariable === limit && limitValueVariable === limitValue

//     return (
//         <button className='drop-down-button' onClick={onClick(limitValue)}>
//             {showCheck && <FiCheck className='drop-down-check'/>}
//             <p>{limitValue} lines</p>
//         </button> 
//     )
// }

UnderBar.defaultProps = {
    wpm: '',
}

export default UnderBar
