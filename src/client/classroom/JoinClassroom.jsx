import React, { useEffect } from 'react';
import { Formik } from 'formik';
import qs from 'qs';
import * as yup from 'yup';
import {
  Button, Form, Card, Navbar, Nav, Row, Col
} from 'react-bootstrap';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useStates } from 'use-states';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../contexts/RealtimeProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';

const schema = yup.object().shape({
  classroomId: yup.string().matches(/^[0-9a-f]{24}$/si, 'The classroom ID is invalid').label('Classroom ID'),
});


export default function JoinClassroom() {
  const location = useLocation();

  const history = useHistory();

  const { data } = useDataStore();

  const { toast } = useToast();

  const { peekClassroom, joinClassroom } = useRealtime();

  const { logout } = useApi();

  const localData = useStates({
    initialClassroomId: () => qs.parse(location.search, { ignoreQueryPrefix: true }).id ?? ''
  });

  useEffect(() => {
    if (data.classroomMeta) history.push('/classroom/session');
  }, [data.classroomMeta]);

  const onSubmit = async (values) => {
    try {
      await joinClassroom(values.classroomId);
    } catch (ex) {
      toast('error', 'Failed to join classroom', ex.error);
    }
  };

  const onChange = async (event) => {
    const classroomId = event.currentTarget.value;
    if (!await schema.isValid({ classroomId })) {
      data.peekClassroomMeta = null;
      return;
    }
    try {
      data.peekClassroomMeta = await peekClassroom(classroomId);
    } catch (ex) {
      data.peekClassroomMeta = ex;
    }
  };

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

  return (
    <div>
      <Navbar bg="primary" variant="dark" sticky="top" className="shadow-sm">
        <Navbar.Brand>
          <Link to="/account">
            <span className="text-white font-weight-bold align-middle ml-2">
              Classroom Interchat
            </span>
          </Link>
        </Navbar.Brand>
        <Nav.Item className="ml-auto">
          <Button variant="outline-light" onClick={onLogOut}>Log out</Button>
        </Nav.Item>
      </Navbar>

      <Row className="mx-3 mt-4">
        <Col sm={10}>
          <h3 className="text-dark">Join Classroom</h3>
          <Formik
            validationSchema={schema}
            onSubmit={onSubmit}
            initialValues={{
              classroomId: localData.initialClassroomId,
            }}
          >
            {({
              handleSubmit,
              handleChange,
              values,
              touched,
              errors,
            }) => (
              <Form className="m-4" noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="classroomId">
                  <Form.Label>Paste invite link or classroom ID here</Form.Label>
                  <Form.Control
                    type="text"
                    name="classroomId"
                    value={values.classroomId}
                    onChange={(event) => {
                      // TODO: convert invite link to classroom ID
                      handleChange(event);
                      onChange(event);
                    }}
                    isValid={touched.classroomId && !errors.classroomId}
                    isInvalid={touched.classroomId && errors.classroomId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.classroomId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Card style={{ height: '5rem' }}>
                  {(() => {
                    if (!data.peekClassroomMeta) return (<p className="ml-2 mt-1 text-secondary">Enter classroom ID to see a preview</p>);
                    if (data.peekClassroomMeta.error) return (<p>{data.peekClassroomMeta.error}</p>);
                    let closedAt = null;
                    if (data.peekClassroomMeta.value.closedAt) {
                      closedAt = (
                        <p>
                          <b>
                            Closed at
                            {' '}
                            {data.peekClassroomMeta.value.closedAt.toString()}
                          </b>
                        </p>
                      );
                    }
                    return (
                      <>
                        <p><b>{data.peekClassroomMeta.value.name}</b></p>
                        <span>
                          {data.peekClassroomMeta.value.participantCount}
                          {' '}
                          participants
                        </span>
                        <span>
                          Hosted by
                          {' '}
                          {data.peekClassroomMeta.value.host.name}
                        </span>
                        <p>
                          Started at
                          {' '}
                          {data.peekClassroomMeta.value.createdAt.toString()}
                        </p>
                        {closedAt}
                      </>
                    );
                  })()}
                </Card>
                <Button type="submit" className="mt-4 mb-3 shadow-sm">Join Classroom</Button>
              </Form>
            )}
          </Formik>
          <hr />
          <div className="m-4">
            <p>Want to create a classroom instead?</p>
            <LinkContainer to="/classroom/create">
              <Button className="shadow-sm">Create Classroom</Button>
            </LinkContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}
