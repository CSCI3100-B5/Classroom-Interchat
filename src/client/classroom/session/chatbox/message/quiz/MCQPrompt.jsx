import { Formik } from 'formik';
import React from 'react';
import {
  ButtonGroup, ToggleButton, Form, Button
} from 'react-bootstrap';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../../../contexts/ToastProvider.jsx';
import MarkdownRender from '../MarkdownRender.jsx';

/**
 * Contains UI specific to an MCQ message in answering mode
 * MCQ answering logic is done here
 */
export default function MCQPrompt({ message }) {
  const { ansMCQuiz } = useRealtime();
  const { toast } = useToast();

  // send answers to the server
  const onSubmit = async (values) => {
    // convert choices to an array if it isn't already one
    if (!(values.choices instanceof Array)) {
      values.choices = [values.choices]; // eslint-disable-line no-param-reassign
    }
    const cleanedChoices = values.choices.map(
      x => message.content.choices.indexOf(x)
    ).sort((a, b) => a - b);
    console.log('MCQ answer object', cleanedChoices);
    try {
      await ansMCQuiz(cleanedChoices, message.id);
      toast('info', 'Multiple choice quiz', 'Answer sent');
    } catch (ex) {
      toast('error', 'Error when answering MCQ', ex.error);
    }
  };

  return (
    <div>
      <div className="m-2"><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
      {message.content.multiSelect
        ? <p className="m-2 text-light text-small">You may choose more than 1 answer</p>
        : null}
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
          <Form className="m-2" noValidate onSubmit={handleSubmit}>
            <Form.Group>
              <ButtonGroup toggle vertical className="p-0 mb-2 d-flex">
                {message.content.choices.map((x) => {
                  if (message.content.multiSelect) {
                    return (
                      <ToggleButton
                        className="quiz-answer-button"
                        variant="outline-light"
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
                      className="quiz-answer-button"
                      variant="outline-light"
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
              variant="outline-light"
              className="quiz-bottom-action"
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
