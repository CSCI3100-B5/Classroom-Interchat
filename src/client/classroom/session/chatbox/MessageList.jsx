import React from 'react';
import { Button } from 'react-bootstrap';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import Message from './message/Message.jsx';

export default function MessageList() {
  const { data } = useDataStore();

  const unresolvedQuestions = data.messages.filter(x => x.type === 'question' && !x.content.isResolved);

  // TODO: filter by thread
  // TODO: filter unresolved questions only
  // TODO: collapse multiple messages

  let messageList = data.filteredMessages.length > 0 ? data.filteredMessages : data.messages;

  // x is a unresolved question (x exist in the array)
  // or x is a reply to a unresolved question
  const onViewUnresolved = () => {
    messageList = data.messages.filter(x => unresolvedQuestions.includes(x)
      || (x.type === 'reply' && unresolvedQuestions.includes(x.content.replyTo)));
  };

  return (
    <div>
      {unresolvedQuestions.length ? (
        <Button onClick={onViewUnresolved}>
          {unresolvedQuestions.length}
          {' '}
          unresolved questions
        </Button>
      ) : null}
      <ul>
        {
          messageList.map(message => (
            <li key={message.id}><Message message={message} /></li>
          ))
        }
      </ul>
    </div>
  );
}
