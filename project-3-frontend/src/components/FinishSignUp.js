import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const FinishSignUp = ({ employee }) => {
    const { loginWithRedirect } = useAuth0();

    if(!employee) {
        loginWithRedirect();
    }

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyId: ""
    });
    const [companies, setCompanies] = useState([]);
    const history = useHistory();

    useEffect(() => {
        fetch("http://localhost:9292/companies")
        .then(res => res.json())
        .then(data => setCompanies(data));
    }, []);

    const handleChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = event => {
        event.preventDefault();

        fetch("http://localhost:9292/submit_employee", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                form_data: formData,
                employee_data: employee
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            history.push("/");
        })
    }

    console.log(formData)

    return(
        <div>
            Let's finalize some details
            <br></br>
            <form onSubmit={handleSubmit}>
                First Name <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name"></input>
                <br></br>
                Last Name <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name"></input>
                <br></br>
                Company 
                <select onChange={handleChange} name="companyId" placeholder="Select Your Company" value={formData.companyId}>
                    <option value="" disabled>Select Your Company</option>
                    {
                        companies.map(company => <option key={company.id} name="companyId" value={company.id}>{company.name}</option>)
                    }
                </select>
                <br></br>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default FinishSignUp;