import { Formik } from 'formik';
import React from 'react';
import {
  ButtonGroup, ToggleButton, Form, Button
} from 'react-bootstrap';
import MarkdownRender from '../MarkdownRender.jsx';

export default function MCQPrompt({ message }) {
  const onSubmit = (values) => {
    // convert choices to an array if it isn't already one
    if (!(values.choices instanceof Array)) {
      values.choices = [values.choices]; // eslint-disable-line no-param-reassign
    }
    // TODO: send the answer to server
    console.log(values);
  };

  return (
    <div>
      <div><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
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
            <Button type="submit">Submit answer</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
