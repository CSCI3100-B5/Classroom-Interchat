import React from 'react';
import QuestionMessage from './QuestionMessage.jsx';
import TextMessage from './TextMessage.jsx';
import QuizMessage from './quiz/QuizMessage.jsx';
import StatusMessage from './StatusMessage.jsx';
import ReplyMessage from './ReplyMessage.jsx';
import './Message.scoped.css';

function Message({ message }) {
  return (
    <div className="relativeBox">
      <p className="timeRight">
        By sender123456 at
        <p>
          {message.createdAt.toString()}
        </p>
      </p>

      {message.sender ? (<p>{message.sender.name}</p>) : null}
      {
        (() => {
          switch (message.type) {
            case 'text':
              if (message.sender) return (<TextMessage message={message} />);
              return (<StatusMessage message={message} />);
            case 'mcq':
            case 'saq':
              return (<QuizMessage message={message} />);
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
