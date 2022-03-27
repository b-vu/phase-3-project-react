import './App.css';
import { useState, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';

const App = () => {
  const [data, setData] = useState(null);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    fetch("http://localhost:9292/")
    .then(res => res.json())
    .then(data => {
      setData(data);
    });
  }, []);

  return (
    <div>
      {data ? data.message : null}
      {isAuthenticated ?
        <>
          <LogoutButton />
          <Profile user={user}/>
        </>
        : <LoginButton />}
    </div>
  );
}

export default App;

