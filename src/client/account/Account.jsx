import React, { useEffect } from 'react';
import {
  Row, Col, Tab, Button, Navbar, Nav
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LaunchApp from './LaunchApp.jsx';
import ManageProfile from './ManageProfile.jsx';
import ChangePassword from './ChangePassword.jsx';
import ManageTokens from './ManageTokens.jsx';
import './account.css';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';

// TODO: The UI is implemented as a tab control here, but a continuous
// scrollable page is preferred

export default function Account() {
  const { data } = useDataStore();

  const history = useHistory();

  const { toast } = useToast();

  const { logout } = useApi();

  // Redirect to /auth after logout
  const onLogOut = async () => {
    const result = await logout();
    if (!result.success) {
      toast('error', 'Error when logging out', result.response.data.message);
      // Still delete credentials on the client-side when there's an error
      data.rememberMe = true;
      data.refreshToken = null;
      data.accessToken = null;
      data.user = null;
    } else {
      toast('info', 'Log out', 'You have been logged out');
    }
    history.push('/auth');
  };
  
  useEffect(() => {
    (async () => {
      if (!data.refreshToken || !data.user) {
        history.push('/auth');
      }
    })();
  }, []);

  if (!data.refreshToken || !data.user) return (<p>Redirecting you to log in...</p>);

  return (
    <div className="body">
      <Navbar sticky="top" navbar="light" bg="dark" className="py-0">
        <Navbar.Brand>
          <img src="/favicon.svg" width="50" height="50" className="d-inline-block mr-2" alt="" />
          <span className="navbar-brand text-white">
            <strong>Classroom Interchat</strong>
          </span>
        </Navbar.Brand>
        <Nav.Item className="ml-auto">
          <Button variant="outline-info" onClick={onLogOut}>Log out</Button>
        </Nav.Item>
      </Navbar>

      <Tab.Container id="tabs" defaultActiveKey="launchApp">
        <Row>
          <Col sm={3}>
            <Nav variant="tabs" className="flex-column mt-2 ml-2 sidebar">
              <Nav.Item>
                <Nav.Link eventKey="launchApp">
                  <span className="text-secondary font-weight-bold">Launch App</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="manageProfile">
                  <span className="text-secondary font-weight-bold">Manage Profile</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="changePassword">
                  <span className="text-secondary font-weight-bold">Change Password</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="manageTokens">
                  <span className="text-secondary font-weight-bold">Manage tokens</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content className="mt-3">
              <Tab.Pane eventKey="launchApp">
                <h2>Launch App</h2>
                <LaunchApp />
              </Tab.Pane>
              <Tab.Pane eventKey="manageProfile">
                <h2>Manage Profile</h2>
                <ManageProfile />
              </Tab.Pane>
              <Tab.Pane eventKey="changePassword">
                <h2>Change Password</h2>
                <ChangePassword />
              </Tab.Pane>
              <Tab.Pane eventKey="manageTokens">
                <h2>Manage Tokens</h2>
                <ManageTokens />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
