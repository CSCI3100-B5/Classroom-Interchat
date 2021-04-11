import { Formik } from 'formik';
import React from 'react';
import {
  ButtonGroup, ToggleButton, Form, Button, Badge
} from 'react-bootstrap';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';
import TokenAwarder from './TokenAwarder.jsx';

export default function MCQResult({ message }) {
  const { data } = useDataStore();

  const onSubmit = (values) => {
    // convert choices to an array if it isn't already one
    if (!(values.choices instanceof Array)) {
      values.choices = [values.choices]; // eslint-disable-line no-param-reassign
    }
    // TODO: send the token awardees to server
    // note that server should only accept a list of user ids to award tokens to
    // it is the client's job to compute that list
    console.log(values);
  };

  return (
    <div>
      <h5>Quiz Results</h5>
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
                        className="m-1"
                        disabled={
                          (message.sender.id ?? message.sender) !== data.user.id
                          || message.content.correct
                          || !message.content.closedAt
                        }
                        variant={message.content.correct?.includes(idx) ? 'primary' : 'outline-primary'}
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
                      className="m-1"
                      variant={message.content.correct?.includes(idx) ? 'primary' : 'outline-primary'}
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
                  <Button type="submit">Award Token</Button>
                </>
              )
              : null }
          </Form>
        )}
      </Formik>
    </div>
  );
}
