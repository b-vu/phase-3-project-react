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
    const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        deadline: ""
    });

    console.log("state: ", tasks);

    const { user, loginWithRedirect } = useAuth0();

    if(!user) {
        loginWithRedirect();
    }

    useEffect(() => {
        fetch(`http://localhost:9292/tasks/${employee.id}`)
        .then(res => res.json())
        .then(data => setTasks({
            ...data,
            company_teams: data.company_teams ? data.company_teams : tasks.company_teams,
            members: data.members ? data.members : tasks.members,
            personal_tasks: data.personal_tasks ? data.personal_tasks : tasks.personal_tasks,
            team_tasks: data.team_tasks ? data.team_tasks : tasks.team_tasks
        }))
    }, [employee.id, isTeamSelected, isCreatingNewTask]);

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

    const handleCreateNewTaskToggle = () => {
        setIsCreatingNewTask(!isCreatingNewTask);
    }

    const handleFormDataChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleNewTaskSubmit = event => {
        event.preventDefault();

        fetch("http://localhost:9292/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                team_id: tasks.team.id
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setIsCreatingNewTask(false);
        });
    }

    return(
        <div className="container mx-auto">
            {tasks.team ?
                <div>
                    <h1>{tasks.team.name} tasks for {tasks.company.name}</h1>
                    {
                        tasks.team_tasks.filter(task => task.completed === false).map(task => {
                            return <Link to={`/tasks/edit/${task.id}`} key={task.id}>{task.description} Deadline: {task.deadline}<br/></Link>
                        })
                    }
                    <h1>Your Personal Tasks</h1>
                    {
                        tasks.personal_tasks.filter(task => task.completed === false).map(task => {
                            return <Link to={`/tasks/edit/${task.id}`} key={task.id}>{task.description} Deadline: {task.deadline}<br/></Link>
                        })
                    }

                    <br></br>
                    {
                        isCreatingNewTask ?
                        <div>
                            <form onSubmit={handleNewTaskSubmit}>
                                Description
                                <br></br>
                                <textarea placeholder="Description" onChange={handleFormDataChange} name="description" value={formData.description}></textarea>
                                <br></br>
                                Deadline
                                <br></br>
                                <input placeholder="Date" onChange={handleFormDataChange} name="deadline" value={formData.deadline}></input>
                                <br></br>
                                <button>Submit</button>
                            </form>
                            <button onClick = {handleCreateNewTaskToggle}>Cancel</button>
                        </div>
                        :
                        <button onClick = {handleCreateNewTaskToggle}>Create New Task</button>
                    }
                    <br></br>
                    <br></br>

                    <h1>Members</h1>
                    {
                        tasks.members.map(member => {
                            return <div key={member.id}>{member.first_name} {member.last_name} ({member.email})</div>
                        })
                    }

                    <br></br>
                    
                    <div>
                        Completed Tasks
                        <br></br>
                        {
                            tasks.team_tasks.filter(task => task.completed).map(task => {
                                return <Link to={`/tasks/edit/${task.id}`} key={task.id}>{task.description}<br/></Link>
                            })
                        }
                    </div>
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