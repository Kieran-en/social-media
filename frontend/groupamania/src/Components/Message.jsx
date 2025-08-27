import React from 'react';
import dayjs from 'dayjs';
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

// MODIFIED: Accept a 'sender' prop which is an object with user details
export default function Message({ own, text, timeSent, sender }) {

    // REMOVED: All logic that fetched the current user.
    // const token = useSelector(state => state.token)
    // const user = getCurrentUser(token)

    // Use the passed-in sender prop, with fallbacks just in case
    const senderName = sender?.username || 'User';
    const senderImage = sender?.profileImg || `https://ui-avatars.com/api/?name=${senderName}&background=random`;

    return (
        <div className={`flex ${own ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex ${own ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[70%]`}>
                <img
                    // MODIFIED: Use the profile image from the 'sender' prop
                    src={senderImage}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    alt={`${senderName}'s profile`}
                />
                <div className={`relative group ${
                    own
                        ? 'bg-gradient-to-br from-green-700 to-green-900 text-white'
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
    );
}