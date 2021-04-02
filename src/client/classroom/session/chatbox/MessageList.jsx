import React from 'react';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import Message from './message/Message.jsx';

export default function MessageList() {
  const { messages } = useDataStore();

  return (
    <div>
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
