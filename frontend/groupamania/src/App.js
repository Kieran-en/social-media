import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './Pages/Signup';
import Login from './Pages/Login';
import Timeline from './Pages/Timeline';
import ErrorPage from './Pages/ErrorPage'
import ProfilePage from './Pages/ProfilePage'
import jwtDecode from 'jwt-decode'

function App() {


  try {
    const jwt = localStorage.getItem('token')
  const userData = jwtDecode(jwt)
  console.log(userData)

  } catch (error) {
    
  }

  return ( 
  <div className='App'>
    <BrowserRouter>
    <Routes>
      <Route path='/' index element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/timeline/:userlogged' element={<Timeline />} />
      <Route path='/profilepage/:userlogged' element={<ProfilePage/>} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
    </BrowserRouter>
  </div>
  
)}

export default App;
