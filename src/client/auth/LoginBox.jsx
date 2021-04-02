import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';

// The Log in box, not an independent page.
// This component is shown when the user select the log in
// tab in the /auth page.

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(64).required(),
  rememberMe: yup.bool().required(),
});


export default function LoginBox() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const history = useHistory();

  const { login } = useApi();
  const {
    rememberMe,
    setRememberMe,
  } = useDataStore();

  const onSubmit = async (values) => {
    const result = await login(values.email, values.password);
    if (result.success) {
      history.push('/classroom');
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
          email: '',
          password: '',
          rememberMe
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
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Check
                required
                name="rememberMe"
                label="Remember me"
                checked={values.rememberMe}
                onChange={(event) => { handleChange(event); setRememberMe(event.target.checked); }}
                isInvalid={!!errors.rememberMe}
                feedback={errors.rememberMe}
                id="rememberMe"
              />
            </Form.Group>
            <Button type="submit">Log in</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
