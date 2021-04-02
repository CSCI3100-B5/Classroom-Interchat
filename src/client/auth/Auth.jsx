import React, { useEffect } from 'react';
import {
  Container, Row, Col, Tab, Tabs
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';

// The login page, containing a sign up box and a log in box.

export default function Auth() {
  const { refreshAccessToken } = useApi();
  const {
    refreshToken,
    setRefreshToken,
    setUserId,
  } = useDataStore();

  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (refreshToken) {
        const result = await refreshAccessToken();
        console.log(result);
        if (result.success) {
          setUserId(result.response.data.userId);
          history.push('/classroom');
        } else {
          setRefreshToken(null);
        }
      }
    })();
  }, []);

  if (refreshToken) return (<p>Loading...</p>);
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
