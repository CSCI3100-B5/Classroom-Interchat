import React from 'react';
import PropTypes from 'prop-types';
import QuestionMessage from './QuestionMessage.jsx';
import TextMessage from './TextMessage.jsx';
import QuizMessage from './QuizMessage.jsx';
import StatusMessage from './StatusMessage.jsx';

// The base of all types of messages, besides deciding which message
// component type to be used, it also displays common message
// attributes, such as sender name and timestamp.

function Message(props) {
  const { message } = props;
  return (
    <div>
      <p>{message.sender}</p>
      <p>{message.timestamp}</p>
      {
        () => {
          switch (message.type) {
            case 'Text':
              return (<TextMessage />);
            case 'Quiz':
              return (<QuizMessage />);
            case 'Status':
              return (<StatusMessage />);
            case 'Question':
              return (<QuestionMessage />);
            default:
              return (<p>Unknown message type!</p>);
          }
        }
      }
    </div>
  );
}
Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date),
    type: PropTypes.oneOf(['Text', 'Quiz', 'Status', 'Question'])
  }).isRequired
};

export default Message;
