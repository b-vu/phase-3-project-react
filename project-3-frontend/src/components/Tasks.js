import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import Member from "./Member";
import Task from "./Task";

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
    const [teamData, setTeamData] = useState({
        teamId: "",
        title: ""
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
            setIsCreatingNewTask(false);
            setFormData({
                description: "",
                deadline: ""
            })
        });
    }

    const handleTeamChange = event => {
        setTeamData({
            ...teamData,
            [event.target.name]: event.target.value
        });
    }

    const handleTeamSubmit = event => {
        event.preventDefault();

        fetch(`http://localhost:9292/team/${employee.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                teamId: parseInt(teamData.teamId),
                title: teamData.title
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

    console.log(teamData)
    return(
        <div className="container mx-auto">
            {tasks.team ?
                <div>
                    <h1 className="font-medium">{tasks.team.name} tasks for {tasks.company.name}</h1>
                    {
                        tasks.team_tasks.filter(task => task.completed === false).map(task => {
                            return <Link className="" to={`/tasks/edit/${task.id}`} key={task.id}><Task task={task}></Task></Link>
                        })
                    }
                    <br></br>
                    <h1 className="font-medium">Your Personal Tasks</h1>
                    {
                        tasks.personal_tasks.filter(task => task.completed === false).map(task => {
                            return <Link to={`/tasks/edit/${task.id}`} key={task.id}><Task task={task}></Task></Link>
                        })
                    }

                    <br></br>
                    {
                        isCreatingNewTask ?
                        <div>
                            <form onSubmit={handleNewTaskSubmit}>
                                Description
                                <br></br>
                                <textarea className="resize px-3 py-2 text-black border rounded-lg focus:outline w-1/4 focus:border-blue-600 focus:outline-none" rows="4" placeholder="Description" onChange={handleFormDataChange} name="description" value={formData.description}></textarea>
                                <h1>Deadline</h1>
                                <br></br>
                                <input className="px-3 py-2 text-black border rounded-lg focus:outline w-1/4 focus:border-blue-600 focus:outline-none" placeholder="Date" onChange={handleFormDataChange} name="deadline" value={formData.deadline}></input>
                                <br></br>
                                <button className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600 mt-2">Submit</button>
                            </form>
                            <button className="bg-red-500 text-white px-2 py-2 font-medium rounded hover:bg-red-600 mt-2" onClick = {handleCreateNewTaskToggle}>Cancel</button>
                        </div>
                        :
                        <button className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600" onClick = {handleCreateNewTaskToggle}>Create New Task</button>
                    }
                    <br></br>
                    <br></br>

                    <h1 className="font-medium">Team Members</h1>
                    {
                        tasks.members.map(member => {
                            return <Member key={member.id} member={member}></Member>
                        })
                    }

                    <br></br>
                    
                    <div>
                        <h1 className="font-medium">Completed Tasks</h1>
                        <br></br>
                        {
                            tasks.team_tasks.filter(task => task.completed).map(task => {
                                return <Link to={`/tasks/edit/${task.id}`} key={task.id}><Task task={task}></Task></Link>
                            })
                        }
                    </div>
                </div>
            :
            <div>
                You are not on a team for {tasks.company}. Assign yourself one.
                <form onSubmit={handleTeamSubmit}>
                    {
                        <select onChange={handleTeamChange} placeholder="Select Your Team" name="teamId" value={teamData.teamId}>
                            <option value="" disabled>Select Your Team</option>
                            {
                                tasks.company_teams.map(team => {
                                    return <option key={team.id} value={team.id}>{team.name}</option>
                                })
                            }
                        </select>
                    }
                    <input onChange={handleTeamChange} placeholder="Job Title" name="title" value={teamData.title}></input>
                    <button>Submit</button>
                </form>
            </div>
            }
        </div>
    )
}

export default Tasks;