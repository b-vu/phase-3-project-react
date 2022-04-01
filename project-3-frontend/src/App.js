import './App.css';
import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Switch, useHistory } from "react-router-dom";
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import FinishSignUp from './components/FinishSignUp';
import Tasks from './components/Tasks';
import TaskEdit from './components/TaskEdit';
import Teams from './components/Teams'


const App = () => {
  const [employeeState, setEmployeeState] = useState(null);
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated) {
      fetch("http://localhost:9292/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(data => {
          setEmployeeState(data);
          if(data.first_name.includes("@")){
            history.push("/finish_sign_up")
          }
        });
    }
  }, [isAuthenticated, user, history]);

  console.log(employeeState)

  return (
    <div class="font-mono">
      <NavBar employee={employeeState}/>
      <Switch>
        <Route exact path="/dashboard">
          <Dashboard employee={employeeState}/>
        </Route>
        <Route exact path="/tasks">
          <Tasks employee={employeeState}></Tasks>
        </Route>
        <Route exact path="/teams">
          <Teams></Teams>
        </Route>
        <Route exact path="/tasks/edit/:id">
          <TaskEdit></TaskEdit>
        </Route>
        <Route exact path="/finish_sign_up">
          <FinishSignUp employee={employeeState}/>
        </Route>
        <Route path="/">
          
        </Route>
      </Switch>
    </div>
  );
}

export default App;