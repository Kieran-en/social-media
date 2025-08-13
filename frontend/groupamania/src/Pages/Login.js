import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/userService';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToken } from '../features/tokens/tokenSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      const { token } = data;
      dispatch(setToken(token));
      localStorage.setItem('token', token);
      if (data.hasOwnProperty('token')) {
        navigate(`/timeline/${data.username}`);
      }
    },
  });

  const [values, setValues] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(values);
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '380px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0F6E5A' }}>
          Connexion
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '5px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#0F6E5A',
              color: 'white',
              width: '100%',
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
