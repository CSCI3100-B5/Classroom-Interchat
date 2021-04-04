import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useStates, bindState } from '../../../hooks/useStates.js';

// TODO: reply to question

export default function MessageCompose({ onCreateQuiz }) {
  const data = useStates({
    message: ''
  });

  const onSend = () => {
    console.log(data.message);
  };

  const onSendAsQuestion = () => {
    console.log(data.message);
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
