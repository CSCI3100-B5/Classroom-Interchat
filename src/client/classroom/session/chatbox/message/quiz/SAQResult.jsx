import React, { useState } from 'react';
import {
  Badge, ButtonGroup, ToggleButton, Form, Button
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';
import TokenAwarder from '../../../TokenAwarder.jsx';
import MarkdownRender from '../MarkdownRender.jsx';

export default function SAQResult({ message }) {
  const [groupView, setGroupView] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const { data } = useDataStore();
  let answerDigest = [];
  if (groupView) {
    message.content.results.forEach((x, id) => {
      const d = answerDigest.find(y => y.content.trim() === x.content.trim());
      if (d) {
        d.users.push(x.user);
        d.createdAt = new Date(Math.min.apply(null, [d.createdAt, x.createdAt]));
      } else {
        answerDigest.push({
          id,
          users: [x.user],
          content: x.content.trim(),
          createdAt: x.createdAt
        });
      }
    });
    answerDigest.sort((a, b) => b.users.length - a.users.length);
  } else {
    answerDigest = message.content.results
      .map((x, id) => ({ ...x, id, users: [x.user] }))
      .sort((a, b) => a.createdAt - b.createdAt);
  }

  const onSubmit = (values) => {
    console.log('SAQ select token awardees ', values);
    if (values.choice) setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center m-2">
        <h5 className="flex-grow-1 mb-0 mr-4">SAQ Quiz Results</h5>
        <ButtonGroup toggle>
          <ToggleButton
            type="checkbox"
            variant="outline-light"
            checked={groupView}
            value="1"
            onChange={e => setGroupView(e.currentTarget.checked)}
          >
            {groupView ? 'Group View' : 'Individual View'}
          </ToggleButton>
        </ButtonGroup>
      </div>
      <div className="mx-2"><MarkdownRender>{message.content.prompt}</MarkdownRender></div>
      {answerDigest.length === 0
        ? <span className="m-4 text-light">No answers...</span>
        : null}
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          choice: null,
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
                {answerDigest.map(x => (
                  <ToggleButton
                    required
                    className="quiz-answer-button"
                    disabled={
                      (message.sender.id ?? message.sender) !== data.user.id
                      || !message.content.closedAt
                    }
                    variant="outline-light"
                    type="radio"
                    key={x.id}
                    name="choice"
                    value={x.id}
                    label={x.content}
                    checked={values.choice && +values.choice === x.id}
                    onChange={handleChange}
                    feedback={errors.choice}
                  >
                    {x.content}
                    {(x.users?.length ?? 0) > 1 ? (
                      <Badge>
                        x
                        {x.users.length}
                      </Badge>
                    ) : null}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Form.Group>
            {
            (message.sender.id ?? message.sender) === data.user.id && message.content.closedAt
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
                      ? answerDigest[values.choice]?.users
                      : null
                    }
                    onClose={() => setShowModal(false)}
                  />
                </>
              )
              : null
            }
          </Form>
        )}
      </Formik>
    </div>
  );
}
