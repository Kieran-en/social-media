import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './Pages/Signup';
import Login from './Pages/Login';
import Timeline from './Pages/Timeline';
import ErrorPage from './Pages/ErrorPage'
import ProfilePage from './Pages/ProfilePage'
import { AuthContext } from './Context/AuthContext';
import { getCurrentUser } from './Services/userService';

function App() {

  //const userContext = userContext(AuthContext)
  const userData = getCurrentUser();

  return ( 
    <AuthContext.Provider value={userData}>
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
  </AuthContext.Provider>
)}

export default App;
