import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GroupChat from './GroupChat';

export default function GroupProfile({ groupId }) {
  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get(`/api/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setGroup(res.data));

    axios.get(`/api/groups/${groupId}/isMember`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setIsMember(res.data.isMember));
  }, [groupId]);

  const joinGroup = () => {
    axios.post(`/api/groups/${groupId}/join`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => setIsMember(true));
  };

  const leaveGroup = () => {
    axios.delete(`/api/groups/${groupId}/leave`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(() => setIsMember(false));
  };

  if (!group) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <img src={group.profileImg} alt="Group" className="w-24 h-24 rounded-full mb-4" />
      <h1 className="text-2xl">{group.name}</h1>
      <p className="mb-4">{group.description}</p>

      {isMember ? (
        <>
          <button onClick={leaveGroup} className="bg-red-500 text-white px-4 py-2 rounded mb-4">
            Leave Group
          </button>
          <GroupChat groupId={groupId} user={user} />
        </>
      ) : (
        <button onClick={joinGroup} className="bg-blue-500 text-white px-4 py-2 rounded">
          Join Group to Chat
        </button>
      )}
    </div>
  );
}
