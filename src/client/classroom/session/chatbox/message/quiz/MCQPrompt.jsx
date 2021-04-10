import { Formik } from 'formik';
import React from 'react';
import {
  ButtonGroup, ToggleButton, Form, Button
} from 'react-bootstrap';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';

export default function MCQPrompt({ message }) {
  const { ansMCQuiz } = useRealtime();
  const onSubmit = async (values) => {
    // convert choices to an array if it isn't already one
    if (!(values.choices instanceof Array)) {
      values.choices = [values.choices]; // eslint-disable-line no-param-reassign
    }
    // TODO: send the answer to server
    console.log(values);
    try {
      await ansMCQuiz(values, message.id);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <p>{message.content.prompt}</p>
      {message.content.multiSelect ? <p className="text-muted">You may choose more than 1 answer</p> : null}
      <Formik
        onSubmit={onSubmit}
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
              <ButtonGroup toggle vertical className="mb-2 d-flex">
                {message.content.choices.map((x) => {
                  if (message.content.multiSelect) {
                    return (
                      <ToggleButton
                        className="m-1"
                        variant="outline-primary"
                        required
                        disabled={!!message.content.closedAt}
                        type="checkbox"
                        key={x}
                        name="choices"
                        value={x}
                        label={x}
                        checked={values.choices.includes(x)}
                        onChange={handleChange}
                        feedback={errors.choices}
                      >
                        {x}
                      </ToggleButton>
                    );
                  }
                  return (
                    <ToggleButton
                      required
                      disabled={!!message.content.closedAt}
                      className="m-1"
                      variant="outline-primary"
                      type="radio"
                      key={x}
                      name="choices"
                      value={x}
                      label={x}
                      checked={values.choices === x}
                      onChange={handleChange}
                      feedback={errors.choices}
                    >
                      {x}
                    </ToggleButton>
                  );
                })}
              </ButtonGroup>
            </Form.Group>
            <Button
              type="submit"
              disabled={!!message.content.closedAt}
            >
              Submit answer
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
