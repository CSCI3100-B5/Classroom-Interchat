import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';


const schema = yup.object().shape({
  classroomName: yup.string().required().label('Classroom Name'),
});


export default function CreateClassroom() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const history = useHistory();

  // TODO: use data store
  // const { ... } = useDataStore();

  // TODO: use create classroom socket API

  const onSubmit = async (values) => {
    // TODO: call create classroom API
    // TODO: remember to store classroom in data store
    history.push('/classroom/session');
  };

  return (
    <div>
      <h3>Create Classroom</h3>
      <Alert
        className="m-2"
        show={showAlert}
        variant="warning"
        onClose={() => setAlertVisibility(false)}
        dismissible
      >
        {alertMessage}
      </Alert>
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
            <Button type="submit">Create Classroom</Button>
          </Form>
        )}
      </Formik>
      <div>
        <p>Want to join a classroom instead?</p>
        <LinkContainer to="/classroom/join">
          <Button>Join Classroom</Button>
        </LinkContainer>
      </div>
    </div>
  );
}
