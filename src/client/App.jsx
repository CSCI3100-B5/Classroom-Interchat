import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from './landing/Landing.jsx';
import Classroom from './classroom/Classroom.jsx';
import Login from './login/Login.jsx';

export default function App() {
  return (
    <React.StrictMode>
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/classroom">
              <Classroom />
            </Route>
            <Route exact path="/">
              <Landing />
            </Route>
          </Switch>
        </div>
      </Router>
    </React.StrictMode>
  );
}
