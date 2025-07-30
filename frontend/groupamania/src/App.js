import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './Pages/Signup';
import Login from './Pages/Login';
import Timeline from './Pages/Timeline';
import Admin from './Pages/Admin/Admin';
import ManageUsers from './Pages/Admin/Users';
import Groups from './Pages/Admin/Groups';
import Events from './Pages/Admin/Events';
import Stats from './Pages/Admin/Stats';
import ErrorPage from './Pages/ErrorPage'
import ProfilePage from './Pages/ProfilePage'
import ProtectedRoute from './Components/ProtectedRoute';
import MessagePage from './Pages/MessagePage';

function App() {

  return ( 
  <div className='App'>
    <BrowserRouter>
    <Routes>
      <Route path='/' index element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
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
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>} />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <ManageUsers />
        </ProtectedRoute>} />
      <Route path="/admin/groups" element={
        <ProtectedRoute>
          <Groups />
        </ProtectedRoute>} />
      <Route path="/admin/stats" element={
        <ProtectedRoute>
          <Stats />
        </ProtectedRoute>} />
      <Route path="/admin/events" element={
        <ProtectedRoute>
          <Events />
          </ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  </div>
)}

export default App;
