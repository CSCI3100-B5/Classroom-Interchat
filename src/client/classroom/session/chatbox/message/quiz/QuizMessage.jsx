import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import SAQPrompt from './SAQPrompt.jsx';
import SAQResult from './SAQResult.jsx';
import MCQPrompt from './MCQPrompt.jsx';
import MCQResult from './MCQResult.jsx';
import { useDataStore } from '../../../../../contexts/DataStoreProvider.jsx';
import { useRealtime } from '../../../../../contexts/RealtimeProvider.jsx';
import { useToast } from '../../../../../contexts/ToastProvider.jsx';
import './QuizMessage.scoped.css';
import './quiz.css';

export default function QuizMessage({ message }) {
  const { data } = useDataStore();

  const { endQuiz, releaseResults } = useRealtime();

  const { toast } = useToast();

  const onEndQuiz = async () => {
    try {
      await endQuiz(message.id);
    } catch (ex) {
      toast('error', 'Error when ending quiz', ex.error);
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
    <div className="quiz-message">
      <div className="message-box quiz-message-box">
        {quiz}
      </div>
      <div className="quiz-controls w-full d-flex">
        {(() => {
          if ((message.sender.id ?? message.sender) === data.user.id) {
            if (!message.content.closedAt) {
              return (
                <Button
                  onClick={onEndQuiz}
                  variant="outline-primary"
                  className="control-button"
                >
                  End quiz
                </Button>
              );
            }
            if (!message.content.resultsReleased) {
              return (
                <Button
                  onClick={onReleaseResults}
                  variant="outline-primary"
                  className="control-button"
                >
                  Release results
                </Button>
              );
            }

            return (
              <span className="text-small text-muted">
                Results released
              </span>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}
