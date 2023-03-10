import React from 'react'
import { render } from 'react-dom'
import { Route, Navigate } from 'react-router-dom'
import { getCurrentUser } from '../Services/userService'

export default function ProtectedRoute({path, element: Component, children, ...rest}) {
  return (
    <Route path={path}
    {...rest}
    render={props => {
        if(!getCurrentUser) return <Navigate to='/login'/>
        {/**return Component ? <Component {...props}/> : render(props) */}
        return {children}
    }} />
  )
}
