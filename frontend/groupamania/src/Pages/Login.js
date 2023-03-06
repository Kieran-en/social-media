import React from 'react';
import Nav from './Nav';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import config from '../config.json'

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

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch(`${config.apiEndpoint}/auth/login`, {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
                },
               body: JSON.stringify(values),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setAccessToken(data.token);
                localStorage.setItem("userData", JSON.stringify(data))
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