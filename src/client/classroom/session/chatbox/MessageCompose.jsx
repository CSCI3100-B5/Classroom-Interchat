import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from '../../../hooks/useStates.js';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';

// TODO: reply to question

export default function MessageCompose({ onCreateQuiz }) {
  const { sendMessage, } = useRealtime();
  const { data } = useDataStore();

  const messageData = useStates({
    message: '',
    information: null
  });

  const onSend = () => {
    console.log('Message object: ', messageData);
    sendMessage(messageData.message, messageData.information);
    messageData.message = '';
    messageData.information = null;
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
              placeholder="Type your reply..."
              aria-label="Type your reply"
              {...bindState(messageData.$message)}
            />
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                onClick={() => { messageData.information = { type: 'reply', qMessageID: data.replyToMessage.id }; onSend(); }}
              >
                Send reply
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      )
      : (
        <InputGroup>
          <FormControl
            placeholder="Type your message..."
            aria-label="Type your message"
            {...bindState(messageData.$message)}
          />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              onClick={() => { messageData.information = { type: 'text' }; onSend(); }}
            >
              Send
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => { messageData.information = { type: 'question' }; onSend(); }}
            >
              Send as question
            </Button>
            <Button variant="outline-secondary" onClick={onCreateQuiz}>Create quiz</Button>
          </InputGroup.Append>
        </InputGroup>
      )

  );
}
