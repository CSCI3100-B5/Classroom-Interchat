import React, { useEffect } from 'react';
import {
  Container, Row, Col, Tab, Tabs, Card, Navbar
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import './auth.css';
import AppImage from './Icon@4x.png';

export default function Auth() {
  const { getUserProfile } = useApi();
  const { data } = useDataStore();

  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (data.refreshToken && data.user) {
        const result = await getUserProfile(data.user.id);
        console.log(result);
        if (result.success) {
          history.push('/account');
        } else {
          data.refreshToken = null;
          data.user = null;
        }
      }
    })();
  }, []);

  if (data.refreshToken && data.user) return (<p>Loading...</p>);
  return (
    <div className="body">
      <Navbar sticky="top" navbar="light" bg="dark" className="py-0">
        <Navbar.Brand>
          <img src={AppImage} width="50" height="50" class="d-inline-block mr-2" alt=""/>
          <a class="navbar-brand text-white">
            <strong>Classroom Interchat</strong>
          </a>
        </Navbar.Brand>
      </Navbar>
      <Container>
          <Row>
            <Col></Col>
            <Col sm="6">
              <Card className="mt-2 shadow-sm rounded">
                <Card.Body>
                  <Tabs defaultActiveKey="login" id="auth">
                    <Tab eventKey="login" title="Log in">
                      <LoginBox />
                    </Tab>
                    <Tab eventKey="signup" title="Sign up">
                      <SignupBox />
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
            <Col></Col>
          </Row>
        </Container>
    </div>
  );
}
