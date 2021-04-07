import React from 'react';
import {
  InputGroup, FormControl, Button, Form
} from 'react-bootstrap';
import { useStates, bindState } from '../../../hooks/useStates.js';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';

// TODO: reply to question

export default function MessageCompose({ onCreateQuiz }) {
  const { sendMessage, sendReplyMessage } = useRealtime();
  const { data } = useDataStore();

  const messageData = useStates({
    message: '',
    type: null
  });

  const onSend = () => {
    if (!messageData.message) return;
    console.log('Message object: ', messageData);
    sendMessage(messageData.message, messageData.type);
    messageData.message = '';
    messageData.type = null;
  };

  const onSendAsReply = () => {
    if (!messageData.message) return;
    console.log('Message object: ', messageData);
    console.log(data.replyToMessage.id);
    sendReplyMessage(messageData.message, data.replyToMessage.id);
    messageData.message = '';
    data.replyToMessage.id = null;
  };

  return (
    data.replyToMessage != null
      ? (
        <div>

          <div>
            Replying to
            {' '}
            {data.participants.find(x => x.user.id === data.replyToMessage.sender).user.name}
            {'\'s Question'}
            <Button variant="outline-danger" onClick={() => { data.replyToMessage = null; }}>Cancel reply</Button>
          </div>

          <InputGroup>
            <FormControl
              as="textarea"
              placeholder="Type your reply..."
              aria-label="Type your reply"
              {...bindState(messageData.$message)}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={onSendAsReply} disabled={!messageData.message}>Send reply</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      )
      : (
        <InputGroup>
          <FormControl
            as="textarea"
            placeholder="Type your message..."
            aria-label="Type your message"
            {...bindState(messageData.$message)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={() => { messageData.type = 'text'; onSend(); }} disabled={!messageData.message}>Send</Button>
            <Button variant="outline-secondary" onClick={() => { messageData.type = 'question'; onSend(); }} disabled={!messageData.message}>Send as question</Button>
            <Button variant="outline-secondary" onClick={onCreateQuiz}>Create quiz</Button>
          </InputGroup.Append>
        </InputGroup>
      )

  );
}
