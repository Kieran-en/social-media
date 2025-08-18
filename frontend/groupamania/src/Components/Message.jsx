import React from 'react'
import { getCurrentUser } from '../Services/userService'
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

export default function Message({ own, text, timeSent }) {
    const token = useSelector(state => state.token)
    const user = getCurrentUser(token)

    return (
        <div className={`flex ${own ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex ${own ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[70%]`}>
                <img
                    src={user.profileImg || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    alt="profile"
                />
                <div className={`relative group ${
                    own
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                } rounded-2xl px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-200`}>
                    <p className="text-sm leading-relaxed">{text}</p>
                    <span className={`text-xs ${
                        own ? 'text-blue-100' : 'text-gray-500'
                    } mt-1 block`}>
                        {dayjs(timeSent).fromNow()}
                    </span>
                </div>
            </div>
        </div>
    )
}