import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';

// The Log in box, not an independent page

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(8).max(20).required(),
  rememberMe: yup.bool().required(),
});

export default function LoginBox() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        username: '',
        password: '',
        rememberMe: true
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
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
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
              onChange={handleChange}
              isInvalid={!!errors.rememberMe}
              feedback={errors.rememberMe}
              id="rememberMe"
            />
          </Form.Group>
          <Button type="submit">Log in</Button>
        </Form>
      )}
    </Formik>
  );
}
