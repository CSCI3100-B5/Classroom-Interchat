import { Formik } from 'formik';
import React from 'react';
import { Form, Button, ToggleButton } from 'react-bootstrap';

export default function MCQPrompt({ message }) {
  return (
    <div>
      <p>{message.content.prompt}</p>
      <Formik
        onSubmit={console.log}
        initialValues={{
          choices: [],
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
            <Form.Group>
              {message.content.choices.map((x) => {
                if (message.content.multiSelect) {
                  return (
                    <Form.Check
                      required
                      key={x}
                      name="choices"
                      value={x}
                      label={x}
                      onChange={handleChange}
                      isInvalid={!!errors.choices}
                      feedback={errors.choices}
                    />
                  );
                }
                return (
                  <Form.Check
                    required
                    type="radio"
                    key={x}
                    name="choices"
                    value={x}
                    label={x}
                    onChange={handleChange}
                    isInvalid={!!errors.choices}
                    feedback={errors.choices}
                  />
                );
              })}
            </Form.Group>
            <Button type="submit">Submit answer</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
