import React from 'react'
import OnlineUser from './OnlineUser'
import { Users, UserX } from 'lucide-react'

function OnlineSection({onlineUsers}) {
  return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-green-500" />
          <h3 className="font-bold text-gray-800">Friends Online</h3>
          {onlineUsers && onlineUsers.length > 0 && (
              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
            {onlineUsers.length}
          </span>
          )}
        </div>

        {onlineUsers && onlineUsers.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {onlineUsers.map(user => (
                  <OnlineUser
                      key={user.id}
                      username={user.name}
                      profileImg={user.profileImg}
                  />
              ))}
            </div>
        ) : (
            <div className="text-center py-8">
              <UserX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No friends online</p>
              <p className="text-gray-400 text-xs mt-1">They'll appear here when active</p>
            </div>
        )}
      </div>
  )
}

export default OnlineSection