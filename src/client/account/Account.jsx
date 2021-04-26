import React, { useEffect } from 'react';
import {
  Row, Col, Tab, Button, Navbar, Nav
} from 'react-bootstrap';
import { useHistory, useLocation, Link } from 'react-router-dom';
import LaunchApp from './LaunchApp.jsx';
import ManageProfile from './ManageProfile.jsx';
import ChangePassword from './ChangePassword.jsx';
import ManageTokens from './ManageTokens.jsx';
import './account.css';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';

export default function Account() {
  const { data } = useDataStore();

  const history = useHistory();
  const location = useLocation();

  const { toast } = useToast();

  const { logout, getUserProfile } = useApi();

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
      const result = await getUserProfile(data.user.id);
      console.log('Get user profile', result);
      if (result.success) {
        data.user = result.response.data;
      } else {
        data.refreshToken = null;
        data.accessToken = null;
        data.user = null;
        history.push('/auth');
      }
    })();
  }, [data.refreshToken]);

  if (!data.refreshToken || !data.user) return (<p>Redirecting you to log in...</p>);

  return (
    <div className="account-body">
      <Navbar bg="primary" sticky="top" className="shadow-sm">
        <Navbar.Brand>
          <Link to="/">
            <span className="text-white font-weight-bold align-middle ml-2">
              Classroom Interchat
            </span>
          </Link>
        </Navbar.Brand>
        <Nav.Item className="ml-auto">
          <Button variant="outline-light" onClick={onLogOut}>Log out</Button>
        </Nav.Item>
      </Navbar>

      <Tab.Container defaultActiveKey={
        ['manageProfile', 'changePassword', 'manageTokens'].includes(location.hash.substr(1))
          ? location.hash.substr(1)
          : 'launchApp'}
      >
        <Row className="h-full sm-overflow-y-auto vw-full">
          <Col sm={3} className="sm-h-full">
            <Nav variant="tabs" className="flex-column sidebar">
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
          <Col sm={9} className="sm-h-full">
            <Tab.Content className="account-content">
              <Tab.Pane eventKey="launchApp" className="h-full">
                <div className="h-full account-content-pane">
                  <h2>Launch App</h2>
                  <LaunchApp />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="manageProfile" className="h-full">
                <div className="h-full account-content-pane">
                  <h2>Manage Profile</h2>
                  <ManageProfile />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="changePassword" className="h-full">
                <div className="h-full account-content-pane">
                  <h2>Change Password</h2>
                  <ChangePassword />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="manageTokens" className="h-full">
                <div className="h-full account-content-pane overflow-auto">
                  <h2>Manage Tokens</h2>
                  <ManageTokens />
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}
