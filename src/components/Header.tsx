import React from 'react'
import './Header.css';
import Button from './Button'

interface HeaderInterface {
    text: string
    language:string
    onClickLanguages: () => void
}

const Header = (props: HeaderInterface) => {
    

    const log = () => {
        console.log('hello')
    }
    
    return (
        <header className='header'>
            <h2 className='title'>{props.text}</h2>
            <button className='button navbar-button' onClick={props.onClickLanguages}>
                <h3 className='button-text'>{props.language}</h3>
                <div className='button-under-line'></div>
            </button>
            <button className='button navbar-button' onClick={props.onClickLanguages}>
                <h3 className='button-text'>settings</h3>
                <div className='button-under-line'></div>
            </button>
            <Button text='sign in' button_id='sign-up-button' onClick={log} />
        </header>
    )
}

Header.defaultProps = {
    text: 'code type',
}

export default Header
