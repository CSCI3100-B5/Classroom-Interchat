import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

// TODO: reply to question

export default function MessageCompose({ onCreateQuiz }) {
  return (
    <InputGroup>
      <FormControl
        placeholder="Type your message..."
        aria-label="Type your message"
      />
      <InputGroup.Append>
        <Button variant="outline-secondary">Send</Button>
        <Button variant="outline-secondary">Send as question</Button>
        <Button variant="outline-secondary" onClick={onCreateQuiz}>Create quiz</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
