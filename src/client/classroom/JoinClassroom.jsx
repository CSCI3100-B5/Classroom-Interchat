import React, { useEffect, useState } from 'react';
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
import './JoinClassroom.scoped.css';
import { useSocket } from '../contexts/SocketProvider.jsx';

// schema for form validation
const schema = yup.object().shape({
  classroomId: yup.string().required().matches(/^[0-9a-f]{24}$/si, 'The classroom ID is invalid').label('Classroom ID'),
});

/**
 * A simple form for joining a classroom
 * Includes a button to Create Classroom page
 */
export default function JoinClassroom() {
  const location = useLocation();

  const history = useHistory();

  const { data } = useDataStore();

  const { toast } = useToast();

  const { peekClassroom, joinClassroom } = useRealtime();

  const { logout } = useApi();

  const [peekClassroomId, setPeekClassroomId] = useState(null);

  const localData = useStates({
    initialClassroomId: () => qs.parse(location.search, { ignoreQueryPrefix: true }).id ?? ''
  });

  const socket = useSocket();

  // send a peek classroom request directly if the user enters this page
  // via an invite link
  useEffect(() => {
    if (!socket) return;
    if (!localData.initialClassroomId) return;
    if (data.peekClassroomMeta?.value?.id === localData.initialClassroomId) return;
    (async () => {
      if (await schema.isValid({ classroomId: localData.initialClassroomId })) {
        try {
          setPeekClassroomId(localData.initialClassroomId);
          data.peekClassroomMeta = await peekClassroom(localData.initialClassroomId);
        } catch (ex) {
          data.peekClassroomMeta = ex;
        }
      }
    })();
  }, [localData.initialClassroomId, socket]);

  // route to Authenticate page if the user is not logged in
  useEffect(() => {
    if (!data.refreshToken) history.push('/auth');
  }, [data.refreshToken]);

  // route to Classroom Session page if the user is already in the classroom
  useEffect(() => {
    if (data.classroomMeta) history.push('/classroom/session');
  }, [data.classroomMeta]);

  // if the form text box changes, clear the outdated classroom preview
  useEffect(() => {
    if (!data.peekClassroomMeta) return;
    if (data.peekClassroomMeta.error) return;
    if (data.peekClassroomMeta.value.id !== peekClassroomId) {
      data.peekClassroomMeta = null;
    }
  }, [data.peekClassroomMeta]);

  // send join classroom request to server
  const onSubmit = async (values) => {
    try {
      await joinClassroom(values.classroomId);
    } catch (ex) {
      toast('error', 'Failed to join classroom', ex.error);
    }
  };

  // send peek classroom request to server if the classroom id is valid
  const onChange = async (event) => {
    const classroomId = event.currentTarget.value;
    setPeekClassroomId(classroomId);
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
                      const res = /^https?:\/\/.*\?id=([0-9a-f]+)/.exec(event.target.value);
                      if (res) {
                        [, event.target.value] = res;
                      }
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

                <Card className="peek-card">
                  {(() => {
                    if (!data.peekClassroomMeta) {
                      return (
                        <p className="text-secondary">Enter classroom ID to see a preview</p>
                      );
                    }
                    if (data.peekClassroomMeta.error) {
                      return (
                        <p>{data.peekClassroomMeta.error}</p>
                      );
                    }
                    let closedAt = null;
                    if (data.peekClassroomMeta.value.closedAt) {
                      closedAt = (
                        <>
                          <p>
                            <b>
                              <span className="text-muted font-weight-light text-small mx-2">CLOSED AT</span>
                              {(new Date(data.peekClassroomMeta.value.closedAt)).toLocaleString()}
                            </b>
                          </p>
                          <p>
                            This classroom is closed, but you may still view
                            its read-only message history.
                          </p>
                        </>
                      );
                    }
                    return (
                      <>
                        <p className="text-large"><b>{data.peekClassroomMeta.value.name}</b></p>
                        <p>
                          <span className="text-muted font-weight-light text-small mx-2">PARTICIPANTS</span>
                          {data.peekClassroomMeta.value.participantCount}
                        </p>
                        <p>
                          <span className="text-muted font-weight-light text-small mx-2">HOSTED BY</span>
                          {data.peekClassroomMeta.value.host.name}
                        </p>
                        <p>
                          <span className="text-muted font-weight-light text-small mx-2">STARTED AT</span>
                          {(new Date(data.peekClassroomMeta.value.createdAt)).toLocaleString()}
                        </p>
                        {closedAt}
                      </>
                    );
                  })()}
                </Card>
                <Button type="submit" className="mt-4 mb-3 shadow-sm">
                  {data.peekClassroomMeta?.value?.closedAt ? 'View History' : 'Join Classroom'}
                </Button>
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
