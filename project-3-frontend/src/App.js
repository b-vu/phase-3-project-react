import './App.css';
import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Switch, useHistory } from "react-router-dom";
import Profile from './components/Profile';
import NavBar from './components/NavBar';
import FinishSignUp from './components/FinishSignUp';
import People from './components/People';

const App = () => {
  const [userState, setUserState] = useState(null);
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
          setUserState(data);
          if(data.name.includes("@")){
            history.push("/finish_sign_up")
          }
        });
    }
  }, [isAuthenticated, user, history]);

  console.log(userState)

  return (
    <div>
      <NavBar user={userState}/>
      <Switch>
        <Route exact path="/profile">
          <Profile userInfo={userState}/>
        </Route>
        <Route exact path="/finish_sign_up">
          <FinishSignUp user={userState}/>
        </Route>
        <Route path="/">
          {
            userState ?
            <>
              Hello, {userState.name}
            </>
            : null
          }
          <People></People>
        </Route>
      </Switch>
    </div>
  );
}

export default App;