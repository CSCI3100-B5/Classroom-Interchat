import React, { useEffect, useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';
import Message from './message/Message.jsx';
import './MessageList.scoped.css';

/**
 * Renders all messages in chronological order
 * Also handles all the message filtering logic
 */
export default function MessageList() {
  const { data } = useDataStore();

  const unresolvedQuestions = data.messages.filter(x => x.type === 'question' && !x.content.isResolved);
  const ongoingQuizzes = data.messages.filter(x => ['mcq', 'saq'].includes(x.type) && !x.content.closedAt);

  let messageList; // the list of messages to be rendered

  // apply the message filter, if specified
  if (!data.messageFilter) {
    messageList = data.messages;
  } else if (data.messageFilter === 'unresolved') {
    messageList = unresolvedQuestions;
  } else if (data.messageFilter === 'quiz') {
    messageList = ongoingQuizzes;
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

  // DOM reference to a dummy div at the bottom of the message list
  // this is used to scroll the list to the bottom when new messages are
  // received
  const messageBtm = useRef(null);

  useEffect(() => {
    if (messageBtm) messageBtm.current.scrollIntoView({ behavior: 'smooth' });
  }, [messageList.length]);

  return (
    <Container className="message-list-container">
      <div className="message-list">
        {
          messageList.map((message, idx) => (
            <Row key={message.id}><Message message={message} index={idx} /></Row>
          ))
        }
        <div ref={messageBtm} />
      </div>
    </Container>
  );
}
