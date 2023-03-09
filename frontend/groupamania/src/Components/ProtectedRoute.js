import React from 'react'
import { render } from 'react-dom'
import { Route, Redirect } from 'react-router-dom'
import { getCurrentUser } from '../Services/userService'

export default function ProtectedRoute({path, component: Component, ...rest}) {
  return (
    <Route path={path}
    {...rest}
    render={props => {
        if(!getCurrentUser) return <Redirect to='/login'/>
        return Component ? <Component {...props}/> : render(props)
    }} />
  )
}
