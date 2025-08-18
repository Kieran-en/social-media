import React from 'react'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../Services/userService'

function OnlineUser({username, profileImg}) {
  const token = useSelector(state => state.token)
  const user = getCurrentUser(token)

  return (
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer group">
        <div className="relative">
          <img
              src={profileImg || `https://ui-avatars.com/api/?name=${username}&background=random`}
              alt={username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 truncate">{username}</p>
          <p className="text-xs text-green-500">Active now</p>
        </div>
      </div>
  )
}

export default OnlineUser