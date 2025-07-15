import React, { useContext } from "react";
import { ProfileStyle, Button } from "./styles/Profile.styled";
import { MdBorderColor } from "react-icons/md";
import { FaHome, FaDoorOpen } from "react-icons/fa";
import style from '../Styles/profile.module.css';
import { Navbar, Dropdown, Col, NavbarBrand } from "react-bootstrap";
import navStyle from '../Styles/navbar.module.css';
import { useNavigate, useParams } from "react-router-dom";
import navImg from '../Images/EEC.png';
import NavBar from "./NavBar";
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';
import { follow, getCurrentUser, getFollowingCount, logout } from "../Services/userService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { deleteToken } from "../features/tokens/tokenSlice";

const Profile = ({ email, profileImg, changeModalState, username, followers, following, followed_user_id }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useParams();
  const token = useSelector(state => state.token);

  const userData = getCurrentUser(token);
  const following_user_id = userData?.userId;
  const userProfileName = userData?.username;

  const { data: followCount = 0 } = useQuery('followCount', () => getFollowingCount(followed_user_id, following_user_id), {
    enabled: !!followed_user_id && !!following_user_id
  });

  const followMutation = useMutation(follow, {
    onSuccess: () => {
      queryClient.invalidateQueries('followCount');
      queryClient.invalidateQueries('user');
    }
  });

  const handleFollow = () => {
    if (followCount > 0) {
      followMutation.mutate({ follow: 0, following_user_id, followed_user_id });
    } else {
      followMutation.mutate({ follow: 1, following_user_id, followed_user_id });
    }
  };

  const handleLogOut = () => {
    logout();
    dispatch(deleteToken());
    navigate("/Login");
  };

  return (
    <div style={{ backgroundColor: 'rgb(240, 236, 236)', height: '100vh' }}>
      <NavBar />
      <ProfileStyle style={{ backgroundColor: 'white', color: 'black' }}>
        <h1>User Profile</h1>
        <div className={style.imageDiv}>
          {username === userProfileName ? (
            <Tooltip title="Change Profile Image" position="top" arrow>
              <img src={profileImg || '/default-profile.png'} alt="profile" className={style.profileImg} onClick={changeModalState} />
            </Tooltip>
          ) : (
            <img src={profileImg || '/default-profile.png'} alt="profile" className={style.profileImg} />
          )}
        </div>
        <hr className={style.hr} />
        <div className={style.follow_section}>
          <div className={style.follow_box}>
            <span className={style.follow_text}>Followers</span>
            <span className={style.follow_count}>{followers}</span>
          </div>
          <div className={style.follow_box}>
            <span className={style.follow_text}>Following</span>
            <span className={style.follow_count}>{following}</span>
          </div>
        </div>

        {following_user_id !== followed_user_id && (
          followCount > 0 ? (
            <button className={style.following_button} onClick={handleFollow}>Following</button>
          ) : (
            <button className={style.follow_button} onClick={handleFollow}>Follow</button>
          )
        )}

        <div className={style.info}>
          <div>
            <span style={{ fontSize: '18px' }}>Username: {username}</span>
            {username === userProfileName && (
              <Tooltip title="Change Username" position="top" arrow>
                <MdBorderColor onClick={changeModalState} />
              </Tooltip>
            )}
          </div>
          <div>
            <span style={{ fontSize: '18px' }}>Email: {email}</span>
            {username === userProfileName && (
              <Tooltip title="Change Email" position="top" arrow>
                <MdBorderColor onClick={changeModalState} />
              </Tooltip>
            )}
          </div>
        </div>
      </ProfileStyle>
    </div>
  );
};

export default Profile;
