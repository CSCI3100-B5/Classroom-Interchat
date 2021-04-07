import React from 'react';
import { Badge } from 'react-bootstrap';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';

export default function ReplyMessage({ message }) {
  const { data } = useDataStore();
  return (
    <div>
      <Badge>REPLY</Badge>
      <div><MarkdownRender>{message.content.content}</MarkdownRender></div>
      <p className="text-muted">
        Replying to
        {' '}
        {data.messages.find(x => x.id === message.content.replyTo).content.content}
      </p>
    </div>
  );
}
