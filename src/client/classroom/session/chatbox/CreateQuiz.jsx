import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  Button, Form, Alert, ButtonGroup, ToggleButton, InputGroup
} from 'react-bootstrap';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';

const choicesSchema = {};
const choicesDefault = {};

for (let i = 0; i < 10; i++) {
  choicesSchema[`choice${i}`] = yup.mixed()
    .test(
      `choice${i}-filled`,
      'This choice must not be empty',
      (value, context) => context.parent.type !== 'MCQ' || context.parent.choiceCount <= i || value
    )
    .test(
      `choice${i}-unique`,
      'This choice must be unique',
      (value, context) => {
        if (context.parent.type !== 'MCQ' || context.parent.choiceCount <= i) return true;
        for (let j = 0; j < context.parent.choiceCount; j++) {
          if (j !== i && context.parent[`choice${j}`] === value) return false;
        }
        return true;
      }
    );
  choicesSchema[`choice${i}correct`] = yup.bool().required();
  choicesDefault[`choice${i}`] = '';
  choicesDefault[`choice${i}correct`] = false;
}

const schema = yup.object().shape({
  prompt: yup.string().required().label('Prompt'),
  type: yup.string().oneOf(['SAQ', 'MCQ']).label('Type'),
  choiceCount: yup.number().integer().min(2).max(10)
    .test(
      'all-choices-filled',
      'Not all choices are filled',
      (value, context) => {
        if (context.parent.type !== 'MCQ') return true;
        for (let i = 0; i < value; i++) {
          if (!context.parent[`choice${i}`]) return false;
        }
        return true;
      },
    )
    .test(
      'all-choices-unique',
      'Not all choices are unique',
      (value, context) => {
        if (context.parent.type !== 'MCQ') return true;
        for (let i = 0; i < value; i++) {
          for (let j = i + 1; j < value; j++) {
            if (context.parent[`choice${i}`] === context.parent[`choice${j}`]) return false;
          }
        }
        return true;
      },
    )
    .label('Number of choices'),
  ...choicesSchema
});

export default function CreateQuiz({ onBack }) {
  const [showAlert, setAlertVisibility] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { sendQuiz } = useRealtime();
  const onSubmit = async (values) => {
    // clean the values object before submitting to server
    let cleanedValues = {
      prompt: values.prompt,
      type: values.type
    };
    if (values.type === 'MCQ') {
      cleanedValues = {
        ...cleanedValues,
        choices: [],
        correct: [],
        multiSelect: values.multiSelect
      };
      for (let i = 0; i < values.choiceCount; i++) {
        cleanedValues.choices.push(values[`choice${i}`]);
        if (values[`choice${i}correct`]) cleanedValues.correct.push(i);
      }
      if (cleanedValues.correct.length === 0) {
        delete cleanedValues.correct;
      }
    }

    console.log(cleanedValues);
    try {
      await sendQuiz(cleanedValues);
      onBack();
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <Button variant="flat" onClick={onBack}>Back</Button>
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
          choiceCount: 4,
          ...choicesDefault,
          multiSelect: false
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
            {values.type === 'MCQ' ? (
              <>
                <Form.Group controlId="choiceCount">
                  <Form.Label>
                    Number of choices:
                    {' '}
                    {values.choiceCount}
                  </Form.Label>
                  <Form.Control
                    type="range"
                    required
                    name="choiceCount"
                    value={values.choiceCount}
                    min="2"
                    max="10"
                    onChange={handleChange}
                    isValid={touched.choiceCount && !errors.choiceCount}
                    isInvalid={touched.choiceCount && errors.choiceCount}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.choiceCount}
                  </Form.Control.Feedback>
                </Form.Group>
                {(() => {
                  const choices = [];
                  for (let i = 0; i < values.choiceCount; i++) {
                    choices.push(

                      <Form.Group key={i} controlId={`choice${i}`}>
                        <Form.Label>{`Choice ${i + 1}`}</Form.Label>
                        <InputGroup className="mb-3">
                          <InputGroup.Prepend>
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              name={`choice${i}correct`}
                              checked={values[`choice${i}correct`]}
                              onChange={handleChange}
                            />
                          </InputGroup.Prepend>
                          <Form.Control
                            type="text"
                            name={`choice${i}`}
                            value={values[`choice${i}`]}
                            onChange={handleChange}
                            isValid={touched[`choice${i}`] && !errors[`choice${i}`]}
                            isInvalid={touched[`choice${i}`] && errors[`choice${i}`]}
                          />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                          {errors[`choice${i}`]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    );
                  }
                  return choices;
                })()}
                <Form.Group controlId="multiSelect">
                  <Form.Check
                    required
                    name="multiSelect"
                    label="Allow choosing multiple answers"
                    checked={values.multiSelect}
                    onChange={handleChange}
                    isInvalid={!!errors.multiSelect}
                    feedback={errors.multiSelect}
                  />
                </Form.Group>
              </>
            ) : null}
            <Button type="submit">Send Quiz</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
