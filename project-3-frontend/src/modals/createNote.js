import React, {useState} from 'react';
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from 'reactstrap';

const CreateNote = ({modal, toggle, task}) => {
    const [description, setDescription] = useState('')

    const handleChange = (e) => {
        const {name, value} = e.target

        if(name === "description"){
            
            setDescription(value)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const email = JSON.parse(localStorage.getItem("@@auth0spajs@@::9iUn0B7TZIiF5oKjdOlFyEJivnKykuWb::default::openid profile email")).body.decodedToken.user.email

        fetch("http://localhost:9292/notes", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                description: description,
                email: email,
                task_id: task.task.id
            })
        })
        .then(resp => resp.json())
        .then(console.log("hold"))
    }
    
    return (
      <div>
        <Modal isOpen={modal}>
          <ModalHeader toggle={toggle}>
            New Note
          </ModalHeader>
          <ModalBody>
            <form>
                
                <div className = 'form-group'>
                    <label>Description</label>
                    <textarea className="form-control" rows="2" value={description} onChange={handleChange} name="description"></textarea>
                </div>

            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleSubmit}>
              Create
            </Button>{" "}
            <Button onClick={() => toggle(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
};


export default CreateNote;