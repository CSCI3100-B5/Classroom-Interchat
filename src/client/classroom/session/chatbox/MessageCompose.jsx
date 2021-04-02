import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default function MessageCompose() {
  return (
    <InputGroup>
      <FormControl
        placeholder="Type your message..."
        aria-label="Type your message"
      />
      <InputGroup.Append>
        <Button variant="outline-secondary">Send</Button>
        <Button variant="outline-secondary">Send as question</Button>
        <Button variant="outline-secondary">Create quiz</Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
