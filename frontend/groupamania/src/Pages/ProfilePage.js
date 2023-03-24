import React from "react";
import Profile from "../Components/Profile";
import { useState } from "react";
import ProfileModal from "../Components/ProfileModal";
import { useQuery } from "react-query";
import { getUser } from "../Services/userService";
import { useParams } from "react-router-dom";

const ProfilePage = () => {

    const [modalOpen, setModalOpen] = useState(false);    
    const {user} = useParams()
    const {error, data : userPageData, status} = useQuery(['user'], () => getUser(user)) 

    return (
        <>
        <Profile  username={userPageData && userPageData.name} 
        email={userPageData && userPageData.email} 
        followed_user_id = {userPageData && userPageData.id}
        followers = {userPageData && userPageData.followers} 
        following = {userPageData && userPageData.following}
        profileImg={userPageData && userPageData.profileImg} 
        changeModalState={() => modalOpen ? setModalOpen(false) : setModalOpen(true)}/>
        {modalOpen && <ProfileModal closeModal={() => setModalOpen(false)} 
        username={userPageData && userPageData.name} email={ userPageData && userPageData.email}
         profileImg={ userPageData && userPageData.profileImg}
         />}
        </>
    )
}

export default ProfilePage;