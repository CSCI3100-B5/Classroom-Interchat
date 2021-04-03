import React from 'react';
import { Badge } from 'react-bootstrap';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';

export default function ReplyMessage({ message }) {
  const { messages } = useDataStore();
  return (
    <div>
      <Badge>REPLY</Badge>
      <p>{message.content.content}</p>
      <p className="text-muted">
        Replying to
        {' '}
        {messages.find(x => x.id === message.content.replyTo).content.content}
      </p>
    </div>
  );
}
