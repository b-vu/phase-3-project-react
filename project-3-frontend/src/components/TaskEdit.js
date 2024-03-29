import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateNote from "../modals/createNote";
import Note from "./Note";

const TaskEdit = () => {
    const [notes, setNotes] = useState([])
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

    useEffect(() => {
        fetch(`http://localhost:9292/notes/${id}`)
        .then(rsp => rsp.json())
        .then(data => setNotes(data))
    }, [])

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

    const handleCompleteTask = () => {
        fetch(`http://localhost:9292/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !task.task.completed
            })
        })
        .then(res => res.json())
        .then(data => setTask({
            ...task,
            task: data
        }));
    }
    const [modal, setModal] = useState(false)

    const toggle = () => {
        setModal(!modal)
    }

    return(
        <div className="container min-h-screen bg-gray-300">
            {
                task ?
                <div>
                    {
                        formData.edit ?
                        <form onSubmit={handleSubmit}>
                            <textarea onChange={handleFormChange} name="description" value={formData.description} className="resize px-3 py-2 text-black border rounded-lg focus:outline w-96 focus:border-blue-600 focus:outline-none mt-3" rows="4"></textarea>
                            <br></br>
                            <input onChange={handleFormChange} name="deadline" value={formData.deadline} className="px-3 py-2 text-black border rounded-lg focus:outline w-96 focus:border-blue-600 focus:outline-none"></input>
                            <br></br>
                            <button className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600 mt-2 mb-2">Edit</button>
                        </form>
                        :
                        <div>
                            <h1>{task.task.description}</h1>
                            <h1 className="font-medium">Deadline: {task.task.deadline}</h1>
                            <button onClick={handleDescEdit} className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600 mb-2">Edit</button>
                            
                        </div>
                    }

                    {notes.map((note) => <Note note={note} />)}
                    <button onClick={() => setModal(true)} className="bg-red-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600 mb-2">Add Note</button>
                            <CreateNote notes={notes} setNotes={setNotes} task={task} toggle={toggle} modal={modal}/>

                    {

                        task.task.completed ?
                        <button onClick={handleCompleteTask} className="bg-green-500 text-white px-2 py-2 font-medium rounded hover:bg-red-600">Task Completed</button>
                        :
                        <button onClick={handleCompleteTask} className="bg-red-500 text-white px-2 py-2 font-medium rounded hover:bg-green-600">Incomplete</button>
                    }
                    <div className="grid grid-cols-2 mb-4 gap-5">
                        <div>
                            <h1 className="font-medium">Current Assigned Members</h1>
                            {
                                task.members.map(member => {
                                    return <div className="m-auto pb-2" key={member.id}>
                                        <div className="flex bg-gray-200 max-w-sm shadow-lg py-4 px-10 md:px-8 rounded-md">
                                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                                <img className="rounded-full border-4 border-gray-300 h-24 w-24 mx-auto" src={member.picture} alt={member.first_name}/>
                                                <div className="flex-col md:text-left" id={member.id}>
                                                    <div className="font-medium text-lg text-gray-800">{member.first_name} {member.last_name}</div>
                                                    <div className="text-gray-800 whitespace-nowrap">{member.title}</div>
                                                    <div className="text-gray-800 whitespace-nowrap">{member.email}</div>
                                                    <button className="bg-red-500 text-white px-1 font-medium rounded hover:bg-red-600" onClick={handleRemoveMember}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div>
                            <h1 className="font-medium">Add Team Members</h1>
                            {
                                task.team_members.map(member => {
                                    return <div className="m-auto pb-2" key={member.id}>
                                        <div className="flex bg-gray-200 max-w-sm shadow-lg py-4 px-10 md:px-8 rounded-md">
                                            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                                <img className="rounded-full border-4 border-gray-300 h-24 w-24 mx-auto" src={member.picture} alt={member.first_name}/>
                                                <div className=" flex-col md:text-left" id={member.id}>
                                                    <div className="font-medium text-lg text-gray-800">{member.first_name} {member.last_name}</div>
                                                    <div className="text-gray-800 whitespace-nowrap">{member.title}</div>
                                                    <div className="text-gray-800 whitespace-nowrap">{member.email}</div>
                                                    <button className="bg-green-500 text-white px-1 font-medium rounded hover:bg-green-600" onClick={handleAddMember}>Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                :null
            }
        </div>
    )
}

export default TaskEdit;