import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Tasks = ({ employee }) => {
    const [tasks, setTasks] = useState({
        team: null,
        company: "",
        company_teams: [],
        team_tasks: [],
        personal_tasks: [],
        members: []
    });
    const [isTeamSelected, setisTeamSelected] = useState(false);

    console.log("state: ", tasks);

    const { user, loginWithRedirect } = useAuth0();

    if(!user) {
        loginWithRedirect();
    }

    useEffect(() => {
        console.log("render")
        fetch(`http://localhost:9292/tasks/${employee.id}`)
        .then(res => res.json())
        .then(data => setTasks({
            ...data,
            company_teams: data.company_teams ? data.company_teams : tasks.company_teams,
            members: data.members ? data.members : tasks.members,
            personal_tasks: data.personal_tasks ? data.personal_tasks : tasks.personal_tasks,
            team_tasks: data.team_tasks ? data.team_tasks : tasks.team_tasks
        }))
    }, [employee.id, isTeamSelected]);

    const handleTeamClick = event => {
        fetch(`http://localhost:9292/team/${employee.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                teamID: parseInt(event.target.value)
            })
        })
        .then(res => res.json())
        .then(data => {
            setTasks({
                ...tasks,
                team: data.team_id
            })
            setisTeamSelected(true);
         });
    }

    return(
        <div>
            {tasks.team ?
                <div>
                    <h1>{tasks.team.name} tasks for {tasks.company.name}</h1>
                    {
                        tasks.team_tasks.map(task => {
                            return <Link to={`/tasks/edit/${task.id}`} key={task.id}>{task.description} Deadline: {task.deadline}<br/></Link>
                        })
                    }
                    <h1>Your Personal Tasks</h1>
                    {
                        tasks.personal_tasks.map(task => {
                            return <Link to={`/tasks/edit/${task.id}`} key={task.id}>{task.description} Deadline: {task.deadline}<br/></Link>
                        })
                    }

                    <br></br>
                    <button>Create New Task</button>
                    <br></br>
                    <br></br>

                    <h1>Members</h1>
                    {
                        tasks.members.map(member => {
                            return <div key={member.id}>{member.first_name} {member.last_name} ({member.email})</div>
                        })
                    }
                </div>
            :
            <div>
                You are not on a team for {tasks.company}. Assign yourself one.
                {
                    tasks.company_teams.map(team => {
                        return <div key={team.id}><button onClick={handleTeamClick} name="team" value={team.id}>{team.name}</button></div>
                    })
                }
            </div>
            }
        </div>
    )
}

export default Tasks;