import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import SAQPrompt from './SAQPrompt.jsx';
import SAQResult from './SAQResult.jsx';
import MCQPrompt from './MCQPrompt.jsx';
import MCQResult from './MCQResult.jsx';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';

export default function QuizMessage({ message }) {
  const { data } = useDataStore();

  const { endQuiz } = useRealtime();

  const onEndQuiz = async () => {
    try {
      await endQuiz(message.id);
    } catch (ex) {
      console.log(ex);
    }
  };

  let quiz;
  if (message.type === 'saq') {
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
      {(() => {
        if ((message.sender.id ?? message.sender) === data.user.id) {
          return message.content.closedAt
            ? (<Button>Release results</Button>)
            : (<Button onClick={onEndQuiz}>End quiz</Button>);
        }
        return null;
      })()}
    </div>
  );
}
