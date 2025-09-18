import React, { useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import Conversation from './Conversation'

function FriendSection({friends, socket}) {
    const [search, setSearch] = useState('')

    const onChange = (event) => {
        setSearch(event.target.value)
    }

    // Filtrer les amis selon la recherche
    const filteredFriends = friends && friends.length > 0 
        ? friends.filter(friend => 
            friend.name.toLowerCase().includes(search.toLowerCase())
          )
        : []

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    value={search} 
                    onChange={onChange} 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Rechercher des amis..."
                />
            </div>
        </div>
        
        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredFriends.length > 0 ? (
            <div className="divide-y divide-gray-100">
                {filteredFriends.map(friend => (
                    <Conversation 
                        key={friend && friend.id}
                        receiverId={friend && friend.id} 
                        name={friend && friend.name} 
                        profileImg={friend && friend.profileImg} 
                        socket={socket} 
                    />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                    {search ? 'Aucun ami trouvé' : 'Aucun ami disponible'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    {search ? 'Essayez un autre terme de recherche' : 'Ajoutez des amis pour commencer à discuter !'}
                </p>
            </div>
          )}
        </div>
    </div>
  )
}

export default FriendSection