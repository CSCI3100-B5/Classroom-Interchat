import React from 'react';
import { Badge } from 'react-bootstrap';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';
import './ReplyMessage.scoped.css';

export default function ReplyMessage({ message }) {
  const { data } = useDataStore();
  return (
    <divout>
      <reply>
        <Badge>REPLY:</Badge>
      </reply>
      <div id="div">

        <div><MarkdownRender>{message.content.content}</MarkdownRender></div>

      </div>
      <p className="text-muted">
        Replying to
        {' '}
        {data.messages.find(x => x.id === message.content.replyTo).content.content}
      </p>
    </divout>
  );
}
