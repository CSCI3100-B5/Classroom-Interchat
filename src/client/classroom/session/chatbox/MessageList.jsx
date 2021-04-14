import React, { useEffect, useRef } from 'react';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import Message from './message/Message.jsx';
import './MessageList.scoped.css';

export default function MessageList() {
  const { data, getSelfParticipant } = useDataStore();

  const unresolvedQuestions = data.messages.filter(x => x.type === 'question' && !x.content.isResolved);

  // TODO: filter by thread
  // TODO: filter unresolved questions only
  // TODO: collapse multiple messages

  let messageList;
  if (!data.messageFilter) {
    messageList = data.messages;
  } else if (data.messageFilter === 'unresolved') {
    messageList = unresolvedQuestions;
  } else {
    const question = data.messages.find(x => x.id === data.messageFilter);
    if (question) {
      messageList = data.messages.filter(
        x => x.id === data.messageFilter || x.content?.replyTo === data.messageFilter
      );
    } else {
      data.messageFilter = null;
      messageList = data.messages;
    }
  }

  const messageEnd = useRef(null);

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList.length]);

  const requestingParticipants = data.participants.filter(x => x.permission === 'requesting');

  return (
    <div className="message-list">
      {getSelfParticipant()
      && getSelfParticipant().permission !== 'student'
      && requestingParticipants.length ? (
        <div>
          {requestingParticipants.length}
          { ' '}
          requesting for instructor permission
        </div>
        ) : null}
      {unresolvedQuestions.length ? (
        <ButtonGroup toggle className="mb-2">
          <ToggleButton
            type="checkbox"
            variant="info"
            checked={data.messageFilter === 'unresolved'}
            value="1"
            onChange={() => {
              if (data.messageFilter === 'unresolved') data.messageFilter = null;
              else data.messageFilter = 'unresolved';
            }}
          >
            {unresolvedQuestions.length}
            {' '}
            unresolved questions
          </ToggleButton>
        </ButtonGroup>
      ) : null}
      <ul>
        {
          messageList.map(message => (
            <li key={message.id}><Message message={message} /></li>
          ))
        }
      </ul>
      <div ref={messageEnd} />
    </div>
  );
}
