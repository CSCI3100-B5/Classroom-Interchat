import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Navbar, Nav, Row, Col
} from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../contexts/RealtimeProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';
import { useApi } from '../contexts/ApiProvider.jsx';


const schema = yup.object().shape({
  classroomName: yup.string().required().label('Classroom Name'),
});


export default function CreateClassroom() {
  const history = useHistory();

  const { createClassroom } = useRealtime();

  const { data } = useDataStore();

  const { toast } = useToast();

  const { logout } = useApi();

  useEffect(() => {
    if (data.classroomMeta) history.push('/classroom/session');
  }, [data.classroomMeta]);

  useEffect(() => {
    if (!data.refreshToken) history.push('/auth');
  }, [data.refreshToken]);

  const onSubmit = async (values) => {
    try {
      await createClassroom(values.classroomName);
    } catch (ex) {
      toast('error', 'Failed to create classroom', ex.error);
    }
  };

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
          <h3 className="text-dark">Create Classroom</h3>
          <Formik
            validationSchema={schema}
            onSubmit={onSubmit}
            initialValues={{
              classroomName: '',
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
                <Form.Group controlId="classroomName">
                  <Form.Label>Classroom Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="classroomName"
                    value={values.classroomName}
                    onChange={handleChange}
                    isValid={touched.classroomName && !errors.classroomName}
                    isInvalid={touched.classroomName && errors.classroomName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.classroomName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="mt-2 mb-3 shadow-sm">Create Classroom</Button>
              </Form>
            )}
          </Formik>
          <hr />
          <div className="m-4">
            <p>Want to join a classroom instead?</p>
            <LinkContainer to="/classroom/join">
              <Button className="shadow-sm">Join Classroom</Button>
            </LinkContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
}
