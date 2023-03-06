import React from "react";
import Profile from "../Components/Profile";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import ProfileModal from "../Components/ProfileModal";
import { useQuery } from "react-query";
import { getUser } from "../Services/userService";

const ProfilePage = () => {

    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);    
    const userId = JSON.parse(localStorage.getItem('userData')).userId
    const {error, data : userData, status} = useQuery(['user', userId], getUser)
     
      /**function getUser(){
        fetch(`http://localhost:3000/api/auth/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log(user)
            setUser(data)
        })
        .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getUser()
    }, [])*/
    

    return (
        <>
        <Profile  userlogged={userData.name} email={userData.email} profileImg={userData.profileImg} changeModalState={() => modalOpen ? setModalOpen(false) : setModalOpen(true)}/>
        {modalOpen && <ProfileModal closeModal={() => setModalOpen(false)} username={userData.name} email={userData.email} profileImg={userData.profileImg}/>}
        </>
    )
}

export default ProfilePage;