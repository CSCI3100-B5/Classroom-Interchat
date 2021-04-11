import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import SAQPrompt from './SAQPrompt.jsx';
import SAQResult from './SAQResult.jsx';
import MCQPrompt from './MCQPrompt.jsx';
import MCQResult from './MCQResult.jsx';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../../../contexts/ToastProvider.jsx';

export default function QuizMessage({ message }) {
  const { data } = useDataStore();

  const { endQuiz, releaseResults } = useRealtime();

  const { toast } = useToast();

  const onEndQuiz = async () => {
    try {
      await endQuiz(message.id);
    } catch (ex) {
      toast('error', 'Error when end quiz', ex.error);
    }
  };

  const onReleaseResults = async () => {
    try {
      await releaseResults(message.id);
    } catch (ex) {
      toast('error', 'Error when releasing results', ex.error);
    }
  };

  let quiz;
  if (message.type === 'saq') {
    if (message.content.results) {
      quiz = (<SAQResult message={message} />);
    } else {
      quiz = (<SAQPrompt message={message} />);
    }
  } else if (message.content.results) {
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
          if (!message.content.closedAt) {
            return (<Button onClick={onEndQuiz}>End quiz</Button>);
          }
          if (!message.content.resultsReleased) {
            return (<Button onClick={onReleaseResults}>Release results</Button>);
          }
        }
        return null;
      })()}
    </div>
  );
}
