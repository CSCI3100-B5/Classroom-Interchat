import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';

// The Sign up box, not an independent page.
// This component is shown when the user select the sign up
// tab in the /auth page.

const schema = yup.object().shape({
  signupName: yup.string().min(5).max(100).required(),
  signupEmail: yup.string().email().required(),
  signupPassword: yup.string().min(8).max(64).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('signupPassword'), null], 'The two passwords do not match')
    .required()
});

export default function SignupBox() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const history = useHistory();

  const { signup, login } = useApi();

  // assume 'values' passed to the 'onSubmit' are correct
  // that is, schema take care of format of input already
  const onSubmit = async (values) => {
    const result = await signup(values.signupName, values.signupEmail, values.signupPassword);
    if (result.success) {
      const loginResult = await login(values.signupEmail, values.signupPassword);
      if (loginResult.success) {
        history.push('/classroom');
      } else {
        setAlertMessage(loginResult.response.data.message);
        setAlertVisibility(true);
      }
    } else {
      setAlertMessage(result.response.data.message);
      setAlertVisibility(true);
    }
  };

  return (
    <div>
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
          signupName: '',
          signupEmail: '',
          signupPassword: '',
          confirmPassword: ''
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
        }) => (
          <Form className="m-4" onSubmit={handleSubmit}>
            <Form.Group controlId="signupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="signupName"
                value={values.signupName}
                onChange={handleChange}
                isValid={touched.signupName && !errors.signupName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.signupName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="signupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="signupEmail"
                value={values.signupEmail}
                onChange={handleChange}
                isValid={touched.signupEmail && !errors.signupEmail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.signupEmail}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="signupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="signupPassword"
                value={values.signupPassword}
                onChange={handleChange}
                isValid={touched.signupPassword && !errors.signupPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.signupPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                isValid={touched.confirmPassword && !errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Sign up</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
