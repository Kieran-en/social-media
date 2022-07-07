import React from 'react';
import Nav from './Nav';
import { Form } from 'react-bootstrap';
import { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, setAccessToken } from '../accessToken';

const Login = () => {

    const  navigate = useNavigate();

    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    const handleChange = (event) => {
        console.log(event.target.name + ":" + event.target.value)

        setValues(values => ({
            ...values, 
            [event.target.name] : event.target.value
        }));
    }

    const validate = () => {
        
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
                },
               body: JSON.stringify(values),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                console.log(data.hasOwnProperty('token'));
                setAccessToken(data.token);
                console.log(getAccessToken())
                if (data.hasOwnProperty('token')){
                 navigate(`/timeline/${data.username}`);
                }
            })
    }

    return (
        <div className='login'>
            <Nav/>
            <form className='container' onSubmit={handleSubmit}>
                <div className='form-group mb-4 d-flex flex-column align-items-start'>
                <label htmlFor='email' className='form-label'>Email:</label>
                <input type='email' placeholder='Email' name='email' id='email' className='form-control' value={values.email} onChange={handleChange}></input>
                </div>
                <div className='form-group mb-4 d-flex flex-column align-items-start'>
                <label htmlFor='password' className='form-label'>Password:</label>
                <input type='password' placeholder='Password' name='password' id='password' value={values.password} onChange={handleChange} className='form-control'></input>
                </div>
                <button type='submit' className='btn btn-danger w-100 p-2'>Login</button>
                </form>
        </div>
    )
}

export default Login;