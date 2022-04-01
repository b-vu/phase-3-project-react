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
        picture: "",
        companyId: ""
    });
    const [companies, setCompanies] = useState([]);
    const [isCreatingACompany, setIsCreatingACompany] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetch("http://localhost:9292/companies")
        .then(res => res.json())
        .then(data => setCompanies(data));
    }, []);

    const handleChange = event => {
        if(event.target.value === "create"){
            setIsCreatingACompany(true);
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            })
        }
        else{
            setIsCreatingACompany(false);
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            })
        }
    }

    const handleInputChange = event => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = event => {
        event.preventDefault();

        if(isCreatingACompany){
            fetch("http://localhost:9292/create_company", {
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
            });
        }
        else{
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
    }

    return(
        <div className="container bg-gray-300 min-h-screen flex justify-center">
            <form onSubmit={handleSubmit}>
                <h1 className="font-medium">Let's finalize some details</h1>
                <input className="px-3 py-2 text-black border rounded-lg focus:outline w-full focus:border-blue-600 focus:outline-none mb-2" type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name"></input>
                <br></br>
                <input className="px-3 py-2 text-black border rounded-lg focus:outline w-full focus:border-blue-600 focus:outline-none mb-2" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name"></input>
                <br></br>
                <input className="px-3 py-2 text-black border rounded-lg focus:outline w-full focus:border-blue-600 focus:outline-none mb-2" type="text" name="picture" value={formData.picture} onChange={handleChange} placeholder="Picture"></input>
                <select className="px-3 py-2 text-black border rounded-lg focus:outline w-full focus:border-blue-600 focus:outline-none" onChange={handleChange} name="companyId" placeholder="Select Your Company" value={formData.companyId}>
                    <option value="" disabled>Select Your Company</option>
                    <option value="create">Create one</option>
                    {
                        companies.map(company => <option key={company.id} name="companyId" value={company.id}>{company.name}</option>)
                    }
                </select>
                <br></br>
                {
                    isCreatingACompany ?
                    <>
                        <input onChange={handleInputChange} name="newCompany" value={formData.companyName}></input>
                        <br></br>
                    </>
                    :
                    null
                }
                <button className="bg-blue-500 text-white px-2 py-2 font-medium rounded hover:bg-blue-600 mt-2 mr-2">Submit</button>
            </form>
        </div>
    )
}

export default FinishSignUp;