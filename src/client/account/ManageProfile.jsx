import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Col, Row
} from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';

const schema = yup.object().shape({
  profileName: yup.string().min(5).max(100).required()
    .label('Name'),
  profileEmail: yup.string().email().required().label('Email'),
});

export default function ManageProfile() {
  // TODO: use the PATCH/GET /user/:userID APIs
  const { signup, login } = useApi();
  const { toast } = useToast();

  useEffect(() => {
    // TODO: GET user profile and pre-fill the form
    login();
  }, []);

  const onSubmit = async (values) => {
    // TODO: send the PATCH 
    const result = await updateProfile(values.profileName, values.profileEmail);
    if (result.success) {

    } else {
      toast('error', 'Error when updating profile', result.response.data.message);
    }
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
          <Form className="mt-4" onSubmit={handleSubmit} noValidate>
            <Form.Group as={Row} controlId="profileName">
              <Form.Label column sm={2}>Name</Form.Label>
              <Col sm={8}>
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
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="profileEmail">
              <Form.Label column sm={2}>Email</Form.Label>
              <Col sm={8}>
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
              </Col>
            </Form.Group>

            <Col sm={2} />
            <Col sm={10}>
              <Button className="btn btn-secondary shadow-sm float-right mr-n1" type="submit">Save changes</Button>
            </Col>

          </Form>
        )}
      </Formik>
    </div>
  );
}
