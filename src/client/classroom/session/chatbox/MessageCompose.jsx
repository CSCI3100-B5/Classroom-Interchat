import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from '../../../hooks/useStates.js';
import { useRealtime } from '../../../contexts/RealtimeProvider.jsx';

// TODO: reply to question

export default function MessageCompose({ onCreateQuiz }) {
  const { sendMessage, sendQuestionMessage } = useRealtime();

  const data = useStates({
    message: ''
  });

  const onSend = () => {
    console.log('The content of message: '.concat(data.message));
    sendMessage(data.message);
  };

  const onSendAsQuestion = () => {
    console.log(data.message);
    sendQuestionMessage(data.message);
  };

  return (
    <InputGroup>
      <FormControl
        placeholder="Type your message..."
        aria-label="Type your message"
        {...bindState(data.$message)}
      />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={onSend}>Send</Button>
        <Button variant="outline-secondary" onClick={onSendAsQuestion}>Send as question</Button>
        <Button variant="outline-secondary" onClick={onCreateQuiz}>Create quiz</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
