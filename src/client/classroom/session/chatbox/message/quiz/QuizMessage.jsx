import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import SAQPrompt from './SAQPrompt.jsx';
import SAQResult from './SAQResult.jsx';
import MCQPrompt from './MCQPrompt.jsx';
import MCQResult from './MCQResult.jsx';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';

export default function QuizMessage({ message }) {
  const { data } = useDataStore();
  let quiz;
  if (message.content.type === 'SAQ') {
    if (message.content.result) {
      quiz = (<SAQResult message={message} />);
    } else {
      quiz = (<SAQPrompt message={message} />);
    }
  } else if (message.content.result) {
    quiz = (<MCQResult message={message} />);
  } else {
    quiz = (<MCQPrompt message={message} />);
  }
  return (
    <div>
      <Badge>QUIZ</Badge>
      {quiz}
      {message.sender.id === data.user.id ? (
        <>
          <Button>End quiz</Button>
          <Button>Release results</Button>
        </>
      ) : null
      }
    </div>
  );
}
