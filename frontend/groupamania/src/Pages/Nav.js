import React from "react";
import { Link } from "react-router-dom";
import navImg from '../Images/icon-left-font.png';
import navStyle from '../Styles/navbar.module.css';

const Nav = () => {
    return (
        <nav className={navStyle.nav}>
            <div className="col-3">
            <img src={navImg} className={navStyle.img} alt='logo'/>
            </div>
            <ul className={navStyle.list}>
                <li><Link style={{color: 'black', textDecoration: 'none', marginRight: '20px'}} to='/'>SignUp</Link></li>
                <li className=""><Link style={{color: 'black', textDecoration: 'none'}} to='/login'>Login</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;