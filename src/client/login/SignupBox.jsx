import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';

// The Sign up box, not an independent page.
// This component is shown when the user select the sign up
// tab in the /login page.

const schema = yup.object().shape({
  username: yup.string()
    .min(6).max(64)
    .matches(/[a-zA-Z][a-zA-Z0-9_-]+|[-_][a-zA-Z0-9_-]*[a-zA-Z][a-zA-Z0-9_-]*/)
    .required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(64).required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'The two passwords do not match')
    .required()
});

export default function SignupBox() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        username: '',
        email: '',
        password: '',
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
        <Form className="m-4" noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="signupUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="signupUsername"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              isValid={touched.email && !errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="signupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="signupPassword"
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirmed Password</Form.Label>
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
  );
}
