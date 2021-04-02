import React from 'react';
import QuestionMessage from './QuestionMessage.jsx';
import TextMessage from './TextMessage.jsx';
import QuizMessage from './quiz/QuizMessage.jsx';
import StatusMessage from './StatusMessage.jsx';
import ReplyMessage from './ReplyMessage.jsx';

function Message({ message }) {
  return (
    <div>
      <p>{message.sender.name}</p>
      <p>{message.createdAt.toString()}</p>
      {
        (() => {
          switch (message.type) {
            case 'text':
              return (<TextMessage message={message} />);
            case 'quiz':
              return (<QuizMessage message={message} />);
            case 'status':
              return (<StatusMessage message={message} />);
            case 'question':
              return (<QuestionMessage message={message} />);
            case 'reply':
              return (<ReplyMessage message={message} />);
            default:
              return (
                <p>
                  Unknown message type:
                  {' '}
                  {message.type}
                </p>
              );
          }
        })()
      }
    </div>
  );
}

export default Message;
