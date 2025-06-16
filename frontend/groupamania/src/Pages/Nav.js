import React from "react";
import { Link } from "react-router-dom";
import navImg from '../Images/EEC.png';
import navStyle from '../Styles/navbar.module.css';

const Nav = () => {
    return (
        <nav className={navStyle.nav}>
            <div className="col-3 p-3">
                 <img src={navImg} className={navStyle.img} alt='EEC Icon'/> Melen
            </div>
            <img src="" />
            <ul className={navStyle.list}>
                <li><Link style={{color: 'green', textDecoration: 'none', marginRight: '20px'}} to='/'>SignUp</Link></li>
                <li className=""><Link style={{color: 'green', textDecoration: 'none'}} to='/login'>Login</Link></li>
            </ul>
        </nav>
    )
}

export default Nav;