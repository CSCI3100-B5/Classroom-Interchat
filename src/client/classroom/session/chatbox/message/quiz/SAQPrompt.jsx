import React from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

export default function SAQPrompt({ message }) {
  return (
    <div>
      <p>{message.content.prompt}</p>
      <InputGroup>
        <FormControl
          placeholder="Type your answer..."
          aria-label="Type your answer"
        />
        <InputGroup.Append>
          <Button variant="outline-secondary">Send</Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
}
