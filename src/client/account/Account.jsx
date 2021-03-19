import React from 'react';
import {
  Row, Col, Tab, Nav
} from 'react-bootstrap';
import EditAccountInfo from './EditAccountInfo.jsx';
import TokensInfo from './TokensInfo.jsx';

// A page for the user to view and edit account information.
// It consists of the Edit Account Info tab and the Tokens tab.

export default function Account() {
  return (
    <Tab.Container id="tabs" defaultActiveKey="accountInfo">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column m-2">
            <Nav.Item>
              <Nav.Link eventKey="accountInfo">Account Info</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tokens">Tokens</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="accountInfo" className="m-2">
              <EditAccountInfo />
            </Tab.Pane>
            <Tab.Pane eventKey="tokens" className="m-2">
              <TokensInfo />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
