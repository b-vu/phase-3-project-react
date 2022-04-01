import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Member from "./Member";

const Dashboard = ({ employee }) => {
  const { user, isLoading, loginWithRedirect } = useAuth0();

  if(!user) {
    loginWithRedirect();
  }

  const [userInfo, setUserInfo] = useState(null);
  const [isCreatingNewTeam, setIsCreatingNewTeam] = useState(false);
  const [formData, setFormData] = useState({
    teamName: ""
  });

  useEffect(() => {
    fetch(`http://localhost:9292/dashboard/${employee.id}`)
    .then(res => res.json())
    .then(data => setUserInfo(data));
  }, [isCreatingNewTeam]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const handleToggleCreateNewTeam = () => {
    setIsCreatingNewTeam(!isCreatingNewTeam);
  }

  const handleFormChange = event => {
    setFormData({
      [event.target.name]: event.target.value
    });
  }

  const handleFormSubmit = event => {
    event.preventDefault();
    
    fetch("http://localhost:9292/create_team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teamName: formData.teamName,
        companyId: userInfo.employee.company_id
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setIsCreatingNewTeam(false);
    });
  }

  console.log(userInfo);

  return (
    userInfo ? (
      <div className="container min-h-screen bg-gray-300">
        <h1 className="font-medium">{employee.first_name} {employee.last_name}</h1>
        <h2>{employee.email}</h2>
        {
          userInfo.employee.team_id ?
          <p>
            {userInfo.company.company_info.name} - {userInfo.company.teams.filter(team => team.id === userInfo.employee.team_id)[0].name}
            <br></br>
            {userInfo.employee.title}
          </p>
          :
          <p>You are not on a team for {userInfo.company.company_info.name}.</p>
        }
        <div className="">
          <h1 className="font-medium">{userInfo.company.company_info.name} Teams</h1>
          {
            isCreatingNewTeam ?
            <div>
              <form onSubmit={handleFormSubmit}>
                <input className="px-3 py-2 text-black border rounded-lg focus:outline w-96 focus:border-blue-600 focus:outline-none mb-2" placeholder="Team Name" onChange={handleFormChange} name="teamName" value={formData.teamName}></input>
                <br></br>
                <button className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600 mr-2">Create Team</button>
                <button onClick={handleToggleCreateNewTeam} className="bg-red-500 text-white px-2 py-2 font-medium rounded hover:bg-red-600">Cancel</button>
              </form>
            </div>
            :
            <button onClick={handleToggleCreateNewTeam} className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600">Create Team</button>
          }
          <br></br>
          <div className="flex columns-3 gap-5">
            {
              userInfo.company.teams.map(team => {
                return <div className="column" key={team.id}>
                  <h1 className="font-medium">{team.name}</h1>
                  {userInfo.employees.filter(e => e.team_id === team.id).map(e =>{
                    return <Member key={e.id} member={e}></Member>
                  })}
                  <br></br>
                </div>
              })
            }
          </div>
        </div>
      </div>
    )
    : null
  );
};

export default Dashboard;