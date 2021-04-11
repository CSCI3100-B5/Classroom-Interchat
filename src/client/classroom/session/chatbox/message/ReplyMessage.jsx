import React from 'react';
import { Badge } from 'react-bootstrap';
import { BsFillReplyFill } from 'react-icons/bs';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';
import './ReplyMessage.scoped.css';


export default function ReplyMessage({ message }) {
  const { data } = useDataStore();
  return (
    <div className="relativeBox">
      <p className="iconRight"><BsFillReplyFill /></p>

      <p className="senderRight">
        reply:
      </p>
      <div className="myMessageRight">
        <div><MarkdownRender>{message.content.content}</MarkdownRender></div>
      </div>
      <p className="replyingToRight">
        Replying to
        {' '}
        {data.messages.find(x => x.id === message.content.replyTo).content.content}
      </p>
    </div>
  );
}
