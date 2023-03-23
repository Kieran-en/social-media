import React from "react";
import Profile from "../Components/Profile";
import { useState } from "react";
import ProfileModal from "../Components/ProfileModal";
import { useQuery } from "react-query";
import { getUser } from "../Services/userService";
import { useParams } from "react-router-dom";

const ProfilePage = () => {

    const [modalOpen, setModalOpen] = useState(false);    
    const {userlogged} = useParams()
    const {error, data : userData, status} = useQuery(['user'], () => getUser(userlogged))
    console.log(userData)

    return (
        <>
        <Profile  userlogged={userData && userData.name} 
        email={userData && userData.email} 
        followers = {userData && userData.followers} 
        following = {userData && userData.following}
        profileImg={userData && userData.profileImg} 
        changeModalState={() => modalOpen ? setModalOpen(false) : setModalOpen(true)}/>
        {modalOpen && <ProfileModal closeModal={() => setModalOpen(false)} 
        username={userData && userData.name} email={ userData && userData.email}
         profileImg={ userData && userData.profileImg}
         />}
        </>
    )
}

export default ProfilePage;