import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { DataStoreProvider } from './contexts/DataStoreProvider.jsx';
import { AxiosProvider } from './contexts/AxiosProvider.jsx';
import { ApiProvider } from './contexts/ApiProvider.jsx';
import ToastCenter from './ToastCenter.jsx';
import { ToastProvider } from './contexts/ToastProvider.jsx';

const Landing = lazy(() => import('./landing/Landing.jsx'));
const ClassroomRoot = lazy(() => import('./classroom/index.jsx'));
const Auth = lazy(() => import('./auth/Auth.jsx'));
const Account = lazy(() => import('./account/Account.jsx'));
const NotFound = lazy(() => import('./not-found/NotFound.jsx'));


export default function App() {
  return (
    // Turning strict mode off since react-bootstrap is still using findDOMNode
    // <React.StrictMode>
    <DataStoreProvider>
      <ToastProvider>
        <AxiosProvider>
          <ApiProvider>
            <ToastCenter />
            <Router>
              <Suspense fallback={(
                <div className="splash-container">
                  <img className="splash-icon" src="/favicon.svg" alt="Page loading" />
                </div>
                  )}
              >
                {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
                <Switch>
                  <Route path="/auth">
                    <Auth />
                  </Route>
                  <Route path="/account">
                    <Account />
                  </Route>
                  <Route path="/classroom">
                    <ClassroomRoot />
                  </Route>
                  <Route exact path="/">
                    <Landing />
                  </Route>
                  {/* This is the 404 route */}
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
              </Suspense>
            </Router>
          </ApiProvider>
        </AxiosProvider>
      </ToastProvider>
    </DataStoreProvider>
    // </React.StrictMode>
  );
}
