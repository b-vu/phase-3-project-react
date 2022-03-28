import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const FinishSignUp = ({ user }) => {
    const { loginWithRedirect } = useAuth0();

    if(!user) {
        loginWithRedirect();
    }

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: ""
    });
    const history = useHistory();

    const handleChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = event => {
        event.preventDefault();

        fetch("http://localhost:9292/submit_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                form_data: formData,
                user_data: user
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            history.push("/");
        })
    }
    return(
        <div>
            Let's finalize some details
            <br></br>
            <form onSubmit={handleSubmit}>
                First Name <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name"></input>
                <br></br>
                Last Name <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name"></input>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default FinishSignUp;