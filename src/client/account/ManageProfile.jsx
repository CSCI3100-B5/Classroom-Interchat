import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';

const schema = yup.object().shape({
  profileName: yup.string().min(5).max(100).required()
    .label('Name'),
  profileEmail: yup.string().email().required().label('Email'),
});

export default function ManageProfile() {
  // TODO: use the PATCH/GET /user/:userID APIs
  // const { signup, login } = useApi();

  useEffect(() => {
    // TODO: GET user profile and pre-fill the form
  }, []);

  const onSubmit = async (values) => {
    // TODO: send the PATCH request
  };

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          profileName: '',
          profileEmail: ''
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
        }) => (
          <Form className="m-4" onSubmit={handleSubmit} noValidate>
            <Form.Group controlId="profileName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="profileName"
                value={values.profileName}
                onChange={handleChange}
                isValid={touched.profileName && !errors.profileName}
                isInvalid={touched.profileName && errors.profileName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.profileName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="profileEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="profileEmail"
                value={values.profileEmail}
                onChange={handleChange}
                isValid={touched.profileEmail && !errors.profileEmail}
                isInvalid={touched.profileEmail && errors.profileEmail}
              />
              <Form.Control.Feedback type="invalid">
                {errors.profileEmail}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit">Save changes</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
