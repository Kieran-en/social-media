import React from 'react';
import Nav from './Nav';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/userService';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../features/tokens/tokenSlice';

const Login = () => {

    const  navigate = useNavigate();
    const queryClient = useQueryClient();
    const tokenn = useSelector((state) => state.token)
    const dispatch = useDispatch()

    const loginMutation = useMutation(login, {
        onSuccess: (data) => {
        let { token } = data
        console.log(token)
        dispatch(setToken(token))
          localStorage.setItem('token', token)
                if (data.hasOwnProperty('token')){
                 navigate(`/timeline/${data.username}`);
                }
        }
      })

    const [values, setValues] = useState({
        email: '',
        password: '',
    })

    const handleChange = (event) => {

        setValues(values => ({
            ...values, 
            [event.target.name] : event.target.value
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        loginMutation.mutate(values)
        /**fetch(`${config.apiEndpoint}/auth/login`, {
                method: 'POST',
                headers: {
                 'Content-Type': 'application/json',
                },
               body: JSON.stringify(values),
            })
            .then(response => response.json())
            .then(data => {
                let { token } = data
                //setAccessToken(data.token);
                //localStorage.setItem("userData", JSON.stringify(data))
                localStorage.setItem('token', token)
                if (data.hasOwnProperty('token')){
                 navigate(`/timeline/${data.username}`);
                }
            }) */
    }

    return (
        <div className='login' style={{color: 'white'}}>
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
                <button type='submit' className='btn w-100 p-2' style={{backgroundColor: '#0F6E5A', color: 'white'}}>Login</button>
                </form>
        </div>
    )
}

export default Login;