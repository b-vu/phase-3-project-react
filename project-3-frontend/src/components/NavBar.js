import React from "react";
import { NavLink } from "react-router-dom";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const NavBar = ({ employee }) => {
    return(
      <nav
        className="flex justify-between items-center h-16 bg-blue-500 text-white relative shadow-md"
        role="navigation"
      >
        <NavLink to="/" className="pl-8 text-white" style={{ textDecoration: 'none' }}>
          Workflow
        </NavLink>
        <div className="px-4 cursor-pointer md:hidden">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <div className="pr-8 md:block hidden">
            {
                employee ?
                <>
                <NavLink to="/dashboard" className="p-4 text-white" style={{ textDecoration: 'none' }}>
                    Dashboard
                </NavLink>
                <NavLink to="/tasks" className="p-4 text-white" style={{ textDecoration: 'none' }}>
                    Tasks
                </NavLink>
                <LogoutButton></LogoutButton>
                </>
                : 
                <LoginButton></LoginButton>
            }
        </div>
      </nav>
    )
}

export default NavBar;