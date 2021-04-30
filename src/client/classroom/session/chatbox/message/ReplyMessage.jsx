import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsFillReplyFill } from 'react-icons/bs';
import { useDataStore } from '../../../../contexts/DataStoreProvider.jsx';
import MarkdownRender from './MarkdownRender.jsx';
import './ReplyMessage.scoped.css';

/**
 * A Reply Message, renders the reply content, the gray bar above the
 * message referencing the question it is replying to, and the reply
 * icon
 */
export default function ReplyMessage({ message }) {
  const { data } = useDataStore();

  const replyToMessage = data.messages.find(x => x.id === message.content.replyTo);
  return (
    <div className="reply-message">
      <OverlayTrigger
        placement="top"
        overlay={(
          <Tooltip id="tooltip-reply">
            This is a reply
          </Tooltip>
          )}
      >
        <BsFillReplyFill className="icon-large message-icon" />
      </OverlayTrigger>

      <div className="reply-container">
        <div className="reply-box">
          <span className="reply-text btn">
            Replying to
            {' '}
            {replyToMessage.sender.name}
            {'\'s Question'}
          </span>
          <span className="reply-content btn">
            {replyToMessage.content.content}
          </span>
        </div>
        <div className="message-box reply-message-box shadow-none">
          <MarkdownRender>{message.content.content}</MarkdownRender>
        </div>
      </div>

    </div>
  );
}
