import React from "react";
import { NavLink } from "react-router-dom";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const NavBar = ({ employee }) => {
    return(
        <nav>
            <NavLink to="/">Home </NavLink>
            {
                employee ?
                <>
                    <NavLink to="/dashboard">Dashboard </NavLink>
                    <NavLink to="/tasks">Tasks </NavLink>
                    <LogoutButton></LogoutButton>
                </>
                : <LoginButton></LoginButton>
            }
        </nav>
    )
}

export default NavBar;