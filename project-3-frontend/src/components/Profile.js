import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = ({ userInfo }) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if(!user) {
    loginWithRedirect();
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated ? (
      <div>
        <img src={userInfo.picture} alt={userInfo.name} />
        <h2>{userInfo.name}</h2>
        <p>{userInfo.email}</p>
      </div>
    )
    : null
  );
};

export default Profile;