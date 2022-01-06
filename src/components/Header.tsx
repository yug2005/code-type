import './Header.css';
import Button from './Button'



interface HeaderInterface {
    text: string
    onClickLanguages: () => void
}

const Header = (props: HeaderInterface) => {
    

    const log = () => {
        console.log('hello')
    }
    
    return (
        <header className='header'>
            <h2 className='title'>{props.text}</h2>
            <Button text='timed' button_id='navbar-button' onClick={log} />
            <Button text='size' button_id='navbar-button' onClick={log} />
            <Button text='languages' button_id='navbar-button' onClick={props.onClickLanguages} />
            <Button text='settings' button_id='navbar-button' onClick={log} />
            <Button text='sign in' button_id='sign-up-button' onClick={log} />
        </header>
    )
}

Header.defaultProps = {
    text: 'code type',
}

export default Header
