import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './Pages/Signup';
import Login from './Pages/Login';
import Timeline from './Pages/Timeline';
import ErrorPage from './Pages/ErrorPage'
import ProfilePage from './Pages/ProfilePage'
import ProtectedRoute from './Components/ProtectedRoute';
import MessagePage from './Pages/MessagePage';

function App() {

  return ( 
  <div className='App'>
    <BrowserRouter>
    <Routes>
      <Route path='/' index element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/timeline/:userlogged' element={
        <ProtectedRoute>
          <Timeline />
        </ProtectedRoute>
      } />
      <Route path='/profilepage/:user' element={
        <ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>} />
        <Route path='messages' element={
          <ProtectedRoute>
          <MessagePage />
        </ProtectedRoute>} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
    </BrowserRouter>
  </div>
)}

export default App;
