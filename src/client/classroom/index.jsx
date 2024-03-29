import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch
} from 'react-router-dom';
import CreateClassroom from './CreateClassroom.jsx';
import JoinClassroom from './JoinClassroom.jsx';
import ClassroomSession from './session/ClassroomSession.jsx';
import { SocketProvider } from '../contexts/SocketProvider.jsx';
import { RealtimeProvider } from '../contexts/RealtimeProvider.jsx';

/**
 * A router switch for /classroom routes to render different pages
 * depending on the URL
 * Socket.io context providers are created here
 */
export default function ClassroomRoot() {
  const { path, url } = useRouteMatch();
  return (
    <SocketProvider>
      <RealtimeProvider>
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
            <Route path={`${path}/session`}>
              <ClassroomSession />
            </Route>
            <Route path={path}>
              <Redirect to={`${url}/join`} />
            </Route>
          </Switch>
        </div>
      </RealtimeProvider>
    </SocketProvider>
  );
}
