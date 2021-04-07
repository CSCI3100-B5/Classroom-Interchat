import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from '../../../hooks/useStates.js';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';
import { useDataStore } from '../../../contexts/DataStoreProvider.jsx';

// TODO: reply to question

export default function MessageCompose({ onCreateQuiz }) {
  const { sendMessage, sendQuestionMessage } = useRealtime();
  const { data } = useDataStore();

  const messageData = useStates({
    message: '',
  });

  const onSend = () => {
    console.log('The content of message: '.concat(messageData.message));
    sendMessage(messageData.message);
  };

  const onSendAsQuestion = () => {
    console.log(messageData.message);
    sendQuestionMessage(messageData.message);
  };

  const onSendAsReply = () => {
    console.log(messageData.message);
    console.log(data.replyTo);
  };

  return (
    data.replyTo != null
      ? (
        <InputGroup>
          <FormControl
            placeholder="Type your reply..."
            aria-label="Type your reply"
            {...bindState(messageData.$message)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={onSendAsReply}>Send reply</Button>
            <Button variant="outline-secondary" onClick={() => { data.replyTo = null; }}>Cancel reply</Button>
          </InputGroup.Append>
        </InputGroup>
      )
      : (
        <InputGroup>
          <FormControl
            placeholder="Type your message..."
            aria-label="Type your message"
            {...bindState(messageData.$message)}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary" onClick={onSend}>Send</Button>
            <Button variant="outline-secondary" onClick={onSendAsQuestion}>Send as question</Button>
            <Button variant="outline-secondary" onClick={onCreateQuiz}>Create quiz</Button>
          </InputGroup.Append>
        </InputGroup>
      )

  );
}
