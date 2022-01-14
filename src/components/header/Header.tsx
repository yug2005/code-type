import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css';

interface HeaderInterface {
    text: string
    language:string
    onClickLanguages: () => void
}

const Header = (props: HeaderInterface) => {    
    return (
        <header className='header'>
            <div className='title'>
                <Link className='title-text' to='/'>
                    <h2>{props.text}</h2>
                </Link>     
            </div>
            <button className='button navbar-button' onClick={props.onClickLanguages}>
                <h3 className='button-text'>{props.language}</h3>
            </button>
            <Link className='button navbar-link' to='/settings'>
                <h3 className='button-text'>settings</h3>
            </Link>
            <Link className='button sign-up-link' to={'/signin'}>
                <h3 className='button-text'>sign in</h3>
            </Link>
        </header>
    )
}

Header.defaultProps = {
    text: 'code type',
}

export default Header
