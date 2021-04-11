import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';


const schema = yup.object().shape({
  signupName: yup.string().min(5).max(100).required()
    .label('Name'),
  signupEmail: yup.string().email().required().label('Email'),
  signupPassword: yup.string().min(8).max(64).required()
    .label('Password'),
  confirmPassword: yup.string().min(8).max(64)
    .oneOf([yup.ref('signupPassword'), null], 'The two passwords do not match')
    .required()
    .label('Confirm password')
});

export default function SignupBox() {
  const history = useHistory();
  const { toast } = useToast();

  const { signup, login } = useApi();

  // assume 'values' passed to the 'onSubmit' are correct
  // that is, schema take care of format of input already
  const onSubmit = async (values) => {
    const result = await signup(values.signupName, values.signupEmail, values.signupPassword);
    if (result.success) {
      const loginResult = await login(values.signupEmail, values.signupPassword);
      if (loginResult.success) {
        history.push('/account');
      } else {
        toast('error', 'Log in failed', loginResult.response.data.message);
      }
    } else {
      toast('error', 'Sign up failed', result.response.data.message);
    }
  };

  return (
    <div>
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
          <Form className="mt-4 mx-1" onSubmit={handleSubmit} noValidate>
            <Form.Group controlId="signupName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="signupName"
                value={values.signupName}
                onChange={handleChange}
                isValid={touched.signupName && !errors.signupName}
                isInvalid={touched.signupName && errors.signupName}
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
                isInvalid={touched.signupEmail && errors.signupEmail}
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
                isInvalid={touched.signupPassword && errors.signupPassword}
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
                isInvalid={touched.confirmPassword && errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button className="btn btn-primary btn-block" type="submit"><strong>Sign up</strong></Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
