import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../Services/userService'

export default function ProtectedRoute({ children }) {
  const user = getCurrentUser()
  return user ? <>{children}</> : <Navigate to="/login" />;
}
