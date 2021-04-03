import React from 'react';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import Message from './message/Message.jsx';

export default function MessageList() {
  const { messages } = useDataStore();

  const unresolvedQuestions = messages.filter(x => x.type === 'question' && !x.content.isResolved);

  // TODO: filter by thread
  // TODO: filter unresolved questions only
  // TODO: collapse multiple messages

  return (
    <div>
      {unresolvedQuestions.length ? (
        <div>
          {unresolvedQuestions.length}
          {' '}
          unresolved questions
        </div>
      ) : null}
      <ul>
        {
          messages.map(message => (
            <li key={message.id}><Message message={message} /></li>
          ))
        }
      </ul>
    </div>
  );
}
