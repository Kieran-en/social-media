import React from 'react';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config.json'

const SignUp = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
    })

    const handleChange = (event) => {
        console.log(event.target.name + ":" + event.target.value)

        setValues(values => ({
            ...values,
            [event.target.name] : event.target.value,
        }));
    }

    const [showMessage, setShowMessage] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const validate = () => {
        const errors = {};

        if (values.name.length < 3){
            errors.name = "Name should be atleast 3 caracters long"
        }
        if (!values.email){
            errors.email = 'Please insert an email'
        } else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(values.email)) {
            errors.email = 'Invalid email';
        }
        if (values.password.length < 5){
            errors.password = 'Password should be atleast 5 caracters long'
        }
        if (values.confirmedPassword !== values.password){
            errors.confirmedPassword = 'Should be the same as password!'
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0){
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault()
        if (validate(values)){
            console.log(values);
           // setShowMessage(true);
            fetch(`${config.apiEndpoint}/auth/signup`, {
                method: 'POST',
                headers: {
                'Accept': 'application/json', 
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify(values),
            })
            .then(response => response.json())
            .then(data => {
               console.log(data)
               if (data.message === 'User created!'){
                   navigate(`/login`)
               }
               else {
                   alert('Unauthorized')
               }
            })
            console.log('Tokosss!')
        }
        else {
            setShowMessage(false);
        }
    }


    return (
        <div className="signup" style={{color: 'green', backgroundColor: 'white'}}>
            <Nav />
            <form className='container ' onSubmit={handleSubmit}>
                <div className='form-group mb-4 d-flex-column justify-content-start'>
                <label htmlFor='name' className='form-label d-flex flex-column align-items-start text-bold'>Name:</label>
                <input type='text' placeholder='Name' className='form-control' name='name' id='name' value={values.name} onChange={handleChange}></input>
                {formErrors.name && (
                    <p className="text-warning">{formErrors.name}</p>
                  )}
                </div>
                <div className='form-group mb-4'>
                <label htmlFor='email' className='form-label d-flex flex-column align-items-start'>Email:</label>
                <input type='email' placeholder='Email' className='form-control'name='email' id='email' value={values.email} onChange={handleChange}></input>
                {formErrors.email && <p className='text-warning'>{formErrors.email}</p>}
                </div>
                <div className='form-group mb-4'>
                <label htmlFor='password' className='form-label d-flex flex-column align-items-start'>Password:</label>
                <input type='password' placeholder='Password' className='form-control' name='password' id='password' value={values.password} onChange={handleChange}></input>
                {formErrors.password && <p className='text-warning'>{formErrors.password}</p>}
                </div>
                <div className='form-group mb-4'>
                <label htmlFor='confirmed-pass' className='form-label d-flex flex-column align-items-start'>Confirm Password:</label>
                <input type='password' placeholder='Confirm Password' name='confirmedPassword' id='confirmed-pass' className='form-control' value={values.confirmPassword} onChange={handleChange}></input>
                {formErrors.confirmedPassword && <p className='text-warning'>{formErrors.confirmedPassword}</p>}
                </div>
                <button type='submit' className='btn w-100 p-2' style={{backgroundColor: '#0F6E5A', color: 'white'}}>Register</button>
            </form>
        </div>
    )
}

export default SignUp;