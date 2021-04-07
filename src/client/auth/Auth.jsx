import React, { useEffect } from 'react';
import {
  Container, Row, Col, Tab, Tabs
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import LoginBox from './LoginBox.jsx';
import SignupBox from './SignupBox.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';


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
