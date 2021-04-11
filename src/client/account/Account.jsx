import React, { useEffect } from 'react';
import {
  Row, Col, Tab, Nav
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LaunchApp from './LaunchApp.jsx';
import ManageProfile from './ManageProfile.jsx';
import ChangePassword from './ChangePassword.jsx';
import ManageTokens from './ManageTokens.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';

// TODO: The UI is implemented as a tab control here, but a continuous
// scrollable page is preferred

export default function Account() {
  const { data } = useDataStore();

  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (!data.refreshToken || !data.user) {
        history.push('/auth');
      }
    })();
  }, []);

  if (!data.refreshToken || !data.user) return (<p>Redirecting you to log in...</p>);

  return (
    <Tab.Container id="tabs" defaultActiveKey="launchApp">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column m-2">
            <Nav.Item>
              <Nav.Link eventKey="launchApp">Launch App</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="manageProfile">Manage Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="changePassword">Change Password</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="manageTokens">Manage Tokens</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="launchApp" className="m-2">
              <h3>Launch App</h3>
              <LaunchApp />
            </Tab.Pane>
            <Tab.Pane eventKey="manageProfile" className="m-2">
              <h3>Manage Profile</h3>
              <ManageProfile />
            </Tab.Pane>
            <Tab.Pane eventKey="changePassword" className="m-2">
              <h3>Change Password</h3>
              <ChangePassword />
            </Tab.Pane>
            <Tab.Pane eventKey="manageTokens" className="m-2">
              <h3>Manage Tokens</h3>
              <ManageTokens />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
