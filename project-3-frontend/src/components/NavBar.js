import React from "react";
import { NavLink } from "react-router-dom";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const NavBar = ({ user }) => {
    return(
        <nav>
            <NavLink to="/">Home</NavLink>
            {
                user ?
                <>
                    <NavLink to="/profile">Profile</NavLink>
                    <LogoutButton></LogoutButton>
                </>
                : <LoginButton></LoginButton>
            }
        </nav>
    )
}

export default NavBar;