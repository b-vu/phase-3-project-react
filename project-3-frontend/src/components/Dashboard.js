import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import People from "./People";

const Dashboard = ({ employee }) => {
  const { user, isLoading, loginWithRedirect } = useAuth0();

  if(!user) {
    loginWithRedirect();
  }

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9292/dashboard/${employee.id}`)
    .then(res => res.json())
    .then(data => setUserInfo(data));
  }, []);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log(userInfo)

  return (
    userInfo ? (
      <div>
        <h2>{employee.first_name}</h2>
        <p>{employee.email}</p>
        <p>Your Company: {userInfo.company.company_info.name}</p>
        {
          userInfo.employee.team_id ?
          <p>Your team: </p>
          :
          <p>You are not on a team for {userInfo.company.company_info.name}. Assign yourself one.
          </p>
        }
        <People></People>
      </div>
    )
    : null
  );
};

export default Dashboard;