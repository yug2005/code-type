import React from 'react'
import { Link } from 'react-router-dom'
import GoogleLogin from './GoogleLogin'
import { CgClose } from 'react-icons/cg'
import './SignIn.css'

const SignIn = () => {
    const createAccount = () => {
        console.log('Account created')
    }

    const signIn = () => {
        console.log('Signed in')
    }
    
    return (
        <div className='sign-in-container'>
            <Link className='close-sign-in' to='/'><CgClose /></Link>
            <div className='register-container'>
                <div className="sign-in-title">register</div>
                <form className='register-form' onSubmit={createAccount}>
                    <label>name</label>
                    <input type='text' className='form-input' placeholder='name'></input>

                    <label>email</label>
                    <input type='text' className='form-input' placeholder='email'></input>

                    <label>password</label>
                    <input type='text' className='form-input' placeholder='password'></input>

                    <input value='register' type='submit' className='form-submit'></input>
                </form>
            </div>
            <div className='log-in-container'>
            <div className="sign-in-title">sign in</div>
                <form className='register-form' onSubmit={signIn}>
                    <label>email</label>
                    <input type='text' className='form-input' placeholder='email'></input>

                    <label>password</label>
                    <input type='text' className='form-input' placeholder='password'></input>
                    
                    <input value='sign in' type='submit' className='form-submit'></input>

                    <h3 className='register-or'>or</h3>
                    <GoogleLogin />
                </form>
            </div>
        </div>
    )
}

export default SignIn
