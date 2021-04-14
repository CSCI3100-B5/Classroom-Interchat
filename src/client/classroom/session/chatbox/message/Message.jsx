import React from 'react';
import QuestionMessage from './QuestionMessage.jsx';
import TextMessage from './TextMessage.jsx';
import QuizMessage from './quiz/QuizMessage.jsx';
import StatusMessage from './StatusMessage.jsx';
import ReplyMessage from './ReplyMessage.jsx';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import './Message.scoped.css';
import './message.css';

function Message({ message, index }) {
  const { data } = useDataStore();
  let messageAlign = 'align-items-start msg-left';
  if (!message.sender) {
    messageAlign = 'align-items-center';
  } else {
    if (['mcq', 'saq'].includes(message.type)) {
      messageAlign = 'align-items-center';
    } else if (message.sender.id === data.user.id) {
      messageAlign = 'align-items-end msg-right';
    }
    const pSender = data.participants.find(x => x.user.id === message.sender.id);
    if (pSender && pSender.permission === 'instructor') {
      messageAlign += ' instructor';
    }
  }

  let shouldRenderMeta = true;
  if (index > 0) {
    const lastMsg = data.messages[index - 1];
    if (
      ((lastMsg.sender && message.sender && lastMsg.sender.id === message.sender.id)
      || lastMsg.sender === message.sender)
      && !['mcq', 'saq'].includes(lastMsg.type)
      && !['mcq', 'saq'].includes(message.type)
      && (new Date(message.createdAt)).getTime() - (new Date(lastMsg.createdAt)).getTime() < 1000 * 120) {
      shouldRenderMeta = false;
    }
  }
  return (
    <div className={`d-flex flex-column w-full ${messageAlign}`}>
      {shouldRenderMeta ? (
        <span className="message-meta">
          {message.sender ? `${message.sender.name}, ` : ''}
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      ) : null}

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
