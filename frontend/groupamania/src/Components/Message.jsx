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
        <div className={`flex ${own ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`flex ${own ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[85%] sm:max-w-[75%] md:max-w-[70%]`}>
                <img
                    src={senderImage}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                    alt={`${senderName}'s profile`}
                />
                <div className={`relative group ${
                    own
                        ? 'bg-gradient-to-br from-green-600 to-green-800 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                } rounded-2xl px-3 py-2 sm:px-4 sm:py-2 shadow-sm hover:shadow-md transition-all duration-200`}>
                    <p className="text-sm sm:text-base leading-relaxed break-words">{text}</p>
                    <span className={`text-xs ${
                        own ? 'text-green-100' : 'text-gray-400'
                    } mt-1 block`}>
                        {dayjs(timeSent).fromNow()}
                    </span>
                </div>
            </div>
        </div>
    );
}