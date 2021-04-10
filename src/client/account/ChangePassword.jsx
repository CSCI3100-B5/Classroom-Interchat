import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button, Form, Alert, Col, Row } from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';


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

export default function ChangePassword() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // TODO: use the PATCH /user/:userId API
  // const { signup, login } = useApi();

  const onSubmit = async (values) => {
    // TODO: send the API request
    // const result = await signup(values.signupName, values.signupEmail, values.signupPassword);
    // if (result.success) {
    //   const loginResult = await login(values.signupEmail, values.signupPassword);
    //   if (loginResult.success) {
    //     history.push('/classroom');
    //   } else {
    //     setAlertMessage(loginResult.response.data.message);
    //     setAlertVisibility(true);
    //   }
    // } else {
    //   setAlertMessage(result.response.data.message);
    //   setAlertVisibility(true);
    // }
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
          <Form className="mt-4">
            <Form.Group as={Row} controlId="oldPassword">
              <Form.Label column sm={2}>Old Password</Form.Label>
              <Col sm={8}>
                <Form.Control 
                  type="password"
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

            <Col sm={2}></Col>
            <Col sm={10}>
              <Button className="btn btn-secondary shadow-sm float-right mr-n1" type="submit">Save changes</Button>
            </Col>
            
          </Form>
        )}
      </Formik>
    </div>
  );
}
