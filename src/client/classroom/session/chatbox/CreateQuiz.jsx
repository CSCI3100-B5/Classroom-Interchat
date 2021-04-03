import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useHistory } from 'react-router-dom';
import {
  Button, Form, Alert, ButtonGroup, ToggleButton
} from 'react-bootstrap';


const schema = yup.object().shape({
  prompt: yup.string().required().label('Prompt'),
  type: yup.string().oneOf(['SAQ', 'MCQ']).label('Type')
});

export default function CreateQuiz() {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const history = useHistory();

  const onSubmit = async (values) => {
    console.log(values);
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
          prompt: '',
          type: 'SAQ',
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
        }) => (
          <Form
            className="m-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <Form.Group controlId="prompt">
              <Form.Label>Prompt</Form.Label>
              <Form.Control
                type="text"
                name="prompt"
                value={values.prompt}
                onChange={handleChange}
                isValid={touched.prompt && !errors.prompt}
                isInvalid={touched.prompt && errors.prompt}
              />
              <Form.Control.Feedback type="invalid">
                {errors.prompt}
              </Form.Control.Feedback>
            </Form.Group>
            <ButtonGroup toggle className="mb-2 d-flex">
              <ToggleButton
                required
                variant="outline-primary"
                type="radio"
                name="type"
                value="SAQ"
                label="SAQ"
                checked={values.type === 'SAQ'}
                onChange={handleChange}
                feedback={errors.type}
              >
                Short Answer
              </ToggleButton>
              <ToggleButton
                required
                variant="outline-primary"
                type="radio"
                name="type"
                value="MCQ"
                label="MCQ"
                checked={values.type === 'MCQ'}
                onChange={handleChange}
                feedback={errors.type}
              >
                Multiple Choice
              </ToggleButton>
            </ButtonGroup>
            <Button type="submit">Send Quiz</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
