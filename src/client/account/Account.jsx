import React from 'react';
import {
  Row, Col, Tab, Button, Navbar, Nav
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LaunchApp from './LaunchApp.jsx';
import ManageProfile from './ManageProfile.jsx';
import ChangePassword from './ChangePassword.jsx';
import ManageTokens from './ManageTokens.jsx';
import './account.css';
import AppImage from './Icon@4x.png';

// TODO: The UI is implemented as a tab control here, but a continuous
// scrollable page is preferred

export default function Account() {
  
  const history = useHistory();

  // Redirect to login after logout
  const logOut = async (values) => {
    const result = await signout();
    if(!result.success)
      history.push("/auth");
  };

  return (
    <div className="body">
      <Navbar sticky="top" navbar="light" bg="dark" className="py-0">
        <Navbar.Brand>
          <img src={AppImage} width="50" height="50" class="d-inline-block mr-2" alt=""/>
          <a class="navbar-brand text-white">
            <strong>Classroom Interchat</strong>
          </a>
        </Navbar.Brand>
        <Nav.Item className="ml-auto">
          <Button variant="outline-info">Log out</Button>
        </Nav.Item>
      </Navbar>

      <Tab.Container id="tabs" defaultActiveKey="launchApp">
        <Row>
          <Col sm={3}>
            <Nav variant="tabs" className="flex-column mt-2 ml-2 sidebar">
              <Nav.Item>
                <Nav.Link eventKey="launchApp">
                  <a class="text-secondary font-weight-bold">Launch App</a>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="manageProfile">
                <a class="text-secondary font-weight-bold">Manage Profile</a>
                  </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="changePassword">
                <a class="text-secondary font-weight-bold">Change Password</a>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="manageTokens">
                <a class="text-secondary font-weight-bold">Manage tokens</a>
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
