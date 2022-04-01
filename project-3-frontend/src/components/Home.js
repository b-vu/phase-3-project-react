import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Home = ({ isAuthenticated }) => {
    const { loginWithRedirect } = useAuth0();

    return(
    <div className="flex flex-col bg-gray-200 h-screen justify-center items-center">
      <h1 className="lg:text-8xl md:text-7xl sm:text-5xl text-3xl font-black mb-14">
        Get to workin'!
      </h1>
      {
          isAuthenticated ? 
            <Link to="/dashboard" className="text-white py-6 px-10 bg-blue-500 rounded-full text-3xl hover:bg-blue-600 flex items-center text" style={{ textDecoration: 'none' }}>
                Dashboard
            </Link>
            :
            <button className="text-white py-6 px-10 bg-blue-500 rounded-full text-2xl hover:bg-blue-600" onClick={() => loginWithRedirect()}>Log In</button>
      }
    </div>
    )
}

export default Home;