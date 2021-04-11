import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Landing from './landing/Landing.jsx';
import ClassroomRoot from './classroom/index.jsx';
import Auth from './auth/Auth.jsx';
import Account from './account/Account.jsx';
import NotFound from './not-found/NotFound.jsx';
import { DataStoreProvider } from './contexts/DataStoreProvider.jsx';
import { AxiosProvider } from './contexts/AxiosProvider.jsx';
import { ApiProvider } from './contexts/ApiProvider.jsx';
import ToastCenter from './ToastCenter.jsx';
import { ToastProvider } from './contexts/ToastProvider.jsx';


export default function App() {
  return (
    <React.StrictMode>
      <DataStoreProvider>
        <ToastProvider>
          <AxiosProvider>
            <ApiProvider>
              <ToastCenter />
              <Router>
                <div>
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
                </div>
              </Router>
            </ApiProvider>
          </AxiosProvider>
        </ToastProvider>
      </DataStoreProvider>

    </React.StrictMode>
  );
}
