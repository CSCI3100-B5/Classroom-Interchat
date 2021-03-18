import React from 'react';
import PropTypes from 'prop-types';
import QuestionMessage from './QuestionMessage.jsx';
import TextMessage from './TextMessage.jsx';
import QuizMessage from './QuizMessage.jsx';
import StatusMessage from './StatusMessage.jsx';

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
