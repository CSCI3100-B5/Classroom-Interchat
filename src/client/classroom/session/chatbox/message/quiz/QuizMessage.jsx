import React from 'react';
import SAQPrompt from './SAQPrompt.jsx';
import SAQResult from './SAQResult.jsx';
import MCQPrompt from './MCQPrompt.jsx';
import MCQResult from './MCQResult.jsx';

export default function QuizMessage({ message }) {
  if (message.content.type === 'SAQ') {
    if (message.content.result) {
      return (<SAQResult message={message} />);
    }
    return (<SAQPrompt message={message} />);
  }

  if (message.content.result) {
    return (<MCQResult message={message} />);
  }
  return (<MCQPrompt message={message} />);
}
