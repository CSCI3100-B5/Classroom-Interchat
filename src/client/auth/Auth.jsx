import React, { useEffect } from 'react';
import {
  Container, Row, Col, Tab, Tabs, Card
} from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import './auth.css';

export default function Auth() {
  const location = useLocation();
  const { getUserProfile } = useApi();
  const { data } = useDataStore();

  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (data.refreshToken && data.user) {
        const result = await getUserProfile(data.user.id);
        // console.log('Get user profile', result);
        if (result.success) {
          history.push('/account');
        } else {
          data.refreshToken = null;
          data.accessToken = null;
          data.user = null;
        }
      }
    })();
  }, []);

  if (data.refreshToken && data.user) return (<p>Loading...</p>);
  return (
    <div className="auth-body">
      <Container className="h-full">
        <Row className="h-full justify-content-md-center">
          <Col md={8} lg={6} className="h-full d-flex justify-content-center align-items-center">
            <Card className="w-full shadow-sm rounded">
              <Card.Body>
                <Tabs justify variant="pills" defaultActiveKey={location.hash === '#signup' ? 'signup' : 'login'} id="auth">
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
        </Row>
      </Container>
    </div>
  );
}
