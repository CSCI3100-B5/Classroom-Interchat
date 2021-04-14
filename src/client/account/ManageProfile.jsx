import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Col, Row, Card
} from 'react-bootstrap';
import { useApi } from '../contexts/ApiProvider.jsx';
import { useToast } from '../contexts/ToastProvider.jsx';
import { useDataStore } from '../contexts/DataStoreProvider.jsx';
import './ManageProfile.scoped.css';

const schema = yup.object().shape({
  profileName: yup.string().min(5).max(100).required()
    .label('Name'),
  profileEmail: yup.string().email().required().label('Email'),
});

export default function ManageProfile() {
  const { updateUserProfile, sendEmail } = useApi();
  const { toast } = useToast();
  const { data } = useDataStore();
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (values) => {
    const result = await updateUserProfile(data.user.id, {
      name: values.profileName,
      email: values.profileEmail
    });
    if (result.success) {
      data.user = result.response.data;
      toast('info', 'Update profile', 'Profile updated successfully');
    } else {
      toast('error', 'Error when updating profile', result.response.data.message);
    }
  };

  const onSendEmail = async () => {
    const result = await sendEmail();
    console.log('Send email result', result);
    if (result.success) {
      setEmailSent(true);
      toast('info', 'Verification email', 'Verification email sent successfully. Please check your inbox');
    } else if (result.response?.data?.message) {
      toast('error', 'Error when sending email', result.response.data.message);
    }
  };

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={onSubmit}
        initialValues={{
          profileName: data.user.name,
          profileEmail: data.user.email
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
                  maxLength={100}
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

            {data.user.emailVerified ? null
              : (
                <Row>
                  <Col sm={10}>
                    <Card className="m-2 mb-4 email-card">
                      <Card.Body>
                        <Card.Title>
                          Email not verified
                        </Card.Title>
                        <Card.Text>
                          You have to verify your email address to access classrooms.
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        {emailSent
                          ? <span className="float-right">Verification email sent</span>
                          : (
                            <Button variant="flat" className="float-right" onClick={onSendEmail}>
                              Send verification email
                            </Button>
                          )}
                      </Card.Footer>
                    </Card>
                  </Col>
                </Row>
              )}


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
