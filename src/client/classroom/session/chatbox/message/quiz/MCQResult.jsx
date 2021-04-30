import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  ButtonGroup, ToggleButton, Form, Button, Badge
} from 'react-bootstrap';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';
import TokenAwarder from '../../../TokenAwarder.jsx';
import MarkdownRender from '../MarkdownRender.jsx';

/**
 * Contains UI specific to an MCQ message in results display mode
 * Token awarding is handled here
 */
export default function MCQResult({ message }) {
  const { data } = useDataStore();
  const [showModal, setShowModal] = useState(false);

  // Instead of sending the token award request to server directly,
  // open the token awarder prompt so that the user can type in notes
  const onSubmit = (values) => {
    // convert choices to an array if it isn't already one
    if (!(values.choices instanceof Array)) {
      values.choices = [values.choices];
    }

    // note that server only accept a list of user ids to award tokens to
    // it is the client's job to compute that list
    console.log('MCQ select token awardees ', values);
    if (message.content.correct?.length > 0 || (values.choices && values.choices.length > 0)) {
      setShowModal(true);
    }
  };

  return (
    <div>
      <h5 className="m-2">MCQ Quiz Results</h5>
      <div className="mx-2"><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
      {message.content.multiSelect
        ? <span className="m-2 text-light text-small">Multi-selection allowed</span>
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
                {message.content.choices.map((x, idx) => {
                  const percentage = message.content.results.reduce(
                    (prev, curr) => (prev + (curr.content.includes(idx) ? 1 : 0)),
                    0
                  ) / message.content.results.length * 100;
                  const btnContent = (
                    <>
                      <Badge>
                        {Number.isNaN(percentage) ? null : `${percentage.toFixed(2)}%`}
                      </Badge>
                      {x}
                    </>
                  );
                  if (message.content.multiSelect) {
                    return (
                      <ToggleButton
                        className="quiz-answer-button"
                        disabled={
                          (message.sender.id ?? message.sender) !== data.user.id
                          || message.content.correct
                          || !message.content.closedAt
                        }
                        variant={message.content.correct?.includes(idx) ? 'light' : 'outline-light'}
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
                        {btnContent}
                      </ToggleButton>
                    );
                  }
                  return (
                    <ToggleButton
                      required
                      disabled={
                        (message.sender.id ?? message.sender) !== data.user.id
                        || message.content.correct
                        || !message.content.closedAt
                      }
                      className="quiz-answer-button"
                      variant={message.content.correct?.includes(idx) ? 'light' : 'outline-light'}
                      type="radio"
                      key={x}
                      name="choices"
                      value={x}
                      label={x}
                      checked={values.choices === x}
                      onChange={handleChange}
                      feedback={errors.choices}
                    >
                      {btnContent}
                    </ToggleButton>
                  );
                })}
              </ButtonGroup>
            </Form.Group>
            {(message.sender.id ?? message.sender) === data.user.id && message.content.closedAt
              ? (
                <>
                  <Button
                    type="submit"
                    variant="outline-light"
                    className="quiz-bottom-action"
                  >
                    Award Token
                  </Button>
                  <TokenAwarder
                    userIds={
                    showModal
                      ? (() => {
                        let { correct } = message.content;
                        if (!correct) {
                          if (values.choices instanceof Array) {
                            correct = values.choices.map(x => message.content.choices.indexOf(x));
                          } else {
                            correct = [message.content.choices.indexOf(values.choices)];
                          }
                        }
                        const b = new Set(correct);
                        return message.content.results.filter((x) => {
                          const a = new Set(x.content);
                          return a.size === b.size && [...a].every(value => b.has(value));
                        }).map(x => x.user.id ?? x.user);
                      })()
                      : null
                    }
                    onClose={() => setShowModal(false)}
                  />
                </>
              )
              : null }
          </Form>
        )}
      </Formik>
    </div>
  );
}
