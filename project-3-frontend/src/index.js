import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
        domain='dev-e6ujjn3b.us.auth0.com'
        clientId='9iUn0B7TZIiF5oKjdOlFyEJivnKykuWb'
        redirectUri='http://localhost:3000/'
      >
        <App />
      </Auth0Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);