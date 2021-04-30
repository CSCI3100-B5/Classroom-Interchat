import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Col, Row
} from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';

// schema to validate form input
const schema = yup.object().shape({
  oldPassword: yup.string().min(8).max(64).required()
    .label('Old password'),
  newPassword: yup.string().min(8).max(64).required()
    .label('New password'),
  confirmPassword: yup.string().min(8).max(64)
    .oneOf([yup.ref('newPassword'), null], 'The two passwords do not match')
    .required()
    .label('Confirm password')
});

/**
 * The Change Password tab, lives in the Account page
 */
export default function ChangePassword() {
  const { data } = useDataStore();
  const { toast } = useToast();
  const { updateUserProfile } = useApi();

  // Send the change password request to server
  const onSubmit = async (values) => {
    const result = await updateUserProfile(data.user.id, {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    });
    if (result.success) {
      data.user = result.response.data;
      toast('info', 'Change password', 'Password updated successfully');
    } else {
      toast('error', 'Error when changing password', result.response.data.message);
    }
  };

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          oldPassword: '',
          newPassword: '',
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
          <Form className="mt-4" onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="oldPassword">
              <Form.Label column sm={2}>Old Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  maxLength={64}
                  name="oldPassword"
                  value={values.oldPassword}
                  onChange={handleChange}
                  isValid={touched.oldPassword && !errors.oldPassword}
                  isInvalid={touched.oldPassword && errors.oldPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.oldPassword}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="newPassword">
              <Form.Label column sm={2}>New Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  maxLength={64}
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  isValid={touched.newPassword && !errors.newPassword}
                  isInvalid={touched.newPassword && errors.newPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="confirmPassword">
              <Form.Label column sm={2}>Confirm Password</Form.Label>
              <Col sm={8}>
                <Form.Control
                  type="password"
                  maxLength={64}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isValid={touched.confirmPassword && !errors.confirmPassword}
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>

            <Row>
              <Col sm={10}>
                <Button className="shadow-sm float-right" type="submit">Save changes</Button>
              </Col>
            </Row>

          </Form>
        )}
      </Formik>
    </div>
  );
}
