import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).max(20).required(),
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
          <Form.Group controlId="confirmPassword">
            <Form.Label>Password</Form.Label>
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
