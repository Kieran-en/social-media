import React from "react";
import Profile from "../Components/Profile";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import ProfileModal from "../Components/ProfileModal";

const ProfilePage = () => {

    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);    
     
      function getUser(){
        fetch(`http://localhost:3000/api/auth/${JSON.parse(localStorage.getItem('userData')).userId}`)
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
    }, [])
    

    return (
        <>
        <Profile  userlogged={user.name} email={user.email} profileImg={user.profileImg} changeModalState={() => modalOpen ? setModalOpen(false) : setModalOpen(true)}/>
        {modalOpen && <ProfileModal updateUser={setUser} closeModal={() => setModalOpen(false)} username={user.name} email={user.email} getUserData={getUser} profileImg={user.profileImg}/>}
        </>
    )
}

export default ProfilePage;