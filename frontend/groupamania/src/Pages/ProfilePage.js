import React from "react";
import Profile from "../Components/Profile";
import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import ProfileModal from "../Components/ProfileModal";

const ProfilePage = () => {

    const [user, setUser] = useState([]);
    const {userlogged} = useParams();
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        getUser()
    }, [])
    
     
      function getUser(){
        fetch(`http://localhost:3000/api/auth/${userlogged}`)
        .then(response => {
           return response.json()
        })
        .then(data => {
            setUser(data)
            console.log(user)
        })
        .catch(err => {
            console.log(err);
        });
    }
    

    return (
        <>
        <Profile  userlogged={user.name} email={user.email} profileImg={user.profileImg} changeModalState={() => modalOpen ? setModalOpen(false) : setModalOpen(true)}/>
        {modalOpen && <ProfileModal updateUser={setUser} closeModal={() => setModalOpen(false)} username={user.name} email={user.email} getUserData={getUser} profileImg={user.profileImg}/>}
        </>
    )
}

export default ProfilePage;