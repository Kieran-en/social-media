import React from "react";
import Profile from "../Components/Profile";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileModal from "../Components/ProfileModal";
import { useQuery } from "react-query";
import { getUser } from "../Services/userService";

const ProfilePage = () => {

    const [modalOpen, setModalOpen] = useState(false);    
    const userId = JSON.parse(localStorage.getItem('userData')).userId
    const {error, data : userData, status} = useQuery(['user', userId], () => getUser(userId))

    return (
        <>
        <Profile  userlogged={userData && userData.name} email={userData && userData.email} profileImg={userData && userData.profileImg} changeModalState={() => modalOpen ? setModalOpen(false) : setModalOpen(true)}/>
        {modalOpen && <ProfileModal closeModal={() => setModalOpen(false)} username={userData && userData.name} email={ userData && userData.email} profileImg={ userData && userData.profileImg}/>}
        </>
    )
}

export default ProfilePage;