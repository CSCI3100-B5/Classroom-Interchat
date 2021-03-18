import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import CreateClassroom from './CreateClassroom.jsx';
import JoinClassroom from './JoinClassroom.jsx';
import ClassroomSession from './session/ClassroomSession.jsx';

export default function ClassroomRoot() {
  const { path, url } = useRouteMatch();
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
        <Switch>
          <Route path={`${path}/join`}>
            <JoinClassroom />
          </Route>
          <Route path={`${path}/create`}>
            <CreateClassroom />
          </Route>
          <Route path={`${path}/id/:classroomId`}>
            <ClassroomSession />
          </Route>
          <Route path={path}>
            <Redirect to={`${url}/join`} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
