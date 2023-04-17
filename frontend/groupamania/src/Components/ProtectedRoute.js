import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../Services/userService'

export default function ProtectedRoute({ children }) {
  const token = useSelector(state => state.token)
  //console.log("protect", token)
  const user = getCurrentUser(token)
  //console.log("Protect", user)
  return user ? <>{children}</> : <Navigate to="/login" />;
}
