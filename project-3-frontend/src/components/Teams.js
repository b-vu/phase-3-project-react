import React, {useState, useEffect} from 'react'

function Teams() {

    const [teams, setTeams] = useState([])

    useEffect(() => {
        fetch('http://localhost:9292/teams')
        .then(resp => resp.json())
        .then(data => setTeams(data))
    }, [])

    const aTeam = teams.map((team) => team.name)
    console.log(aTeam)

    return (
        <div>{aTeam}</div>
    )
}

export default Teams