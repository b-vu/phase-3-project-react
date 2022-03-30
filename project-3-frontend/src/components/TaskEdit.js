import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TaskEdit = () => {
    const [task, setTask] = useState(null);
    const [formData, setFormData] = useState({
        description: "",
        deadline: "",
        edit: false
    });

    console.log(task);

    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:9292/tasks/edit/${id}`)
        .then(res => res.json())
        .then(data => {
            setTask(data)
            setFormData({
                ...formData,
                description: data.task.description,
                deadline: data.task.deadline
            })
        });
    }, [id]);

    const handleRemoveMember = event => {
        const employeeId = parseInt(event.target.parentNode.id);

        const newMembers = task.members.filter(member => member.id !== employeeId);

        const newTeamMembers = task.members.filter(member => member.id === employeeId);
        const newTeamMembersArray = task.team_members.concat(newTeamMembers);

        fetch(`http://localhost:9292/tasks/edit/${id}/${employeeId}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => setTask({
            ...task,
            members: newMembers,
            team_members: newTeamMembersArray
        }));
    }

    const handleAddMember = event => {
        const employeeId = parseInt(event.target.parentNode.id);

        const newMembers = task.team_members.filter(member => member.id === employeeId);
        const newMembersArray = task.members.concat(newMembers)

        const newTeamMembers = task.team_members.filter(member => member.id !== employeeId);

        fetch("http://localhost:9292/tasks/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskID: task.task.id,
                employeeID: employeeId,
                teamID: task.task.team_id
            })
        })
        .then(res => res.json())
        .then(data => setTask({
            ...task,
            members: newMembersArray,
            team_members: newTeamMembers
        }));
    }

    const handleDescEdit = () => {
        setFormData({
            ...formData,
            description: task.task.description,
            deadline: task.task.deadline,
            edit: !formData.edit
        });
    }

    const handleFormChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = event => {
        event.preventDefault();

        fetch(`http://localhost:9292/tasks/edit/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: formData.description,
                deadline: formData.deadline
            })
        })
        .then(res => res.json())
        .then(data => {
            setFormData({
                ...formData,
                description: data.description,
                deadline: data.deadline,
                edit: false
            });
            
            setTask({
                ...task,
                task: {
                    ...task.task,
                    description: data.description,
                    deadline: data.deadline
                }
            })
    });
    }

    console.log(formData)

    return(
        <div>
            {
                task ?
                <div>
                    {
                        formData.edit ?
                        <form onSubmit={handleSubmit}>
                            <textarea onChange={handleFormChange} name="description" value={formData.description}></textarea>
                            <br></br>
                            <input onChange={handleFormChange} name="deadline" value={formData.deadline}></input>
                            <button>Edit</button>
                        </form>
                        :
                        <div>
                            {task.task.description}
                            <br></br>
                            {task.task.deadline}
                            <br></br>
                            <button onClick={handleDescEdit}>Edit</button>
                        </div>
                    }

                    <br></br>
                    <h1>Current Assigned Members</h1>
                    {
                        task.members.map(member => {
                            return <div key={member.id} id={member.id}>{member.first_name} {member.last_name} ({member.email}) <button onClick={handleRemoveMember}>Remove</button></div>
                        })
                    }

                    <h1>Add Team Members</h1>
                    {
                        task.team_members.map(member => {
                            return <div key={member.id} id={member.id}>{member.first_name} {member.last_name} ({member.email}) <button onClick={handleAddMember}>Add</button></div>
                        })
                    }
                </div>
                :null
            }
        </div>
    )
}

export default TaskEdit;