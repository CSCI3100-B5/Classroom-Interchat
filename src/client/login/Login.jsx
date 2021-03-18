import React from 'react';
import {
  Container, Row, Col, Tab, Tabs
} from 'react-bootstrap';
import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';

// This is a page containing a Log in and Sign up box

export default function Login() {
  return (
    <Container>
      <Row>
        <Col>
          <Tabs defaultActiveKey="login" id="auth">
            <Tab eventKey="login" title="Log in">
              <LoginBox />
            </Tab>
            <Tab eventKey="signup" title="Sign up">
              <SignupBox />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>

  );
}
